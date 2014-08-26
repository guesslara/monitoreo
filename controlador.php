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
			/*echo "<pre>";
			print_r($_POST);
			echo "</pre>";*/
			$strGrupos=$objM->cargarGrupos($_POST["idUsuario"]);
			echo "<br>".$strGrupos;
			$strGrupos=explode("|",$strGrupos);
			echo "<pre>";
			print_r($strGrupos);
			echo "</pre>";
		break;
	}
}