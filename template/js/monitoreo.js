var arrayunits 		= new Array();
var array_selected  = Array();
var markers = [];
var arraygeos = [];  
var mon_timer,mon_timer_count;
var info_window='';
var infowindow;
var beachMarker;
var arrayReferencias= Array();
var listReferencias = 0;
var aComandosAll = '';
var UnitsString  = '';
var monGeoZoom   ;
var monGeoBnds   ;
var monMarkers = [];
var mon_array_autocomplete = Array();
//variables adicionales
var array_latitudes	 = Array();
var array_longitudes = Array();
var banderaSeguimiento = false;
var unidadSeleccionada = 0;

/**
 *@name Funcion para redimensionar los divs
 *@param contenedor Div que se va a definir en la altura
 *@author Gerardo Lara
 *@description Obtiene el alto del div que se pasa como argumento y lo ajusta
*/
function redimensionarDivs() {
    //alert("Cambio div");
    altoContenedor=$("#tabs").height();
    anchoContenedor=$("#tabs").width();
    $("#mon_tabs").css("height",(altoContenedor-46)+"px");
    
    $("#mon_tabs_1").css("height",(altoContenedor-80)+"px");
    $("#mon_tabs-2").css("height",(altoContenedor-80)+"px");
    $("#mon_menu_acordeon").css("height",(altoContenedor-117)+"px");
    
    
    $("#mon_content").css("height",(altoContenedor-44)+"px");
    $("#Admon").css("height",(altoContenedor-43)+"px");//modificacion para el slider
    $("#contenedorSlider").css("height",(altoContenedor-44)+"px");
    $("#main_view").css("height",(altoContenedor-73)+"px");
    $("#window").css("height",(altoContenedor-75)+"px");
    //Se verifica la existencia del tab de alertas
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
    
}
/**
 *@description Cada ves que se redimensiona la ventana del navegador se manda a llamar la funcion que redimensiona todos
 *los divs
 */
window.onresize=redimensionarDivs;

function showM(){
	var bounds = mapaMonitoreo.getBounds();
	var zoomLevel = mapaMonitoreo.getZoom();

	monGeoZoom   = zoomLevel;
	monGeoBnds   = bounds;
	//drawGeos();	
}

function mon_refresh_units(){
    /****************************************************************************************************************/
    /***Funcion desactivada solo hasta la nueva colocacion de los divs***********************************************/
	var time = $("#mon_sel_time").val();
	
	if(mon_timer!=null){
		mon_timer.stop();	
		mon_timer=null;
	}
	var secondsreal = time /1000;
	start_counter(secondsreal);
	mon_timer = $.timer(time , function(){
		if(array_selected.length>0){
			//mon_load_units();
			mon_refresh_units();
			console.log("actualizarPosiciones - monitoreo.js linea 139");//se debe mandar a la funcion para actualizar las posiciones
			//mon_arreglo_carga();
			cargarUltimasPosiciones();
			//actualizaUltimasPosiciones();
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

function checkTime(i){
	if (i<10){
  		i="0" + i;
  	}
	return i;
}
// function mon_refresh_selected(){
// 	for(var i=0;i<arrayunits.length;i++){
// 		var units_info = arrayunits[i].split('|');
// 		for(var u=0;u<array_selected.length;u++){
// 			var units_selected = array_selected[u].split('|');
// 			if(units_info[2] == units_selected[2]){
// 				array_selected[u] = arrayunits[i];
// 			}
// 		}
// 	}
// 	mon_draw_table();
// 	actualizaUltimasPosiciones();
// }
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
/*
*Funcion modificada para el proceso de las geocercas
*/
function getGeos(){
	if(listReferencias==0){
		//$("#mon_dialog").dialog("open");
		arrayReferencias = [];
		usuarioId=$("#usuarioId").val();
		clienteId=$("#usuarioCliente").val();
		parametros="action=mostrarGeocercas&usuarioId="+usuarioId+"&clienteId="+clienteId;
		ajaxMonitoreo("mostrarGeocercas","controlador",parametros,"cargador2","mon_dialog","POST");
	}
}

function drawGeos(){
	var checkCercas = $('input[name=mon_chk_c]').is(':checked');

	if(monMarkers || monMarkers.length>-1){
		for (var i = 0; i < monMarkers.length; i++) {
	          monMarkers[i].setMap(null);
		}	
		monMarkers = [];
	}

	for(var i=0;i<arrayReferencias.length;i++){
		var arrayGeoInfo = arrayReferencias[i].split('!');

		if(arrayGeoInfo[0]=='G'){
			if(monGeoZoom>13){
				var pointU = new google.maps.LatLng(arrayGeoInfo[4],arrayGeoInfo[5]);

				if(monGeoBnds.contains(pointU)){
					var image = 'public/images/'+arrayGeoInfo[2];	
				    var marker1 = new google.maps.Marker({
					    map: map,
					    position: new google.maps.LatLng(arrayGeoInfo[4],arrayGeoInfo[5]),
					    title: 	arrayGeoInfo[3],
						icon: 	image
				    });
					var content = '<br><div class="div_unit_info ui-widget-content ui-corner-all">'+
						'<div class="ui-widget-header ui-corner-all" align="center">Información del Geo Punto</div>'+
								'<table width="400"><tr><th colspan="2">'+						  			
								'<tr><td align="left">Punto de Interes:</td><td align="left">'+arrayGeoInfo[3]+'</td></tr>'+									
								'</table>'+
							'</div>';
				    add_info_marker(marker1,content);
				    monMarkers.push(marker1);
				}
			}
		}

		if(arrayGeoInfo[0]=='C' && checkCercas){ 
			var arrayGeoInfoLats = null;
			arrayGeoInfoLats = arrayGeoInfo[6].split('&');
			var geos_points_polygon = [];

			for(j=0;j<arrayGeoInfoLats.length;j++){
				var latlon = arrayGeoInfoLats[j].split('*');

		        var Latit =  parseFloat(latlon[0]);
		        var Longit = parseFloat(latlon[1]);
		        var pointmarker = new google.maps.LatLng(Latit,Longit);
		        geos_points_polygon.push(pointmarker);		        		        
		    }

			var geos_options = {
			      paths: geos_points_polygon,
			      strokeColor: arrayGeoInfo[1],
			      strokeOpacity: 0.8,
			      strokeWeight: 3,
			      title: 	arrayGeoInfo[3],
			      fillColor: arrayGeoInfo[1],
			      fillOpacity: 0.35
			} 		    
			
			var geos_polygon = new google.maps.Polygon(geos_options);
			geos_polygon.setMap(mapaMonitoreo);
			arraygeos.push(geos_polygon);
		}
	}		
}

function monMessageValidate(dUnit){
	$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La unidad '+dUnit+' No tiene reporte.</p>');
	$("#dialog_message" ).dialog('open');   
}

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

