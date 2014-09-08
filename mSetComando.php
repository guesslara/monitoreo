<?php
/** *              
 *  @name                Script que registra un comando
 *  @copyright           Air Logistics & GPS S.A. de C.V.   
 *  @author              Enrique Pe?a 
 *  @modificado          17-04-2013
**/
	$db = new sql($config_bd['host'],$config_bd['port'],$config_bd['bname'],$config_bd['user'],$config_bd['pass']);
	$id_row	= 0;
	$response = array('result' => 'no-data');
	if(isset($_GET['data']) && isset($_GET['imei']) && isset($_GET['comment']) && isset($_GET['unit'])){
		$id_row = $_GET['data']; 
		$imei 	= $_GET['imei']; 
		$comment= $_GET['comment'];
		$unit   = $_GET['unit'];
		$servidor= $_GET['servidor'];//variable nueva
		$instancia =$_GET['instancia'];//variable nueva
		
		$Comandos =  new cCommands();
		$Comandos->set_config_bd($config_bd);
		$Comandos->set_unidad($unit);
		$Comandos->set_idcomando($id_row);
		$Comandos->set_usuario($userAdmin->user_info['ID_USUARIO']);
		$Comandos->set_comentario($comment);
		$Comandos->set_origen('movilidad');
		$Comandos->set_servidor($servidor);
		$Comandos->set_instancia($instancia);

		$save = $Comandos->guarda_comando();
		
		if($save=='send'){
			$response = array('result' => 'send');		
		}else if($save=='no-perm'){
			$response = array('result' => 'no-perm');
		}else if($save=='pending'){
			$response = array('result' => 'pending');
		}else{
			$response = array('result' => 'problem');
		}								
	}
	echo json_encode( $response );
?>