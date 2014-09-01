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
   	public function cargarUltimasPosiciones($filtro,$idUsuario,$idCliente){
   		$strUltimasPosiciones="";
   		$arrayUnidades=explode(",",$filtro);
   		//echo "<pre>";
   		//print_r($arrayUnidades);
   		//echo "</pre>";
   		//instancias de las otras clases necesarias
   		$cPositions=new cPositions();
   		$functions=new cFunctions();
   		$lbsClass = new LocationBasedService();
    	$lbsClass->setConfigBdParams($configBdLbs);
   		$ultimasPosiciones=$cPositions->get_last_position1($arrayUnidades,$idCliente,"",$idUsuario);
   		//echo "<br>Cantidad de ultimas posiciones".count($ultimasPosiciones);
   		//echo "<pre>";
   		//print_r($ultimasPosiciones);
   		//echo "</pre>";
   		//se recorre el array obtenido para verificar que la latiud y longitud sean diferentes a 0
   		$idUnidadesRespuesta=array();
   		for($i=0;$i<count($ultimasPosiciones);$i++){
     			$idUnidadesRespuesta[]=$ultimasPosiciones[$i][0];
     			//inicia proceso de localizacion alternativa
     			if($ultimasPosiciones[$i][6] != "0.000000" && $ultimasPosiciones[$i][7] != "0.000000" && $ultimasPosiciones[$i][19] !="NULL" && $ultimasPosiciones[$i][19] !="0"){                                
            	$direccion1 = $cPositions->direccion_no_format($ultimasPosiciones[$i][6],$ultimasPosiciones[$i][7]);
            	$new_dir= $functions->codif($direccion1);      
            	$buscarPDI=true;          
        	}else if($ultimasPosiciones[$i][6] == "0.000000" && $ultimasPosiciones[$i][6] == "0.000000"){
                $lbsClass->setLbsGCI($ultimasPosiciones[$i][17]);
                $lbsClass->setLbsMac($ultimasPosiciones[$i][18]);
                $lbsClass->setLbsLAI(0);
                $Posiciones = $lbsClass->buscarPosicion();
                if($Posiciones['status'] =='ok-info'){
                    $ultimasPosiciones[$i][6]   = $Posiciones['latittud'];
                    $ultimasPosiciones[$i][7]   = $Posiciones['longitud'];
                    $direccion1 = $cPositions->direccion_no_format($ultimasPosiciones[$i][6],$ultimasPosiciones[$i][7]);
                    $new_dir    = $functions->codif($direccion1);      
                    $buscarPDI  = true;                     
    
                    if($Posiciones['origen']=='WIFI'){
                        $ultimasPosiciones[$i][19] = 2;  
                    }else if($Posiciones['origen']=='GCI'){
                        $ultimasPosiciones[$i][19] = 3;
                    }                    
                }
            }else if($ultimasPosiciones[$i][6] != "0.000000" && $ultimasPosiciones[$i][7] != "0.000000" && $ultimasPosiciones[$i][19] =="NULL" || $ultimasPosiciones[$i][19] =="0"){         
                $ultimasPosiciones[$i][19] = 1;  
                $direccion1 = $cPositions->direccion_no_format($ultimasPosiciones[$i][6],$ultimasPosiciones[$i][7]);
                $new_dir= $functions->codif($direccion1);      
                $buscarPDI=true;                    
            }
            //termina el proceso de localizacion alternativa
            ($strUltimasPosiciones=="") ? $strUltimasPosiciones=implode(",", $ultimasPosiciones[$i]) : $strUltimasPosiciones.="|||||".implode(",",$ultimasPosiciones[$i]);
   		}
   		//comparamos los arrays el de unidades y el de las ultimas posiciones
      $resultado=array_diff($arrayUnidades, $idUnidadesRespuesta);
      $resultado=implode(",,", $resultado);
      //echo "<pre>";
      //print_r($resultado);
      //echo "</pre>";
      //return $strUltimasPosiciones."||||".$resultado;
      return $strUltimasPosiciones."????".$resultado;
   	}
   	/**
  	*@method 		iniciar Conexion con la BD
  	*@description 	Funcion para conectar con la base de datos
  	*@paramas 		
  	*
  	*/
   	public function cargarGrupos($idUsuario){
   		$objDb=$this->iniciarConexionDb();
   		$sqlG="SELECT ADM_GRUPOS.ID_GRUPO, ADM_GRUPOS.NOMBRE, ADM_USUARIOS_GRUPOS.COD_ENTITY,ADM_UNIDADES.DESCRIPTION
            FROM (ADM_USUARIOS_GRUPOS INNER JOIN ADM_GRUPOS ON ADM_GRUPOS.ID_GRUPO = ADM_USUARIOS_GRUPOS.ID_GRUPO) 
		        INNER JOIN ADM_UNIDADES ON ADM_USUARIOS_GRUPOS.COD_ENTITY=ADM_UNIDADES.COD_ENTITY
            WHERE ADM_USUARIOS_GRUPOS.ID_USUARIO = '".$idUsuario."' ORDER BY NOMBRE,COD_ENTITY";
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