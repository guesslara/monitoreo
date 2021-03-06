<?php
/** * 
 *  @package             
 *  @name                Pagina default del modulo silver 
 *  @version             1
 *  @copyright           Air Logistics & GPS S.A. de C.V.   
 *  @author              Enrique Peña 
 *  @modificado          27-04-2011
**/
	$db = new sql($config_bd['host'],$config_bd['port'],$config_bd['bname'],$config_bd['user'],$config_bd['pass']);
	
	$tpl->set_filenames(array('default'=>'default'));
	//modificacion para el boton de ayuda
	$manuales=new componenteManuales();
	$manuales->__set("modulo", $_GET["m"]);
	$manuales->getManuales();
	$pdf=$manuales->__get("pdf");
	$video=$manuales->__get("video");

	if($video==""){
		$botonAyuda="<a href='".$pdf."' target='_blank' class='ui-state-highlight ui-corner-all' style='padding:5px;margin-left:5px;text-decoration:none;float:right;color:#2e6e9e;font-weight:bold;' title='Ayuda'>Ayuda</a>";
	}else{
		$botonAyuda="<a href='#' onclick='abrirAyudaPortal(\"".$pdf."\",\"".$video."\")' class='ui-state-highlight ui-corner-all' style='padding:5px;margin-left:5px;text-decoration:none;float:right;color:#2e6e9e;font-weight:bold;' title='Ayuda'>Ayuda</a>";
	}

	$idProfile = $userAdmin->user_info['ID_PERFIL'];
    //echo "<pre>";
	//print_r($userAdmin);
	//echo "</pre>";
	$validate  = $dbf->getRow('ADM_USUARIOS_SUPER',' ID_USUARIO = '.$userAdmin->user_info['ID_USUARIO']);
	
	$s_admin   = ($validate) ? 'visible': 'invisible';
	
    $aReports  = ($userAdmin->validar_submenu('mReports')) ? 'visible': 'invisible';

    //verificacion de permisos en la tabla de clientes con las funciones habilitadas
    $sqlAdicional="SELECT MONITOREO_RUTAS,MONITOREO_SEGUIMIENTO,MONITOREO_BUSQUEDA FROM ADM_CLIENTES WHERE ID_CLIENTE='".$userAdmin->user_info["ID_CLIENTE"]."'";
    $resAdicional=$db->sqlQuery($sqlAdicional);
    $rowAdicional=$db->sqlFetchArray($resAdicional);
    $ruta="display:none;";
    $hRuta="display:none";
    $seguimiento="N";
    $busqueda="none";

    if($rowAdicional["MONITOREO_RUTAS"]==1){
    	$ruta="";
    }

	if($rowAdicional["MONITOREO_SEGUIMIENTO"]==1){
		$seguimiento="Y";
		//$hRuta="display:block;";
		$hRuta="display:none;";
    }
    
    if($rowAdicional["MONITOREO_BUSQUEDA"]==1){
    	$busqueda="block";
    }

	$tpl->assign_vars(array(
		'PAGE_TITLE'	=> 'Modulo Rastreo',
		'PATH'			=> $dir_mod,
		'PATH_IMG'		=> $dir_pimages,
		'USER'			=> $userAdmin->user_info['NOMBRE_COMPLETO'],
		'APIKEY'		=> $config['keyapi'],
		'S_ADMIN'		=> $s_admin,
        'REPORTS'       => $aReports,
        'IDUSUARIO'		=> $userAdmin->user_info["ID_USUARIO"],
        'IDCLIENTE'		=> $userAdmin->user_info["ID_CLIENTE"],
        'RUTA'			=> $ruta,
        'SEGUIMIENTO'	=> $seguimiento,
        'HISTORIAL'		=> $hRuta,
        'BUSQUEDA'		=> $busqueda,
        'PROFILE'		=> $idProfile,
        'BOTONAYUDA'	=> $botonAyuda
	));
	
	$tpl->pparse('default');
?>