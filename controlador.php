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
			echo $res=$objM->cargarUltimasPosiciones($_POST["filtro"],$_POST["idUsuario"],$_POST["clienteId"]);
			//NUEVO PROCESO PARA PINTAR LAS POSICIONES EXTRAIDAS DE LA BASE DE DATOS
			/*
			$cadena=$res;
			echo "<br><br>".$cadena;
			$elementos=explode("||||",$cadena);
			//proceso de copiado de arrays
			$array_temporal=$elementos;//se copia al array temporal
			$array_posiciones=$array_temporal;//del temporal se copia a las posiciones
			unset($array_temporal);			
			unset($elementos);

			echo "<pre>";
			print_r($array_posiciones);
			echo "</pre>";
			$tpl->set_filenames(array('controlador' => 'tUltimasPosiciones'));
			for($i=0;$i<count($array_posiciones);$i++){
				$datosUnidad=explode(",",$array_posiciones[$i]);
				echo "<pre>";
				print_r($datosUnidad);
				echo "</pre>";
				$tpl->assign_block_vars('listadoPosiciones',array(
					'ID'  				=> $datosUnidad[0],
					'FECHA'  			=> $datosUnidad[3],
					'EVENTO'  			=> $datosUnidad[5],
					'ESTATUS'  			=> $datosUnidad[10],
					'COLSTUS'  			=> $datosUnidad[11],
					'PDI'  				=> $datosUnidad[14],
					'VEL'  				=> $datosUnidad[4],
					'DIRE'  			=> $datosUnidad[15],
					'PRIORY'  			=> $datosUnidad[2],
					'LATITUD'  			=> $datosUnidad[6],
					'LONGITUD'  		=> $datosUnidad[7],
					'DESUNIDAD'  		=> $datosUnidad[1],
					'ICONS'  			=> $datosUnidad[12],
					'ANGULO'  			=> $datosUnidad[9],
					'COLPRIO'  			=> $datosUnidad[8],
					'BLOCKMOTOR'  		=> $datosUnidad[12],
					'TYPE'  			=> $datosUnidad[20],
					'BATTERY'  			=> $datosUnidad[13],
					'TYPE_LOC'  		=> $datosUnidad[19],
					'DISTANCIA'  		=> $datosUnidad[16],
					'RADIOLBS'  		=> 0,
					'IMAGE'  			=> "",
					'COLORIMAGE'  		=> "",
					'TEXTOMENSAJE'  	=> "",
					'OTROSCAMPOS'  		=> "",
					'TYPELOC'  			=> "",
					'STRINGLOC'  		=> "",
					'CODTYPEEQUIPMENT'	=> $datosUnidad[21],
					'COMANDOS'  		=> $datosUnidad[22],
					'IMEI'  			=> $datosUnidad[23],
					'SERVIDOR'  		=> $datosUnidad[24],
					'INSTANCIA'  		=> $datosUnidad[25],
					'FONDOFILA'  		=> "#FFF"
				));
			}
			$tpl->pparse('controlador');
			*/
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
		case "mostrarTipoGeoreferencias":
			//echo "<pre>";
			//print_r($_POST);
			//echo "</pre>";
			echo $tiposG=$objM->obtenerTiposGeoreferencias($_POST["usuarioId"],$_POST["clienteId"],$_POST["filtroGeo"]);
		break;
		case "extraerDatosGeoreferencia":
			$resultado=$objM->extraerInfoGeoreferencia($_POST["usuarioId"],$_POST["clienteId"],$_POST["idObjectMap"]);
			$resultado=explode("||", $resultado);
			echo "<div style='border-bottom:1px solid blue;'>Informaci&oacute;n Georeferencia</div><table border='0' id='tblinfoUnidadGlobo' cellpadding='1' cellspacing='1' width='380'>
				<tr>
					<td width='130' class='estiloTituloTablaInfoUnidad'>Clasificado como:</td>
					<td width='270'>".$resultado[0]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Descripcion:</td>
					<td>".$resultado[1]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Calle:</td>
					<td>".$resultado[2]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>No. Interior:</td>
					<td>".$resultado[3]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>No. Ext:</td>
					<td>".$resultado[4]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Colonia:</td>
					<td>".$resultado[5]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Municipio:</td>
					<td>".$resultado[6]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Estadp:</td>
					<td>".$resultado[7]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>C.P.:</td>
					<td>".$resultado[8]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Latitud:</td>
					<td>".$resultado[9]."</td>
				</tr>
				<tr>
					<td class='estiloTituloTablaInfoUnidad'>Longitud:</td>
					<td>".$resultado[10]."</td>
				</tr>
			</table>";
		break;
	}
}