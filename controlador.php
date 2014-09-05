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
			/*echo "<pre>";
			print_r($_POST);
			echo "</pre>";*/
			$ubicaciones=$objM->extraerPosicionesHistorico($_POST["idUnidad"],$_POST["idUsuario"],$_POST["clienteId"]);
			//echo "<br><br>";
			echo $ubicaciones;
		break;
	}
}