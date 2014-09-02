/* Funciones del archivo Javascript */
var cargadorInicial=0;
/*
 *@name 	Funcion para hacer las peticiones ajax
 *@author	Gerardo Lara
 *@date		26 - Agosto - 2014
*/
function ajaxMonitoreo(accion,c,parametros,divCarga,divResultado,tipoPeticion){
	$.ajax({
		url: "index.php?m=mMonitoreo4&c="+c,
		type: tipoPeticion,
		data: parametros,
		beforeSend:function(){ 
			$("#"+divCarga).show().html("Procesando Informacion ..."); 
		},
		success: function(data) {
			//$("#"+divResultado).html(data);
			controladorAcciones(accion,data,divResultado);
		},
		timeout:90000000,
		error:function() {
		    $("#cargadorGeneral").hide();
		    $("#error").show();
		    $("#error_mensaje").html('Ocurrio un error al procesar la solicitud.');
		}
	});
}
/*
 *@name 	Funcion controlar las acciones dependiendo de la accion pedida
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function controladorAcciones(accion,datos,divResultado){
    switch(accion){
		case "dibujaGrupos":
	    	dibujaAcordeonGrupos(accion,datos);
		break;
		case "cargarGrupos":
			$("#mon_menu_acordeon").show().html("");
			dibujaAcordeonGrupos("",datos);
		break;
		case "cargarUltimasPosiciones":
			//$("#mon_content").show().html(datos);
			evaluarCadenaUnidades(datos);
		break;
    }
}
/*
 *@name 	Funcion para cargar las ultimas posiciones de las unidades
 *@author	Gerardo Lara
 *@date		27 - Agosto -2014
*/
function cargarUltimasPosiciones(){
	usuarioId=$("#usuarioId").val();
	clienteId=$("#usuarioCliente").val();
	console.log(array_selected);
	unidades="";
	for(i=0;i<array_selected.length;i++){
		(unidades=="") ? unidades=array_selected[i] : unidades+=","+array_selected[i];
	}
	parametros="action=cargarUltimasPosiciones&filtro="+unidades+"&idUsuario="+usuarioId+"&clienteId="+clienteId;
	ajaxMonitoreo("cargarUltimasPosiciones","controlador",parametros,"mon_content","mon_content","POST");
}

/*function ajaxAppPlataforma(accion,url,parametros,metodo){
    $.ajax({
		async:true,
		type: metodo,
		dataType: "html",
		contentType: "application/x-www-form-urlencoded",
		url:url,
		data:parametros,
		beforeSend:function(){ 
		    $("#cargador2").show(); 
		},
		success:function(datos){ 
		    $("#cargador2").hide();
		    controladorAcciones(accion,datos);
		},
		timeout:90000000,
		error:function() {
		    $("#cargadorGeneral").hide();
		    $("#error").show();
		    $("#error_mensaje").html('Ocurrio un error al procesar la solicitud.');
		}
    });
}*/

/*
 *@name 	Funcion para cargar los grupos de la base de datos
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function cargarGrupos(){
	usuarioId=$("#usuarioId").val();
	parametros="action=cargarGrupos&idUsuario="+usuarioId;
	ajaxMonitoreo("cargarGrupos","controlador",parametros,"mon_menu_acordeon","mon_menu_acordeon","POST");
    //url="./index.php?m=mMonitoreo4&c=mGetGrupos";
    //ajaxAppPlataforma("dibujaGrupos",url,"","POST");
}
/*
 *@name 	Funcion para dibujar el acordeon de las unidades
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function dibujaAcordeonGrupos(accion,datos){
	try{
		idGrupo="";
		bUnidades=false;
		title="De clic para activar el seguimiento de la unidad"; title1="De clic para activar todas las unidades";
		//se procesa el resultado para crear los grupos
		datos=datos.split("|");
		acordeon="<div id='mon_acordeon_unidades' style='border:0px solid #FF0000;height:auto;position:relative;width:99%;'>";
		for(i=0;i<datos.length;i++){
			//se descomponen los elementos para la creacion de los grupos
			grupos=datos[i].split(",");
			/*inclusion para el autocomplete*/
			var miobjeto=new Object();
			miobjeto.label=grupos[3];
			miobjeto.desc=grupos[2];
			mon_array_autocomplete.push(miobjeto);
			/*fin del autocomplete*/
			img="img_"+grupos[2];//identificador de las imagenes
			div="div_"+grupos[2];//identificador de los divs
			grupo="grupo_"+i;
			imgT="imgT_"+i;
			if (grupos[0] != idGrupo) {//se verifica si se crea un grupo
				if (bUnidades) {
					acordeon+="</div>";
					bUnidades=false;
				}
				acordeon+="<h3><span class='espacioTitulo'>"+grupos[1]+"</span></h3><div id='"+grupo+"'><div onclick='seleccionarTodas(\""+grupo+"\",0)' class='listadoUnidadesTodas' title='"+title1+"'><img id='"+imgT+"' src='./public/images/ok16.png' border='0' /><span class='textoTodas'>Todas</span></div><div onclick='seleccionarUnidad("+grupos[2]+",0)' id='"+div+"' class='listadoUnidades' title='"+title+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+grupos[3]+"</span></div>";
				bUnidades=true;
			}else{
				acordeon+="<div onclick='seleccionarUnidad("+grupos[2]+",0)' id='"+div+"' class='listadoUnidades' title='"+title+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+grupos[3]+"</span></div>";    
			}
			idGrupo=grupos[0];
		}
		acordeon+="</div>";
		$("#mon_menu_acordeon").append(acordeon);
		$("#mon_acordeon_unidades").accordion({clearStyle: true, autoHeight: false});

		$("#tags").autocomplete({
	      source: mon_array_autocomplete,
	      select: function( event, ui ) {      	
			seleccionarUnidad(ui.item.desc+"",0);
			actualizaUltimasPosiciones();
	      },open: function () {
	        $(this).data("autocomplete").menu.element.width(250);
	    	}
	    });
	}catch(err){
		$("#error").show();
	    $("#error_mensaje").html('Ocurrio un error al crear los Grupos.');
	}
}
/*
 *@name 	Funcion para seleccionar la unidad
 *@param	idUnidad int
 *@param	bandera int
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function seleccionarUnidad(idUnidad,bandera) {    
    try{
	    //alert(idUnidad);
	    idUnidad=parseInt(idUnidad);
	    //console.log("ID unidad :"+idUnidad);
	    idABorrar = array_selected.indexOf(idUnidad);//se busca el id de la unidad en el array
	    if(idABorrar == -1){//no existe en el array
			array_selected.push(idUnidad);//se agrega el id de la unidad al array llamado array_selected
			$("#img_"+idUnidad).attr("src","./public/images/tick.png")//cambia la imagen del div
			mon_refresh_units();//se inicia el contador para el refresco de las unidades
	    }else{
			array_selected.splice(idABorrar, 1);//se quita el elemento del array
			$("#img_"+idUnidad).attr("src","./public/images/ok16.png")//cambia la imagen del div
			//se quita la informacion de la tabla de informacion
			idTr="#posicionTr_"+idUnidad;
			//console.log(idTr);
		
			$(idTr).remove();
			//console.log(markers[idABorrar]);
			//markers.splice(idABorrar,1);
			mon_remove_map();
			mon_build_puntos(0);
			if (array_selected.length==0) {
		    	stopTimer();
			}
    	}
    }catch(err){
    	$("#error").show();
	    $("#error_mensaje").html('Ha ocurrido un error en la seleccion.');
    }
}
/*
 *@name 	Funcion para seleccionar todas las unidades
 *@author	Gerardo Lara
 *@param	grupo string
 *@param	bandera int
 *@date		7 - Mayo - 2014
*/
function seleccionarTodas(grupo,bandera){
    $("#"+grupo+" .listadoUnidades").each(function (index) {//se recorren los divs contenidos en cada grupo
	idE=this.id;//id del elemento que se marcara
	//console.log(idE);
	srcImg=$("#"+idE+" img").attr("src");//averiguar el src de la imagen de cada elemento
	if(srcImg.substring(16)=="ok16.png" && bandera==0){
	    seleccionarUnidad(parseInt(idE.substring(4)));//se envia a la funcion para cambiar las imagenes y almacenar el valor
	}else if(srcImg.substring(16)=="tick.png" && bandera==1){
	    seleccionarUnidad(parseInt(idE.substring(4)));//se envia a la funcion para cambiar las imagenes y almacenar el valor
	}
    });
    imagenT=$("#imgT_"+grupo.substring(6)).attr("src");//imagen del div del grupo
    if (imagenT.substring(16)=="ok16.png") {
	$("#imgT_"+grupo.substring(6)).attr("src","./public/images/tick.png");//cambia la imagen del div
	$("#"+grupo+" .listadoUnidadesTodas").attr("onclick","seleccionarTodas('"+grupo+"',1)");//cambia la bandera de la funcion
    }else{
	$("#imgT_"+grupo.substring(6)).attr("src","./public/images/ok16.png");//cambia la imagen del div
	$("#"+grupo+" .listadoUnidadesTodas").attr("onclick","seleccionarTodas('"+grupo+"',0)");//cambia la bandera de la funcion
    }
}
function add_info_marker(marker,content){	
    google.maps.event.addListener(marker, 'click',function() {
	if(infowindow){
	    infoWindow.close();
	    infowindow.setMap(null);
	}
	var marker = this;
	var latLng = marker.getPosition();
	infoWindow.setContent(content);
	infoWindow.open(map, marker);
	map.setZoom(18);
	map.setCenter(latLng); 
	map.panTo(latLng);     
    });
}

function mon_datosUnidad(stringLoc,dunit,imei,textoMensaje,evt,fecha,direccion,pdi,type){
    var info = '<div class="infoUnidadGlobo">'+
			'<div>Informacion de la Unidad</div>'+
			    '<table width="400" id="tblinfoUnidadGlobo" cellpading="0" cellspacing="0">'+
				'<tr>'+
				    '<td colspan="2">&nbsp;</td>'+
				'<tr>'+
				    '<td align="left" width="125" class="estiloTituloTablaInfoUnidad">Localizado por:</td>'+
				    '<td align="left" width="275">'+stringLoc+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Unidad :</td>'+
				    '<td align="left">'+dunit+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">IMEI :</td>'+
				    '<td align="left">'+imei+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Evento :</td>'+
				    '<td align="left">'+textoMensaje+evt+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Fecha  :</td>'+
				    '<td align="left">'+fecha+'</td>'+
				'</tr>'+								
				'<tr  rowspan="3">'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Direccion:</td>'+
				    '<td align="left">'+direccion+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td>&nbsp;</td>'+
				    '<td align="left">'+pdi+'</td>'+
				'</tr>'+
		  	    '</table>'+
		  	'</div>';
    return info;
}

function mon_get_info(valor,imei,idUnidad,servidor,instancia){//envio de comandos
    option="";
    $("#mon_dialog").html("");
    if(valor!="S/C"){
	listado=valor.split("%%%%");
	for(var i=0;i<listado.length-1;i++){
	    values = listado[i].split("%%%");
	    option = option + '<option value="'+values[1]+'">'+values[0]+'</option>';
	}
	//se arma la estructura que la va a contener
	var comandosT="<Table border='0' cellpadding='0' cellspacing='0' width='100%'>";
	comandosT+="<tr><td style='height:15px;padding:5px;'>Comandos:</td><td><select class='caja_txt' id='mon_sel_cmds'>"+option+"<select></td></tr>";
	comandosT+="<tr><td valign='top'>Comentarios:</td><td><textarea  id='mon_cmds_com' class='caja_txt_a' /></td></tr>";
	comandosT+="</table>";
	comandosT+="<input type='hidden' id='mon_cmds_imei' value='"+imei+"' />";
	comandosT+="<input type='hidden' id='mon_cmds_unit' value='"+idUnidad+"' />";
	comandosT+="<input type='hidden' id='mon_cmds_servidor' value='"+servidor+"' />";
	comandosT+="<input type='hidden' id='mon_cmds_instancia' value='"+instancia+"' />";
	$("#mon_dialog").append(comandosT);
    }else{
	mensajeError="<h2>Esta unidad no tiene asignados comandos</h2>";
	$("#mon_dialog").append(mensajeError);
	$("#mon_dialog").dialog('open',{ modal: true,
	    title:"Error",
	    buttons: {
		Ok: function() {
		    $( this ).dialog( "close" );
		}
	}});
    }
    $("#mon_dialog").dialog('open');
}
function mon_center_map(idUnidad,stringLoc,unidad,imei,evento,fecha,velocidad,pdi,lat,lon,nivelBateria,direccion,idTr){
	try{
		$("#tablaX tr").css("background","#FFF");
		$("#"+idTr).css("background","#CEE3F6");
	    fecha		= fecha;//--s
	    evt 		= evento;//--
	    pdi 		= pdi;//--
	    vel 		= velocidad;//--
	    lat 		= parseFloat(lat);//19.519100
	    lon 		= parseFloat(lon);//-99.234417
	    dunit 		= unidad;//--
	    imei 		= imei;
	    
	    var radioLbs 	= 0;
	    //var textoMensaje = (blockMotor==1) ? 'MOTOR BLOQUEADO -': '';
	    var image = new google.maps.MarkerImage('public/images/car.png',
			new google.maps.Size(1, 1),
			new google.maps.Point(0,0),
			new google.maps.Point(0, 32));
	    var myLatLng 	= new google.maps.LatLng(lat,lon);
	    var beachMarker = new google.maps.Marker({
	        position: myLatLng,
	        map: 	map,
	        title: 	dunit,
	        icon:   image,
	    });

	    markers.push(beachMarker);
	    //console.log(direccion);
	    var image 		= '';
	    var colorImage 		= '';
	    var textoMensaje 	= '';
	    var otrosCampos		= '';
	    //var stringLoc		= '';
	    var info = '<div class="infoUnidadGlobo">'+
			    '<div>Informacion de la Unidad</div>'+
				'<table width="400" cellpading="0" id="tblinfoUnidadGlobo" cellspacing="0">'+
				    '<tr>'+
					'<td colspan="2">&nbsp;</td>'+
				    '<tr>'+
					'<td align="left" width="125" class="estiloTituloTablaInfoUnidad">Localizado por:</td>'+
					'<td align="left" width="275">'+stringLoc+'</td>'+
				    '</tr>'+
				    '<tr>'+
					'<td align="left" class="estiloTituloTablaInfoUnidad">Unidad :</td>'+
					'<td align="left">'+dunit+'</td>'+
				    '</tr>'+
				    '<tr>'+
					'<td align="left" class="estiloTituloTablaInfoUnidad">IMEI :</td>'+
					'<td align="left">'+imei+'</td>'+
				    '</tr>'+
				    '<tr>'+
					'<td align="left" class="estiloTituloTablaInfoUnidad">Evento :</td>'+
					'<td align="left">'+textoMensaje+evt+'</td>'+
				    '</tr>'+
				    '<tr>'+
					'<td align="left" class="estiloTituloTablaInfoUnidad">Fecha  :</td>'+
					'<td align="left">'+fecha+'</td>'+
					otrosCampos+
				    '</tr>'+								
				    '<tr  rowspan="3">'+
					'<td align="left" class="estiloTituloTablaInfoUnidad">Direccion:</td>'+
					'<td align="left">'+direccion+'</td>'+
				    '</tr>'+
				    '<tr>'+
					'<td>&nbsp;</td>'+
					'<td align="left">'+pdi+'</td>'+
				    '</tr>'+
				'</table>'+
			    '</div>';
		
	    if(infowindow){infoWindow.close();infowindow.setMap(null);}
	    infowindow = new google.maps.InfoWindow({
		content: info
	    });
	    
	    infowindow.open(map,beachMarker);

	    var positon = new google.maps.LatLng(lat, lon);
	    map.setZoom(18);
	    map.setCenter(positon);	
	    map.panTo(positon);


    }catch(err){
		$("#error").show();
		$("#error_mensaje").html('Ocurrio un error al intentar dibujar la Posicion de la unidad seleccionada.');
		onload_map();
		mon_build_puntos(1);
	}
}
var array_datos=new Array();
var array_posiciones=new Array();
var array_temporal=new Array();
/*
 *@name 	Funcion para evaluar la cadena obtenida de la consulta
 *@param	strUnidadesCompleto
 *@author	Gerardo Lara
 *@date		30 - Agosto - 2014
*/
function evaluarCadenaUnidades(strUnidadesCompleto){
	//$("#mon_content").show().html(strUnidadesCompleto);
	//se separan las unidades con datos de las que no se encontraron datos
	if(array_posiciones.length != 0){
		array_posiciones.length=0;//se vacia el array posiciones
	}
	array_datos=strUnidadesCompleto.split("|||||");
	array_temporal=array_datos.slice();//se copia el contenido a array_temporal
	array_posiciones=array_temporal.slice();//se copia a array_posiciones
	array_temporal.length=0;//se vacia array_temporal
	array_datos.length=0;//se vacia array_datos
	//se llama a la funcion para recorrer el array ultimas posiciones
	dibujarUltimasPosiciones(array_posiciones);
}
/*
 *@name 	Funcion para dibujar evaluar las ultimas posiciones
 *@param	array_posiciones
 *@author	Gerardo Lara
 *@date		30 - Agosto - 2014
*/
function dibujarUltimasPosiciones(array_posiciones){
	//se verifica que array_posiciones no este vacio
	if(array_posiciones != ""){
		//se recorre el array_posiciones y se extrae la informacion
		for(i=0;i<array_posiciones.length;i++){
			var datosUnidad=array_posiciones[i].split(",");
			console.log("Longitud del arreglo a pintar: "+datosUnidad.length)
			var texto="<pre>[0]=> "+datosUnidad[0]+"<br>"+
			"[1]=> "+datosUnidad[1]+"<br>"+
			"[2]=> "+datosUnidad[2]+"<br>"+
			"[3]=> "+datosUnidad[3]+"<br>"+
			"[4]=> "+datosUnidad[4]+"<br>"+
			"[5]=> "+datosUnidad[5]+"<br>"+
			"[6]=> "+datosUnidad[6]+"<br>"+
			"[7]=> "+datosUnidad[7]+"<br>"+
			"[8]=> "+datosUnidad[8]+"<br>"+
			"[9]=> "+datosUnidad[9]+"<br>"+
			"[10]=> "+datosUnidad[10]+"<br>"+
			"[11]=> "+datosUnidad[11]+"<br>"+
			"[12]=> "+datosUnidad[12]+"<br>"+
			"[13]=> "+datosUnidad[13]+"<br>"+
			"[14]=> "+datosUnidad[14]+"<br>"+
			"[15]=> "+datosUnidad[15]+"<br>"+
			"[16]=> "+datosUnidad[16]+"<br>"+
			"[17]=> "+datosUnidad[17]+"<br>"+
			"[18]=> "+datosUnidad[18]+"<br>"+
			"[19]=> "+datosUnidad[19]+"<br>"+
			"[20]=> "+datosUnidad[20]+"<br>"+
			"[21]=> "+datosUnidad[21]+"<br>"+
			"[22]=> "+datosUnidad[22]+"<br>"+
			"[23]=> "+datosUnidad[23]+"<br>"+
			"[24]=> "+datosUnidad[24]+"<br>"+
			"[25]=> "+datosUnidad[25]+"<br></pre>";
			$("#mon_content").append(texto);

			//se separan los valores del array
			var id 					= datosUnidad[0];
			var fecha				= datosUnidad[3];
		    var evt 				= datosUnidad[5];
		    var estatus				= datosUnidad[10];
		    var colstus				= datosUnidad[11];
		    var pdi 				= datosUnidad[14];
		    var vel 				= datosUnidad[4];
		    var dire 				= datosUnidad[15];
		    var priory 				= datosUnidad[2];
		    var lat 				= parseFloat(datosUnidad[6]);
		    var lon 				= parseFloat(datosUnidad[7]);
		    var dunit 				= datosUnidad[1];
		    //var icons 			= datosUnidad[12];
		    var angulo 				= datosUnidad[9];
		    var colprio 			= datosUnidad[8];
		    var blockMotor 			= datosUnidad[12];
		    var type    			= datosUnidad[20];
		    var battery  			= datosUnidad[13];
		    var type_loc 			= datosUnidad[19];
		    var distancia			= datosUnidad[16];
		    var radioLbs 			= 0;
		    var image 				= '';
		    var colorImage 			= '';
		    var textoMensaje 		= '';
		    var otrosCampos			= '';
		    var typeLoc  			= '';
		    var stringLoc			= '';
		    var codTypeEquipment	= datosUnidad[21];
		    var comandos			= datosUnidad[22];
		    var imei				= datosUnidad[23];
		    var servidor			= datosUnidad[24];
		    var instancia			= datosUnidad[25];
		    //se procesan los datos
		    if(type=='V'){
				if(blockMotor!=1 ){
			    	if(vel<5 && priory==0){
						image = 'public/images/geo_icons/car_red.png';
						colorImage = "width:12px;' src='public/images/geo_icons/circle_red.png";	
			    	}else if(vel>5 && priory==0){
			        	image = 'public/images/geo_icons/car_green.png';	
			        	colorImage = "width:12px;' src='public/images/geo_icons/circle_green.png";
			    	}else  if(priory==1){
			        	image = 'public/images/geo_icons/car_orange.png';	
			        	colorImage = "width:12px;' src='public/images/geo_icons/circle_orange.png";
			    	}	
				}else{
			    	image = 'public/images/car_gray.png';	
			    	colorImage = "width:12px;' public/images/circle_gray.png";
			    	textoMensaje = 'MOTOR BLOQUEADO - ';
				}
				otrosCampos= '<tr><td align="left">Velocidad:</td><td align="left">'	+ vel	+' Km/h.</td></tr>'+
				'<tr><td align="left">Estado:</td><td align="left">'   	+ estatus	+'</td></tr>';
		    }else{
				if(!isNaN(battery)){
			    	if(battery < 34){
						image = 'public/images/geo_icons/phone_red.png';
						colorImage = "width=10px;' src='public/images/geo_icons/battery_low.png";	
			    	}else if(battery>33 && battery < 67){
						image = 'public/images/geo_icons/phone_orange.png';
						colorImage = "width=10px;' src='public/images/geo_icons/battery_medium.png";	
			    	}else if(battery>66){						
			        	image = 'public/images/geo_icons/phone_green.png';
						colorImage = "width=10px;' src='public/images/geo_icons/battery.png";	
			    	}
				}else{
			    	image = 'public/images/geo_icons/phone_red.png';
			    	colorImage = "width=10px;' src='public/images/geo_icons/battery_low.png";	
				}
				otrosCampos= '<tr><td align="left">Nivel de Bateria:</td><td align="left">'	+ battery	+'% </td></tr>';
			}//fin if evaluacion de type

			if(type_loc == 1){
				typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_gps.png";		
				stringLoc = 'GPS';
				//radioLbs = 50;	
		    }else if(type_loc == 2){
				typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_wifi.png";	
				radioLbs = 50;
				stringLoc = 'WIFI';
		    }else if(type_loc == 3){
				typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_gci.png";	
				radioLbs = 200;
				stringLoc = 'GCI';
		    }else if(type_loc == 4){	
				typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_lai.png";	
				radioLbs = 1000;
				stringLoc = 'LAI';
		    }else if(type_loc == 5){
				typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_net.png";	
				radioLbs = parseInt(pdi) ;
				stringLoc = 'NETWORK';
		    }else{
				typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_problem.png";
				stringLoc = 'NO LOCALIZADO';
		    }//fin evaluacion type-loc
		    //eventos para el mapa
		    /*
		    if(lat!=0 && lon !=0){
				marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(lat,lon),
					title: 	dunit,
					icon: 	image,
				});
				markers.push(marker);
				
				add_info_marker(marker,mon_datosUnidad(stringLoc,dunit,imei,"",evt,fecha,dire,distancia,type));
			
				if(type_loc > 0 && type_loc < 6){
			    	var populationOptions = {
					    strokeColor: '#0026FF',
					    strokeOpacity: 0.5,
					    strokeWeight: 2,
					    fillColor: '#546EFF',
					    fillOpacity: 0.10,
					    map: map,
					    center: new google.maps.LatLng(lat,lon),
						radius: radioLbs
					};
					var cityCircle = new google.maps.Circle(populationOptions);	
			    	arraygeos.push(cityCircle);				    	
				};				
		    }
		    google.maps.event.addDomListener(window, 'load');
		    */
		    if (comandos=="") {
				comandos="S/C";
			}

			var divUnidadGrupo="#div_"+id;
			if ($(divUnidadGrupo).length){
				dunit=$(divUnidadGrupo+" .listadoInfoUnidades").text();
			}
		    mostrarultimasPosiciones(id,dunit,battery,evt,fecha,vel,distancia,dire,image,colorImage,typeLoc,stringLoc,comandos,lat,lon,imei,servidor,instancia);
		}//fin for array_posiciones
	}//fin if verificacion array_posiciones

	//se vacia el array posiciones
	array_posiciones.length=0;
}
/*
 *@name 	Funcion para pintar las ultimas posiciones en el mapa y en la tabal
 *@author	Gerardo Lara
 *@date		18 - Abril - 2014 - Elaborado
 *@date		 1 - Septiembre - 2014 - Modificado
*/
var clase="even";
/*VARIABLE TEMPORAL CREADA*/
var contador=0;
/*FIN VARIABLE TEMPORAL*/
function mostrarultimasPosiciones(idUnidad,unidad,nivelBateria,evento,fecha,velocidad,pdi,direccion,image,colorImage,typeLoc,stringLoc,comandos,lat,lon,imei,servidor,instancia){
    direccion=direccion.replace(/\s/g,' ');
    if (nivelBateria=="Sin Datos") {
		nivelBateria="0 %";	
    }else{
		nivelBateria=nivelBateria+" %";	
    }    
    idTr="posicionTr_"+idUnidad;
    $("#"+idTr).remove();//eliminamos la fila
    
	if($("#"+idTr).length==0){
	    var filaTr="<tr id='"+idTr+"' class='registrosUP'>";
	    filaTr+="<td><img src='"+image+"' width='20' height='20' border='0' /></td>";
	    filaTr+="<td><img "+colorImage+"' border='0' /></td>";
	    filaTr+="<td><img "+typeLoc+"'/></td>";
	    filaTr+="<td class='enlaceFuncion'><span title='Enviar Comandos a la unidad' onclick='mon_get_info(\""+comandos+"\",\""+imei+"\",\""+idUnidad+"\",\""+servidor+"\",\""+instancia+"\")'><img src='./public/images/icon-commands.png' border='0' /></span></td>";
	    filaTr+="<td class='enlaceFuncion'><a href='#' onclick='mostrarUltimasCincoPosiciones(\""+idUnidad+"\")'>5</a></td>";
	    if (evento=="0") {
			filaTr+="<td>"+unidad+" C="+contador+"</td>";
	    }else{
			filaTr+="<td><a onclick='mon_center_map(\""+idUnidad+"\",\""+stringLoc+"\",\""+unidad+"\",\""+imei+"\",\""+evento+"\",\""+fecha+"\",\""+velocidad+"\",\""+pdi+"\",\""+lat+"\",\""+lon+"\",\""+nivelBateria+"\",\""+direccion+"\",\""+idTr+"\")' title='Ver Ubicacion' class='verUbicacion' style='color:blue;'>"+unidad+" C="+contador+"</a></td>";		
	    }	    
	    filaTr+="<td>"+nivelBateria+"</td>";
	    filaTr+="<td>"+evento+"</td>";
	    filaTr+="<td>"+stringLoc+"</td>";
	    filaTr+="<td>"+fecha+"</td>";
	    filaTr+="<td>"+velocidad+"</td>";
	    filaTr+="<td>"+pdi+"</td>";
	    filaTr+="<td>"+direccion+"</td>";
	    filaTr+="<td>"+parseFloat(lat)+","+parseFloat(lon)+"</td></tr>";
	    $("#tablaX").append(filaTr);
	    contador+=1;
	}
}