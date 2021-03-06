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
    /**
    *@method        extrae el nombre de la tabal historico
    *@description   Obtiene el nombre de la tabla historico del cliente
    *@paramas
    */
    private function extraerNombreTabla($idCliente){
      $idCliente = (int)$idCliente; 
      $table_name = '';   
      if (strlen($idCliente) < 5) {
          $table_name = str_repeat('0', (5-strlen($idCliente)));
      }
      return $table_name . $idCliente;
    }
    public function cargarMenuAdministracion($perfil){
      $mensaje="";
      $objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES utf8");
      $sql ="SELECT ADM_SUBMENU.ID_SUBMENU,DESCRIPTION,UBICACION
      FROM ADM_PERFIL_PERMISOS INNER JOIN ADM_SUBMENU ON ADM_SUBMENU.ID_SUBMENU = ADM_PERFIL_PERMISOS.ID_SUBMENU
      WHERE ADM_PERFIL_PERMISOS.ID_PERFIL = ".$perfil." AND ADM_SUBMENU.TIPO = 'M' ORDER BY ADM_SUBMENU.DESCRIPTION  ASC";
      $res=$objDb->sqlQuery($sql);
      if($objDb->sqlEnumRows($res)==0){
        $mensaje="0";//no hay resultados
      }else{
        while($rowMenu=$objDb->sqlFetchArray($res)){
          if($mensaje==""){
            $mensaje=$rowMenu['ID_SUBMENU']."??".$rowMenu['DESCRIPTION']."??".$rowMenu["UBICACION"];
          }else{
            $mensaje.="|||".$rowMenu['ID_SUBMENU']."??".$rowMenu['DESCRIPTION']."??".$rowMenu["UBICACION"];
          }
        }
      }
      return $mensaje;
    }
    /**
    *@method        ultimos eventos
    *@description   Extrae los ultimos eventos generados
    *@paramas
    */
    public function verUltimosEventos($idUsuario){
      $mensaje="";
      $objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES 'utf8'");
      $sql="SELECT h.COD_HISTORY,u.DESCRIPTION AS UNIT, h.GPS_DATETIME AS DATE, e.DESCRIPTION AS EVENTO, h.LATITUD, h.LONGITUD
            FROM HIST1143_LOCK h INNER JOIN ADM_UNIDADES u ON h.COD_ENTITY = u.COD_ENTITY INNER JOIN ADM_EVENTOS  e ON e.COD_EVENT  = h.COD_EVENT
            WHERE h.COD_ENTITY IN (SELECT COD_ENTITY FROM ADM_USUARIOS_GRUPOS WHERE ID_USUARIO = ".$idUsuario.") AND   h.GPS_DATETIME > NOW()-INTERVAL 1 HOUR /*AND CAST(h.GPS_DATETIME AS DATE) < CURRENT_DATE()*/ ORDER BY h.FECHA_SAVE DESC ";
      $res=$objDb->sqlQuery($sql);
      $cPositions=new cPositions();
      /*
      $direction = $Positions->direccion_no_format($row['LATITUD'],$row['LONGITUD']);
      $data .= ($data!="") ? ', ': '';
      $data .= '{"ID"    : "'.$row['COD_HISTORY'].'" , '.
         ' "UNIT"  : "'.$row['UNIT'].'" , '.
         ' "DATE"  : "'.$row['DATE'].'" , '.             
         ' "EVENT" : "'.$row['EVENTO'].'" , '.
         ' "LAT"   : "'.$row['LATITUD'].'" , '.
         ' "LON"   : "'.$row['LONGITUD'].'" , '.
           ' "DIR"   : "'.$direction.'" }';
      */
      //while($row=$objDb->sqlFetchArray($res)){
        //echo "<br>".$direction = $cPositions->direccion_no_format($row['LATITUD'],$row['LONGITUD']);
      //}
      $grid=new gridDatos();
      $grid->mostrarDatos($sql);
    }
    /**
    *@method        extrae los tipos de georeferencias
    *@description   Extrae los tipos de georeferencias
    *@paramas
    */
    public function obtenerTiposGeoreferencias($usuarioId,$clienteId,$filtroGeo){
      $mensaje="";
      $objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES 'utf8'");
      if($filtroGeo=="G"){
        $sqlTipo="SELECT ADM_GEOREFERENCIAS_TIPO.DESCRIPCION AS DESCRIPCION_GEO,ID_OBJECT_MAP,ADM_GEOREFERENCIAS.DESCRIPCION AS DESCRIPCION,LATITUDE,LONGITUDE,ADM_GEOREFERENCIAS.TIPO AS TIPO,URL,CALLE,NO_INT,NO_EXT,COLONIA,MUNICIPIO,ESTADO,CP
        FROM (ADM_GEOREFERENCIAS INNER JOIN ADM_GEOREFERENCIAS_TIPO ON ADM_GEOREFERENCIAS.ID_TIPO_GEO=ADM_GEOREFERENCIAS_TIPO.ID_TIPO) INNER JOIN ADM_IMAGE ON ADM_GEOREFERENCIAS_TIPO.ID_IMAGE=ADM_IMAGE.ID_IMG
        WHERE ADM_GEOREFERENCIAS.TIPO='".$filtroGeo."' AND ACTIVO='S' AND ADM_GEOREFERENCIAS.ID_CLIENTE='".$clienteId."'  AND ADM_GEOREFERENCIAS_TIPO.ID_CLIENTE='".$clienteId."'
        ORDER BY ADM_GEOREFERENCIAS.ID_TIPO_GEO";
      }else if($filtroGeo=="C" || $filtroGeo=="R"){
        $sqlTipo="SELECT ADM_GEOREFERENCIAS_TIPO.DESCRIPCION AS DESCRIPCION_GEO,ADM_GEOREFERENCIAS.ID_OBJECT_MAP AS ID_OBJECT_MAP,ADM_GEOREFERENCIAS.DESCRIPCION AS DESCRIPCION,ADM_GEOREFERENCIAS.TIPO AS TIPO,URL,ASTEXT(GEOM) AS GEOM,ADM_COLORES.DESCRIPTION AS COLOR,R,G,B
        FROM (((ADM_GEOREFERENCIAS INNER JOIN ADM_GEOREFERENCIAS_TIPO ON ADM_GEOREFERENCIAS.ID_TIPO_GEO=ADM_GEOREFERENCIAS_TIPO.ID_TIPO) 
        INNER JOIN ADM_IMAGE ON ADM_GEOREFERENCIAS_TIPO.ID_IMAGE=ADM_IMAGE.ID_IMG) 
        INNER JOIN ADM_GEOREFERENCIAS_ESPACIAL ON ADM_GEOREFERENCIAS.ID_OBJECT_MAP=ADM_GEOREFERENCIAS_ESPACIAL.ID_OBJECT_MAP)
        INNER JOIN ADM_COLORES ON ADM_GEOREFERENCIAS.COD_COLOR=ADM_COLORES.COD_COLOR
        WHERE ADM_GEOREFERENCIAS.TIPO='".$filtroGeo."' AND ACTIVO='S' AND ADM_GEOREFERENCIAS.ID_CLIENTE='".$clienteId."'
        ORDER BY ADM_GEOREFERENCIAS.ID_TIPO_GEO";
      }
      


      $res=$objDb->sqlQuery($sqlTipo);
      if($objDb->sqlEnumRows($res)==0){
        $mensaje="0";
      }else{
        while($row=$objDb->sqlFetchArray($res)){//se pintan los datos
          if($filtroGeo=="G"){
            ($mensaje=="") ? $mensaje=trim(str_replace(array(",","."), " ", $row["DESCRIPCION_GEO"])).",".$row["ID_OBJECT_MAP"].",".trim(str_replace(array(",","."), " ", $row["DESCRIPCION"])).",".$row["LATITUDE"].",".$row["LONGITUDE"].",".$row["TIPO"].",".$row["URL"].",".str_replace(",", "-", $row["CALLE"]).",".$row["NO_INT"].",".$row["NO_EXT"].",".str_replace(",", "-", $row["COLONIA"]).",".$row["MUNICIPIO"].",".$row["ESTADO"].",".$row["CP"] : $mensaje.="||||".str_replace(",", "-", $row["DESCRIPCION_GEO"]).",".$row["ID_OBJECT_MAP"].",".str_replace(",", "-", $row["DESCRIPCION"]).",".$row["LATITUDE"].",".$row["LONGITUDE"].",".$row["TIPO"].",".$row["URL"].",".str_replace(",", "-", $row["CALLE"]).",".$row["NO_INT"].",".$row["NO_EXT"].",".str_replace(",", "-", $row["COLONIA"]).",".$row["MUNICIPIO"].",".$row["ESTADO"].",".$row["CP"];
          }else if($filtroGeo=="C" || $filtroGeo=="R"){
            $funciones = new cFunctions();
            $color_rgb  = $funciones->rgb2html($row['R'],$row['G'],$row['B']);
            ($mensaje=="") ? $mensaje=trim(str_replace(array(",","."), " ", $row["DESCRIPCION_GEO"])).",".$row["ID_OBJECT_MAP"].",".trim(str_replace(array(",","."), " ", $row["DESCRIPCION"])).",".$row["COLOR"].",".$color_rgb.",".$row["TIPO"].",".$row["URL"].",".str_replace(",", "*", $row["GEOM"]) : $mensaje.="||||".str_replace(",", "-", $row["DESCRIPCION_GEO"]).",".$row["ID_OBJECT_MAP"].",".str_replace(",", "-", $row["DESCRIPCION"]).",".$row["COLOR"].",".$color_rgb.",".$row["TIPO"].",".$row["URL"].",".str_replace(",", "*", $row["GEOM"]);
          }
          
        }  
      }
      echo $mensaje;
    }
    /**
    *@method        extrae las georeferencias
    *@description   Extrae los comandos para la unidad
    *@paramas
    */
    public function obtenerGeoreferencias($usuarioId,$clienteId){
      $dbf = new dbFunctions();
      $funciones = new cFunctions();
      $respuesta="";
      $objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES 'utf8'");
      
      $sql = "SELECT ID_OBJECT_MAP AS ID, ADM_GEOREFERENCIAS.TIPO,ADM_GEOREFERENCIAS.DESCRIPCION AS NOMBRE, PRIVACIDAD,LATITUDE,LONGITUDE,IF(COD_COLOR IS NULL, '0',COD_COLOR) AS COD_COLOR,IF(ADM_GEOREFERENCIAS_TIPO.IMAGE IS NULL,ADM_IMAGE.URL,ADM_GEOREFERENCIAS_TIPO.IMAGE) AS IMAGE
          FROM ADM_GEOREFERENCIAS
          LEFT JOIN ADM_GEOREFERENCIAS_TIPO ON ADM_GEOREFERENCIAS.ID_TIPO_GEO = ADM_GEOREFERENCIAS_TIPO.ID_TIPO
          LEFT JOIN ADM_IMAGE ON ADM_IMAGE.ID_IMG = ADM_GEOREFERENCIAS_TIPO.ID_IMAGE
          WHERE ADM_GEOREFERENCIAS.ID_ADM_USUARIO = ".$usuarioId." OR (ADM_GEOREFERENCIAS.PRIVACIDAD = 'C' AND ADM_GEOREFERENCIAS.ID_CLIENTE = ".$clienteId.") OR (ADM_GEOREFERENCIAS.PRIVACIDAD = 'T' AND ADM_GEOREFERENCIAS.ID_CLIENTE = ".$clienteId.")  AND ADM_GEOREFERENCIAS.TIPO IN ('C','G','R')";
      //echo $sql;      
      $query = $objDb->sqlQuery($sql);
      while($row = $objDb->sqlFetchArray($query)){
        $color    = $dbf->getRow('ADM_COLORES','COD_COLOR='.@$row['COD_COLOR']);
        $color_rgb  = $funciones->rgb2html($color['R'],$color['G'],$color['B']);
            
        $respuesta .= ($respuesta=="") ? "": "|";
        $respuesta .= $row['TIPO']."!".$color_rgb."!".$row['IMAGE']."!".$row['NOMBRE']."!".$row['LATITUDE']."!".$row['LONGITUDE']."!";
        
        if($row['TIPO']=='C'){
          $a_position='';
          $sql_spatial = "SELECT ASTEXT(GEOM) AS GEO FROM ADM_GEOREFERENCIAS_ESPACIAL WHERE ID_OBJECT_MAP = ".$row['ID'];
          $query_spatial = $objDb->sqlQuery($sql_spatial);
          $row_spatial   = $objDb->sqlFetchArray($query_spatial);
          if($row_spatial['GEO']!=NULL){
            $last = $row_spatial['GEO'].length - 3; 
            $mult = substr($row_spatial['GEO'] ,9 ,$last);
            $pre_positions=split(",",$mult);
            for($p=0;$p<count($pre_positions);$p++){  
              $a_position .= ($a_position=="") ? '':'&';          
              $fixed = str_replace(' ','*',$pre_positions[$p]); 
              $a_position .= ''.$fixed.'';
            }     
          }
          $respuesta .= $a_position; 
        }else if($row['TIPO']=='R'){
          $a_position='';
          $sql_spatial = "SELECT ASTEXT(GEOM) AS GEO FROM ADM_GEOREFERENCIAS_ESPACIAL WHERE ID_OBJECT_MAP = ".$row['ID'];
          $query_spatial = $objDb->sqlQuery($sql_spatial);
          $row_spatial   = $objDb->sqlFetchArray($query_spatial);
          if($row_spatial['GEO']!=NULL){
            $last = $row_spatial['GEO'].length - 1;
            $mult = substr($row_spatial['GEO'] ,11 ,$last);
            $pre_positions=split(",",$mult);
            for($p=0;$p<count($pre_positions);$p++){  
              $a_position .= ($a_position=="") ? '':'&';          
              $fixed = str_replace(' ','*',$pre_positions[$p]); 
              $a_position .= ''.$fixed.'';
            }
          }
          $respuesta .= $a_position; 
        }else{
          $respuesta .= "null";
        }
      }
      echo $respuesta;
      //return $respuesta;
    }
    /**
    *@method        extrae los comandos para el tipo de unidad
    *@description   Extrae los comandos para la unidad
    *@paramas
    */
    public function extraerComandosUnidad($idUsuario,$clienteId,$idTipoEquipo){
      $cmdsR="";
      $objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES 'utf8'");
      $sql_cmds="SELECT F.DESCRIPCION,F.COD_EQUIPMENT_PROGRAM 
      FROM ADM_COMANDOS_SALIDA E 
        LEFT JOIN ADM_COMANDOS_CLIENTE F ON F.COD_EQUIPMENT_PROGRAM = E.COD_EQUIPMENT_PROGRAM
        LEFT JOIN ADM_COMANDOS_USUARIO G ON G.ID_COMANDO_CLIENTE = F.ID_COMANDO_CLIENTE
      WHERE E.COD_TYPE_EQUIPMENT = '".$idTipoEquipo."' AND E.FLAG_SMS   = 0 AND  G.ID_USUARIO = ".$idUsuario;
      $res_cmds = $objDb->sqlQuery($sql_cmds);
      
      if($objDb->sqlEnumRows($res_cmds)==0){
        $cmdsR=0;
      }else{
        while($row_cmds=$objDb->sqlFetchArray($res_cmds)){//se recorren los resultados para obtener los comandos
          if($cmdsR==""){
            $cmdsR=$row_cmds["DESCRIPCION"]."%%%".$row_cmds["COD_EQUIPMENT_PROGRAM"];  
          }else{
            $cmdsR.="%%%%".$row_cmds["DESCRIPCION"]."%%%".$row_cmds["COD_EQUIPMENT_PROGRAM"]; 
          }
        }
      }
      $objDb->sqlFreeResult($res_cmds);
      return $cmdsR;
    }
    /**
    *@method        extRae posiciones del historico
    *@description   Extrae las 10 ultimas posiciones del historico
    *@paramas
    */
    public function extraerPosicionesHistorico($idUnidad,$idUsuario,$clienteId){
      $objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES 'utf8'");
      $tabla="HIST".$this->extraerNombreTabla($clienteId);
      $sqlH="SELECT DISTINCT GPS_DATETIME,LATITUDE,LONGITUDE 
        FROM ".$tabla." 
        WHERE GPS_DATETIME LIKE '".date("Y-m-d")."%' AND COD_ENTITY='".$idUnidad."' AND VELOCITY >=5
        ORDER BY GPS_DATETIME DESC
        LIMIT 10";
      $resH=$objDb->sqlQuery($sqlH);
      $strHistorico="";
      $numRegistros=$objDb->sqlEnumRows($resH);
      if($numRegistros==0){
        $strHistorico=0;
      }else{
        while($rowH=$objDb->sqlFetchArray($resH)){
          if($strHistorico==""){
            $strHistorico=$rowH["GPS_DATETIME"].",".$rowH["LATITUDE"].",".$rowH["LONGITUDE"];
          }else{
            $strHistorico.="|||".$rowH["GPS_DATETIME"].",".$rowH["LATITUDE"].",".$rowH["LONGITUDE"];
          }
        }  
      }
      return $strHistorico;
    }
    /**
    *@method        Funcion que carga las ultimas posiciones de la clase c.Positions
    *@description   Extrae las ultimas posiciones de las unidades pasadas por un array
    *@paramas
    */
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
   		$ultimasPosiciones=$cPositions->get_last_position2($arrayUnidades,$idCliente,"",$idUsuario);
   		/*echo "<br>Cantidad de ultimas posiciones".count($ultimasPosiciones);
   		echo "<pre>";
   		print_r($ultimasPosiciones);
   		echo "</pre>";*/
   		//se recorre el array obtenido para verificar que la latiud y longitud sean diferentes a 0
   		$idUnidadesRespuesta=array();
   		for($i=0;$i<count($ultimasPosiciones);$i++){
     			$idUnidadesRespuesta[]=$ultimasPosiciones[$i][0];
     			//inicia proceso de localizacion alternativa
     			if($ultimasPosiciones[$i][6] != "0.000000" && $ultimasPosiciones[$i][7] != "0.000000" && $ultimasPosiciones[$i][19] !="NULL" && $ultimasPosiciones[$i][19] !="0"){                                
            	$direccion1 = $cPositions->direccion_no_format($ultimasPosiciones[$i][6],$ultimasPosiciones[$i][7]);
            	$new_dir= $functions->codif($direccion1);      
            	$buscarPDI=true;          
        	}else if($ultimasPosiciones[$i][6] == "0.000000" && $ultimasPosiciones[$i][7] == "0.000000"){
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
      
      if(count($resultado)!=0){
        sort($resultado);

        for($j=0;$j<count($resultado);$j++){
          if($strUltimasPosiciones==""){
            $strUltimasPosiciones = $resultado[$j].",Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,0,0,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos";
          }else{
            $strUltimasPosiciones = $strUltimasPosiciones."|||||".$resultado[$j].",Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,0,0,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos,Sin Datos";
          }   
        }
      }
      //echo "<br>".$strUltimasPosiciones;
      return $strUltimasPosiciones;
   	}
   	/**
  	*@method 		iniciar Conexion con la BD
  	*@description 	Funcion para conectar con la base de datos
  	*@paramas
  	*/
   	public function cargarGrupos($idUsuario){
   		$objDb=$this->iniciarConexionDb();
      $objDb->sqlQuery("SET NAMES 'utf8'");
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