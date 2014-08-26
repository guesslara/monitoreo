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
		
	$idProfile = $userAdmin->user_info['ID_PROFILE'];
    /*echo "<pre>";
	print_r($userAdmin);
	echo "</pre>";*/
	$validate  = $dbf->getRow('ADM_USUARIOS_SUPER',' ID_USUARIO = '.$userAdmin->user_info['ID_USUARIO']);
	
	$s_admin   = ($validate) ? 'visible': 'invisible';
	
    $aReports  = ($userAdmin->validar_submenu('mReports')) ? 'visible': 'invisible';
    
	$tpl->assign_vars(array(
		'PAGE_TITLE'	=> 'Modulo Rastreo',
		'PATH'			=> $dir_mod,
		'PATH_IMG'		=> $dir_pimages,
		'USER'			=> $userAdmin->user_info['NOMBRE_COMPLETO'],
		'APIKEY'		=> $config['keyapi'],
		'S_ADMIN'		=> $s_admin,
        'REPORTS'       => $aReports,
        'IDUSUARIO'		=> $userAdmin->user_info["ID_USUARIO"] 
	));
	
	$tpl->pparse('default');
?>