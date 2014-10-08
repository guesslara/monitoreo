<?php
/**
*@name 				Controlador para las funciones de MONITOREO
*@copyright         Air Logistics & GPS S.A. de C.V.  
*@author 			Gerardo Lara
*@version 			1
*@fecha 			26 Agosto 2014
*/

if($_SERVER["HTTP_REFERER"]==""){
	echo "0";
}else{
	include "claseMonitoreo.php";
	$objM=new monitoreo();
	switch($_POST["action"]){
		case "cargarGrupos":
			$strGrupos=$objM->cargarGrupos($_POST["idUsuario"]);
			echo $strGrupos;
		break;
		case "cargarUltimasPosiciones":
			$res=$objM->cargarUltimasPosiciones($_POST["filtro"],$_POST["idUsuario"],$_POST["clienteId"]);
			echo $res;
		break;
		case "pintarUbicaciones":
			$ubicaciones=$objM->extraerPosicionesHistorico($_POST["idUnidad"],$_POST["idUsuario"],$_POST["clienteId"]);
			echo $ubicaciones;
		break;
		case "cargarComandosUnidad":
			/*echo "<pre>";
			print_r($_POST);
			echo "</pre>";*/
			$option="";
			$comandos=$objM->extraerComandosUnidad($_POST["idUsuario"],$_POST["clienteId"],$_POST["tipo"]);
			if($comandos=="0"){
				echo "<div class='ui-state-error ui-corner-all' style='padding:0.7em;'><p><span class='ui-icon ui-icon-alert' style='float:left;margin-right:.3em;'></span>La unidad no tiene Comandos asignados</p></div>";
			}else{
				$listado=explode("%%%%",$comandos);
				$imei=$_POST["imei"];
				$idUnidad=$_POST["idUnidad"];
				$servidor=$_POST["servidor"];
				$instancia=$_POST["instancia"];
				$tpl->set_filenames(array('controlador' => 'tEnvioComandos'));
				$tpl->assign_vars(array(
					'IMEI'          	=> $imei,
					'IDUNIDAD'       	=> $idUnidad,
					'SERVIDOR'			=> $servidor,
					'INSTANCIA'			=> $instancia
				));
				for($i=0;$i<count($listado);$i++){
				    $values = explode("%%%",$listado[$i]);
				    $tpl->assign_block_vars('listadoComandos',array(
						'VALUE'  		=> $values[1],
						'DESCRIPCION' 	=> $values[0]
					));
				}
				$tpl->pparse('controlador');
			}
		break;
		case "enviarComando":
			/*echo "<pre>";
			print_r($_POST);
			echo "</pre>";*/
			//se reciben los parametros para el envio de los comandos
			$id_row = $_POST['command']; 
			$imei 	= $_POST['imei']; 
			$comment= $_POST['comment'];
			$unit   = $_POST['idUnidad'];
			$servidor= $_POST['servidor'];//variable nueva
			$instancia =$_POST['instancia'];//variable nueva
			$usuarioId = $_POST["usuarioId"];
			$clienteId = $_POST["clienteId"];
			
			$Comandos =  new cCommands();
			$Comandos->set_config_bd($config_bd);
			$Comandos->set_unidad($unit);
			$Comandos->set_idcomando($id_row);
			$Comandos->set_usuario($usuarioId);
			$Comandos->set_comentario($comment);
			$Comandos->set_origen('movilidad');
			$Comandos->set_servidor($servidor);
			$Comandos->set_instancia($instancia);

			$save = $Comandos->guarda_comando();
		
			if($save=='send'){
				$response = 'send';		
			}else if($save=='no-perm'){
				$response = 'no-perm';
			}else if($save=='pending'){
				$response = 'pending';
			}else{
				$response = 'problem';
			}
			echo $response;
			
		break;
		case "mostrarGeoreferencias":
			/*echo "<pre>";
			print_r($_POST);
			echo "</pre>";*/
			echo $georeferencias=$objM->obtenerGeoreferencias($_POST["usuarioId"],$_POST["clienteId"]);
		break;

	}
}