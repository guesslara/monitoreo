<?php
  if($_SERVER["HTTP_REFERER"]==""){//se valida si viene desde la pagina o se invoco directamente
    header("Location: errors/index.php?e=error404");
    exit();
  }else{
    session_start();
    if(!isset($_SESSION["s_id_4togo"])){
      echo "Error";
      exit();
    }else{
      //echo "<pre>";
      //print_r($_SESSION);
      //echo "</pre>";
      $tpl->set_filenames(array('mUltimosEventos' => 'tUltimosEventos'));
      $idUsuario=$_SESSION["s_id_4togo"];
      include "claseMonitoreo.php";
      $objM2=new monitoreo();
      $objM2->verUltimosEventos($idUsuario);
      
      $tpl->pparse('mUltimosEventos');

    }
  }
?>