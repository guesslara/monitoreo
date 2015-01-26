/**
 *@name Funcion para redimensionar los divs
 *@author Gerardo Lara
 *@description Obtiene el alto del div y redimensiona los divs
*/
function redimensionarDivs() {
    var altoContenedor = $ ( "#tabs" ).height( );
    var anchoContenedor = $ ( "#tabs" ).width( );
    //TABS MONITOREO
    $ ( "#mon_tabs" ).css( "height" , ( altoContenedor - 46 ) + "px" );    
    $ ( "#mon_tabs_1" ).css( "height" , ( altoContenedor - 80 ) + "px" );
    $ ( "#mon_tabs-2" ).css( "height" , ( altoContenedor - 80 ) + "px" );
    $ ( "#mon_menu_acordeon" ).css( "height" , ( altoContenedor - 142 ) + "px" );
    $ ( "#mon_content" ).css( "height" , ( altoContenedor - 44 ) + "px" );
    $ ( "#Admon" ).css( "height" , ( altoContenedor - 43 ) + "px" );
    $ ( "#Report" ).css( "height" , ( altoContenedor - 43 )+"px" );
    $ ( "#rep_menu" ).css( "height" , ( altoContenedor - 43 )+"px" );
    $ ( "#contenedorSlider" ).css( "height" , ( altoContenedor - 44 )+"px" );
    $ ( "#main_view" ).css( "height" , ( altoContenedor - 73 )+"px" );
    $ ( "#window" ).css( "height" , ( altoContenedor - 75 )+"px" );
    //divs adicionales georeferencias
	$ ( "#main_viewGeoreferencias" ).css( "height" , ( altoContenedor - 73 )+"px" );
	$ ( "#mon_menu_acordeonGeoreferencias" ).css( "height" , ( altoContenedor - 142 ) + "px" );

    //cuestionarios
    if($("#qst_main").length){
    	//altoCuestionarios=$(document).height();
	    $("#qst_main").css("height",(altoContenedor-80)+"px");
	    
	    $("#gbox_cuestionarios").css("height",(altoContenedor-84)+"px");
		$("#gbox_cuestionarios").css("width","99.9%");

		//$("#gbox_cuestionarios").css("border","1px solid #FF0000");

		$("#gview_cuestionarios").css("height",(altoContenedor-111)+"px");
		$("#gview_cuestionarios").css("width","99.9%");

		//$("#gview_cuestionarios").css("border","1px solid #FF0000");

		$("#cuestionarios_pager").css("width","99.9%");
		
		$(".ui-jqgrid-hdiv").css("width","99.93%");
		$(".ui-jqgrid-bdiv").css("height","92%");
		$(".ui-jqgrid-bdiv").css("width","99.9%");
    }
    //TABS TAREAS
    if($("#tabsTareas").length){
    	console.log("tabs tareas");
        $("#tabsTareas").css("height",(altoContenedor-50)+"px");
        if($("#gbox_tareastoday,#gbox_tareaspendientes,#gbox_tareasvencidas").length){
            //grid tareas hoy
			$("#gbox_tareastoday").css("height",(altoContenedor-92)+"px");
			$("#gbox_tareastoday").css("width","99.9%");
			$("#gview_tareastoday").css("height",(altoContenedor-118)+"px");
			$("#gview_tareastoday").css("width","99.9%");
			$("#tareastoday_pager").css("width","99.9%");

			$("#gbox_tareaspendientes").css("height",(altoContenedor-92)+"px");
			$("#gbox_tareaspendientes").css("width","99.9%");
			$("#gview_tareaspendientes").css("height",(altoContenedor-118)+"px");
			$("#gview_tareaspendientes").css("width","99.9%");
			$("#tareaspendientes_pager").css("width","99.9%");

			$("#gbox_tareasvencidas").css("height",(altoContenedor-92)+"px");
			$("#gbox_tareasvencidas").css("width","99.9%");
			$("#gview_tareasvencidas").css("height",(altoContenedor-118)+"px");
			$("#gview_tareasvencidas").css("width","99.9%");
			$("#tareasvencidas_pager").css("width","99.9%");

			$("#gbox_tareasterminadas").css("height",(altoContenedor-92)+"px");
			$("#gbox_tareasterminadas").css("width","99.9%");
			$("#gview_tareasterminadas").css("height",(altoContenedor-118)+"px");
			$("#gview_tareasterminadas").css("width","99.9%");
			$("#tareasterminadas_pager").css("width","99.9%");

			$(".ui-jqgrid-hdiv").css("width","99.9%");
			//$(".ui-jqgrid-bdiv").css("border","1px solid #FF0000");
			$(".ui-jqgrid-bdiv").css("height","90%");
        }
    }
    //TABS ALERTAS
    if($("#tabsAlertas").length){
		$("#tabsAlertas").css("height",(altoContenedor-51)+"px");
		$("#tabAlertasVigentes, #tabAlertasActivas, #tabAlertasInactivas").css("height",(altoContenedor-98)+"px");
		if($("#gbox_alertasvigentes,#gbox_alertasactivas").length){
			//grid alertas vigentes
			$("#gbox_alertasvigentes").css("height",(altoContenedor-129)+"px");
			$("#gbox_alertasvigentes").css("width","100%");
			$("#gview_alertasvigentes").css("height",(altoContenedor-155)+"px");
			$("#gview_alertasvigentes").css("width","100%");
			$("#alertasvigentes_pager").css("width","100%");
			//grid alertas activas
			$("#gbox_alertasactivas").css("height",(altoContenedor-129)+"px");
			$("#gbox_alertasactivas").css("width","100%");
			$("#gview_alertasactivas").css("height",(altoContenedor-155)+"px");
			$("#gview_alertasactivas").css("width","100%");
			$("#alertasactivas_pager").css("width","100%");
			//grid alertas inactivas
			$("#gbox_alertasinactivas").css("height",(altoContenedor-129)+"px");
			$("#gbox_alertasinactivas").css("width","100%");
			$("#gview_alertasinactivas").css("height",(altoContenedor-155)+"px");
			$("#gview_alertasinactivas").css("width","100%");
			$("#alertasinactivas_pager").css("width","100%");
			//scroll de registros
			$(".ui-jqgrid-bdiv").css("width","100%");
			$(".ui-jqgrid-bdiv").css("height",(altoContenedor-184)+"px");	
			//header del grid
			$(".ui-jqgrid-hbox").css("width","100%");
			$(".ui-jqgrid-hdiv").css("width","100%");
			//tabs auxiliares
			$("#tabVigentes, #tabActivas, #tabInactivas").css("width","100%");
			$("#tabActivas").css("height",(altoContenedor-125)+"px");
			$("#tabInactivas").css("height",(altoContenedor-125)+"px");
		}
    }
    //tabs reportes
    if($("#tabReporteResumen").length){
    	var altoContenedorTabsReporte=$("#idContenedorTabsDetalleReporte").height();
    	console.log(altoContenedorTabsReporte);
    	$("#tabReporteResumen").css("height",(altoContenedorTabsReporte-30)+"px");
		//$("#tabReporteDetalle").css("height",(altoContenedor-500)+"px");   
	}
}

/*@description Cada ves que se redimensiona la ventana del navegador se manda a llamar la funcion que redimensiona todos los divs*/
window.onresize=redimensionarDivs;
//actualiza unidades
function mon_refresh_units(){
	//var time = $("#mon_sel_time").val();
	var time = $('input:radio[name=tiempoActualizar]:checked').val();
	if(mon_timer!=null){
		mon_timer.stop();	
		mon_timer=null;
	}
	var secondsreal = time /1000;
	start_counter(secondsreal);
	mon_timer = $.timer(time , function(){
		if(array_selected.length>0){
			mon_refresh_units();//se llama asi misma
			cargarUltimasPosiciones();
		}
	});
}
var time_lapse=0;
function start_counter(time){
	if(mon_timer_count!=null){
		mon_timer_count.stop();
		mon_timer_count=null;
	}	

	$("#mon_time").html("00:00");	
	var time_lapse = time;
	mon_timer_count = $.timer(1000 , function(){		
		$("#mon_time").html("");
	    var hours = Math.floor(time_lapse / (60 * 60));
	    var divisor_for_minutes = time_lapse % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);
	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);

	    $("#mon_time").html(checkTime(minutes) + ":" + checkTime(seconds));
	    time_lapse= time_lapse - 1;
	    if(time_lapse==0){		
	    	mon_timer_count.stop();
		mon_timer_count=null;
	    }
	});    
}
/*Funcion para verificar el tiempo*/
function checkTime(i){
	if (i<10){
  		i="0" + i;
  	}
	return i;
}
/*Se detiene el tiempo de actualizacion*/
function stopTimer(){
	if(mon_timer!=null){
		mon_timer.stop();	
		mon_timer=null;
	}
	if(mon_timer_count!=null){
		mon_timer_count.stop();
		mon_timer_count=null;
	}	
	$("#mon_time").html("00:00");
}

/*Funcion pendiente para el envio de comandos a todas las unidades*/
function sendCommandsAll(){
	$("#mon_dialogAll").html("");
	var optionsCombo='';
	var aUnitsCommands=[];
	if(aComandosAll!="" && UnitsString!=""){
		var comands = aComandosAll.split("||");
		for(var i=0;i<comands.length;i++){
			var descComands = comands[i].split("?");
			for(var p=0; p<descComands.length;p++){
				values = descComands[p].split("_");
				if(jQuery.inArray(values[0], aUnitsCommands)==-1){					
					optionsCombo = optionsCombo + '<option value="'+values[0]+'">'+values[3]+'/'+values[2]+'</option>';
					aUnitsCommands.push(values[0]);	
				}
			}
		}
		var table_cmds = $("<table class='total_width'>").appendTo("#mon_dialogAll");
		$("<tr><td>Comandos:</td><td><select class='caja_txt' id='mon_sel_cmdsAll'>"+optionsCombo+"<select></td></tr>").appendTo(table_cmds);		
		$("<tr><td valign='top'>Comentarios:</td><td><textarea  id='mon_cmds_comAll' class='caja_txt_a' /></td></tr>").appendTo(table_cmds);
		$("<input type='hidden' id='mon_cmds_unitAll' value='"+ UnitsString+"' />").appendTo("#mon_dialogAll");
	}else{
		$("<h2>NO tiene permisos para enviar comandos.</h2>").appendTo("#mon_dialogAll");
	}
	$("#mon_dialogAll").dialog('open',"position", { my: "left top", at: "left bottom", of: window});
}
/*Funcion pendiente para el envio de comandos a todas las unidades*/
function sendCommands(){
	if($("#mon_dialogAll").html()!='<h2>NO tiene permisos para enviar comandos.</h2>'){
		var command = $("#mon_sel_cmdsAll").val();
		var comment = $("#mon_cmds_comAll").val();
		var unit   = $("#mon_cmds_unitAll").val();

		if(unit!="" && command>0 && comment!=""){
		    $.ajax({
		        url: "index.php?m=mMonitoreo&c=mSendCommandos",
		        type: "GET",
		        dataType : 'json',
		        data: { data: command,
		        		comment: comment ,
		        		unit   : unit
		        },
		        success: function(data) {
		          var result = data.result; 

		          if(result=='no-data' || result=='problem'){
		              $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>El comando no pudo ser enviado.</p>');
		              $("#dialog_message" ).dialog('open');             	          
		          }else if(result=='send'){ 
		              $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Comando enviado correctamente.</p>');
		              $("#dialog_message").dialog('open');
		              $("#mon_dialogAll").dialog("close");
		              /*setTimeout(mon_load_units(),5000);*/
		          }else if(result=='no-perm'){ 
		              $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>No tiene permiso para realizar esta acción. <br> Consulte a su administrador.</p>');
		              $("#dialog_message" ).dialog('open');       
				  }else if(result=='pending'){ 
		              $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>No se puede enviar este comando, ya que existe uno pendiente por enviar.</p>');
		              $("#dialog_message" ).dialog('open');       
		          }
		        }
		    });
		}else{
	      $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un comando y agregar un comentario.</p>');
	      $("#dialog_message" ).dialog('open');  				
		}
	}else{
		$("#mon_dialogAll").dialog("close");
	}
}

function geoPuntos(tipoGeo,idObjectMap,descripcion,latitud,longitud,tipo,url,calle,noInt,noExt,colonia,municipio,estado,cp){
	this.tipoGeo		=	tipoGeo;
	this.idObjectMap	=	idObjectMap;
	this.descripcion	=	descripcion;
	this.latitud		=	latitud;
	this.longitud		=	longitud;
	this.tipo 			= 	tipo;
	this.url 			=	url;
	this.calle 			=	calle;
	this.noInt 			= 	noInt;
	this.noExt			=	noExt;
	this.colonia		=	colonia;
	this.municipio		=	municipio;
	this.estado			=	estado;
	this.cp 			=	cp;
}

function geoCercaRuta(tipoGeo,idObjectMap,descripcion,fondo,color,tipo,url,geom){
	this.tipoGeo		=	tipoGeo;
	this.idObjectMap	=	idObjectMap;
	this.descripcion	=	descripcion;
	this.tipo 			= 	tipo;
	this.url 			=	url;
	this.geom 			=	geom;
	this.fondo 			= 	fondo;
	this.color 			=	color;
	
}

