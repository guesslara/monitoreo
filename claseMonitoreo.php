<?php
/**
*@description       Clase para el manejo de las diferentes operaciones en el modulo de monitoreo
*@copyright         Air Logistics & GPS S.A. de C.V.  
*@author 			Gerardo Lara
*@version 			1.0.0
*/

class monitoreo{

	private $objDb;
	private $host;
	private $port;
	private $bname;
	private $user;
	private $pass;

	function __construct() {
		include "config/database.php";
		$this->host=$config_bd['host'];
		$this->port=$config_bd['port'];
		$this->bname=$config_bd['bname'];
		$this->user=$config_bd['user'];
		$this->pass=$config_bd['pass'];
   	}
	/**
	*@method 		iniciar Conexion con la BD
	*@description 	Funcion para conectar con la base de datos
	*@paramas 		
	*
	*/
   	private function iniciarConexionDb(){
   		$objBd=new sql($this->host,$this->port,$this->bname,$this->user,$this->pass);
   		return $objBd;
   	}

   	public function cargarGrupos($idUsuario){
   		$objDb=$this->iniciarConexionDb();
   		$sqlG="SELECT ADM_GRUPOS.ID_GRUPO, ADM_GRUPOS.NOMBRE, ADM_USUARIOS_GRUPOS.COD_ENTITY,ADM_UNIDADES.DESCRIPTION
        FROM (ADM_USUARIOS_GRUPOS INNER JOIN ADM_GRUPOS ON ADM_GRUPOS.ID_GRUPO = ADM_USUARIOS_GRUPOS.ID_GRUPO) 
		INNER JOIN ADM_UNIDADES ON ADM_USUARIOS_GRUPOS.COD_ENTITY=ADM_UNIDADES.COD_ENTITY
        WHERE ADM_USUARIOS_GRUPOS.ID_USUARIO = '".$idUsuario."'
        ORDER BY NOMBRE,COD_ENTITY";
        $resM= $objDb->sqlQuery($sqlG);
        if($objDb->sqlEnumRows($resM) != 0){
        	 //se almacena el contenido en un array
        	$strGrupos="";
        	while($row=$objDb->sqlFetchArray($resM)){
            	if($strGrupos==""){
                	$strGrupos=$row['ID_GRUPO'].",".$row['NOMBRE'].",".$row['COD_ENTITY'].",".$row['DESCRIPTION'];    
            	}else{
                	$strGrupos.="|".$row['ID_GRUPO'].",".$row['NOMBRE'].",".$row['COD_ENTITY'].",".$row['DESCRIPTION'];    
            	}
            }
        }
        return $strGrupos;
   	}

}//fin de la clase