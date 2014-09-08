var arreglo_tem=new Array(); //arreglo temporar que construye todo y todos consultaremos
var arreglo_comp=new Array(); // arreglo que espera lo de la base
var arreglo_ids=new Array();
var arreglo_ids1=new Array();  //arreglo de ids con actualizacion
var arreglo_id_actualizar=new Array(); //arreglo de identificadores del arreglo temporal con actualizacion 
var ident_tem = new Array(); //pase de identificadores 
var flag_carg=0;
var flag_mark=0;
//posible modificacion
var banderaActualizacion=0;

function mon_arreglo_carga(){  // carga general con timer
	if(array_selected.length==0){
		url="index.php?m=mMonitoreo&c=mGetUPosition&unidades=N/A";
	}else{
		url="index.php?m=mMonitoreo&c=mGetUPosition&unidades="+array_selected;
	}
    arreglo_comp=new Array();
    $.ajax({
		type: "GET",
		url: url,
		data: "",
		beforeSend:function(){
		    if(cargadorInicial==0){
			$("#cargadorGeneral").show();
			cargadorInicial=1;
		    }else{
			$("#cargador2").show(); 
		    }
		
		},
		success: function(datos){
		    $("#cargadorGeneral").hide();
		    $("#cargador2").hide(); 
			//console.log(datos);
			if(datos=="<script>window.location=\"index.php?m=login\"</script>"){
				$("#error").show();
				$("#enlaceGenerarTicket").hide();
				$("#btnCerrarVentanaError").hide();
				stopTimer();
				$("#error_mensaje").html('Su sesion ha terminado por inactividad.<br>Ingrese de nuevo a la plataforma');	
			}else{
				var prim_div=datos.split('¬');
				var div_ids=prim_div[1].split(',');
				for(o=0;o<div_ids.length;o++){
				    arreglo_ids1.push(div_ids[o]);
				}
				var div=prim_div[0].split('|');
				for(i=0;i<div.length;i++){
				    var div2=div[i].split(',');
				    arreglo_comp.push(div2);
				}
				mon_analizador_arreglo();
				//se continua con la modificacion
				banderaActualizacion=1;
			}
	    },
	    error:function() {
		    $("#cargador2").hide(); 
		    $("#error").show();
		    $("#error_mensaje").html('Ocurrio un error al procesar la solicitud, verifique su conexion a Internet.');
	    }
    });
    if(banderaActualizacion==1){
    	mon_build_puntos(0);
    }
}


function mon_analizador_arreglo(){
    var fecha=new Date();
    var news_fech=new Date(fecha.getFullYear()+ "-"+ fecha.getMonth()+ "-"+fecha.getDate()+ " " +(fecha.getHours()-1) + ":" + fecha.getMinutes() + ":" + fecha.getSeconds());
    if(flag_carg==0){
	ident_tem = new Array();
	//arreglo_ids=new Array();
	arreglo_tem=arreglo_comp;
	flag_carg=1;
    }else{
	if(arreglo_tem.length!=arreglo_comp.length){
	    arreglo_tem=arreglo_comp;
	}else{
	    for(i=0;i<arreglo_tem.length;i++){
		var news_fech2=new Date(arreglo_comp[i][3]);
		if(arreglo_tem[i][3]!=arreglo_comp[i][3]&& news_fech2>news_fech){
		    ident_tem.push(i);
		    arreglo_ids.push(arreglo_comp[i][0]);
		    arreglo_tem[i]=arreglo_comp[i];
		}
	    }
	}
    }
    mon_valida_seleccionados();
}

function mon_valida_seleccionados(){
    var flg=0;
    arreglo_id_actualizar=new Array();
    
    if(arreglo_ids.length>0 && array_selected.length>0 ){
	for(i=0;i<arreglo_ids.length;i++){
	    var pos=array_selected.indexOf(arreglo_ids[i]);
	    if(pos!=-1){
		flg=1;
		arreglo_id_actualizar.push(ident_tem[i]);
	    }
	}
    }
    if(flg==1){
	//mon_build_puntos(1);
	mon_build_puntos(0);
	//mon_build_tabla();    //construccion de tabla de localizaciones y data
	console.log("scripts2.js linea 91 - actualizacion de posiciones");
    }
}

function mon_build_puntos(vals){  //al hacer seleccion de unidades ejecutar la funcion en cero
    if(vals==0){
    	mon_remove_map();
	if(flag_mark==1){
	    mon_remove_map();
	}
	for(i=0;i<array_selected.length;i++){
	    var post=arreglo_ids1.indexOf(array_selected[i].toString());
	    //console.log("posicion: "+post);
	    //console.log(arreglo_tem[post]);
	    
	    try{
		if(post!=-1){
		    var id 					= arreglo_tem[post][0];
		    var fecha				= arreglo_tem[post][3];
		    var evt 				= arreglo_tem[post][5];
		    var estatus				= arreglo_tem[post][10];
		    var colstus				= arreglo_tem[post][11];
		    var pdi 				= arreglo_tem[post][14];
		    var vel 				= arreglo_tem[post][4];
		    var dire 				= arreglo_tem[post][15];
		    var priory 				= arreglo_tem[post][2];
		    var lat 				= parseFloat(arreglo_tem[post][6]);
		    var lon 				= parseFloat(arreglo_tem[post][7]);
		    var dunit 				= arreglo_tem[post][1];
		    //var icons 			= arreglo_tem[post][12];
		    var angulo 				= arreglo_tem[post][9];
		    var colprio 			= arreglo_tem[post][8];
		    var blockMotor 			= arreglo_tem[post][12];
		    var type    			= arreglo_tem[post][20];
		    var battery  			= arreglo_tem[post][13];
		    var type_loc 			= arreglo_tem[post][19];
		    var distancia			= arreglo_tem[post][16];
		    var radioLbs 			= 0;
		    var image 				= '';
		    var colorImage 			= '';
		    var textoMensaje 		= '';
		    var otrosCampos			= '';
		    var typeLoc  			= '';
		    var stringLoc			= '';
		    var codTypeEquipment	= arreglo_tem[post][21];
		    var comandos			= arreglo_tem[post][22];
		    var imei				= arreglo_tem[post][23];
		    var servidor			= arreglo_tem[post][24];
		    var instancia			= arreglo_tem[post][25];
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
		    }
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
		    }

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
		    
		    if (dunit=="Sin Datos") {
				sdivUnidadGrupo="#div_"+array_selected[i];
				if ($(divUnidadGrupo).length){
			    	dunit=$(divUnidadGrupo+" .listadoInfoUnidades").text();
				}
		    }
		    if (comandos=="") {
				comandos="S/C";
		    }
		    mostrarultimasPosiciones(0,id,dunit,battery,evt,fecha,vel,distancia,dire,image,colorImage,typeLoc,stringLoc,comandos,lat,lon,imei,marker,servidor,instancia);
		}else{// else del primer if
		    console.log("Sin Datos ");
		}
	    }catch(err){
		//console.log(err);
		var divUnidadGrupo="#div_"+array_selected[i];
		if ($(divUnidadGrupo).length){
		    image = 'public/images/geo_icons/circle_red.png';
		    colorImage = "width:12px;' src='public/images/geo_icons/circle_red.png";
		    typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_problem.png";
		    unidad=$(divUnidadGrupo+" .listadoInfoUnidades").text();
		    mostrarultimasPosiciones(0,array_selected[i],unidad,"Sin Datos","Sin Datos","Sin Datos","Sin Datos","Sin Datos","Sin Datos",image,colorImage,typeLoc,"Sin Datos","");
	        }
	    }
	}
    }else{// los que requieren actualizacion
	console.log("los que requieren actualizacion");
	if(arreglo_id_actualizar.length>0){
		console.log("los que requieren actualizacion 1");
		if(flag_mark==1){
		    mon_remove_map();
		}
		flg=0;
		for(i=0;i<arreglo_id_actualizar.length;i++){
		    try{
		    
			var id 			= arreglo_tem[arreglo_id_actualizar[i]][0];
			var fecha		= arreglo_tem[arreglo_id_actualizar[i]][3];
			var evt 		= arreglo_tem[arreglo_id_actualizar[i]][5];
			var estatus		= arreglo_tem[arreglo_id_actualizar[i]][10];
			var colstus		= arreglo_tem[arreglo_id_actualizar[i]][11];
			var pdi 		= arreglo_tem[arreglo_id_actualizar[i]][14];
			var vel 		= arreglo_tem[arreglo_id_actualizar[i]][4];
			var dire 		= arreglo_tem[arreglo_id_actualizar[i]][15];
			var priory 		= arreglo_tem[arreglo_id_actualizar[i]][2];
			var lat 		= arreglo_tem[arreglo_id_actualizar[i]][6];
			var lon 		= arreglo_tem[arreglo_id_actualizar[i]][7];
			var dunit 		= arreglo_tem[arreglo_id_actualizar[i]][1];
			//var icons 		= arreglo_tem[arreglo_id_actualizar[i]][12];
			var angulo 		= arreglo_tem[arreglo_id_actualizar[i]][9];
			var colprio 		= arreglo_tem[arreglo_id_actualizar[i]][8];
			var blockMotor 		= arreglo_tem[arreglo_id_actualizar[i]][12];
			var type     		= arreglo_tem[arreglo_id_actualizar[i]][20];
			var battery  		= arreglo_tem[arreglo_id_actualizar[i]][13];
			var type_loc 		= arreglo_tem[arreglo_id_actualizar[i]][19];
			var distancia		= arreglo_tem[arreglo_id_actualizar[i]][16];
			var radioLbs 		= 0;
			var image 		= '';
			var colorImage 		= '';
			var textoMensaje 	= '';
			var otrosCampos		= '';
			var typeLoc  		= '';
			var stringLoc		= '';
			var codTypeEquipment	= arreglo_tem[arreglo_id_actualizar[i]][21];
			var comandos		= arreglo_tem[arreglo_id_actualizar[i]][22];
			var imei		= arreglo_tem[arreglo_id_actualizar[i]][23];
			
			if(type=='V'){
			    if(blockMotor!=1 ){
				if(vel<5 && priory==0){
				    image = 'public/images/geo_icons/car_red.png';
				    colorImage = "width:16px;' src='public/images/geo_icons/circle_red.png";	
				}else if(vel>5 && priory==0){
				    image = 'public/images/geo_icons/car_green.png';	
				    colorImage = "width:16px;' src='public/images/geo_icons/circle_green.png";
				}else  if(priory==1){
				    image = 'public/images/geo_icons/car_orange.png';	
				    colorImage = "width:16px;' src='public/images/geo_icons/circle_orange.png";
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
				    colorImage = "width:12px;' src='public/images/geo_icons/battery_low.png";	
				}else if(battery>33 && battery < 67){
				    image = 'public/images/geo_icons/phone_orange.png';
				    colorImage = "width:12px;' src='public/images/geo_icons/battery_medium.png";	
				}else if(battery>66){						
				    image = 'public/images/geo_icons/phone_green.png';
				    colorImage = "width:12px;' src='public/images/geo_icons/battery.png";	
				}
			    }else{
				console.log("No hay nada");
				image = 'public/images/geo_icons/phone_red.png';
				colorImage = "width=10px;' src='public/images/geo_icons/battery_low.png";
			    }
			    otrosCampos= '<tr><td align="left">Nivel de Bateria:</td><td align="left">'	+ battery	+'% </td></tr>';
			}
			
			if(lat!=0 && lon !=0){
			    marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(lat,lon),
				title: 	dunit,
				icon: 	image
			    });
			    markers.push(marker);
			    dire=dire.replace(/[-]/gi,",");
			    add_info_marker(marker,mon_datosUnidad(stringLoc,dunit,imei,"",evt,fecha,dire,distancia,type));
				//add_info_marker(marker1,content);
				/*validateInfo = 
					"<td onclick='mon_center_map(\""+array_selected[i]+"\");'>"+unit_info[3]+"</td> "+
					"<td onclick='mon_center_map(\""+array_selected[i]+"\");'>"+unit_info[5]+ "</td>";*/
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
			    }				
			}
			
			google.maps.event.addDomListener(window, 'load');
		    
			if (dunit=="Sin Datos") {
			    sdivUnidadGrupo="#div_"+array_selected[i];
			    if ($(divUnidadGrupo).length){
			        dunit=$(divUnidadGrupo+" .listadoInfoUnidades").text();
			    }
			}
			if (comandos=="") {
			    comandos="S/C";
			}
			mostrarultimasPosiciones(1,id,dunit,battery,evt,fecha,vel,distancia,dire,image,colorImage,typeLoc,stringLoc,comandos,lat,lon,imei,marker);
		    
		    }catch(err){
			//console.log(err);
			var divUnidadGrupo="#div_"+array_selected[i];
			if ($(divUnidadGrupo).length){
			    image = 'public/images/geo_icons/circle_red.png';
			    colorImage = "width:12px;' src='public/images/geo_icons/circle_red.png";
			    typeLoc = "height=14px;width=14px; src='public/images/geo_icons/antena_problem.png";
			    unidad=$(divUnidadGrupo+" .listadoInfoUnidades").text();
			    //mostrarultimasPosiciones(1,array_selected[i],unidad,"Sin Datos","Sin Datos","Sin Datos","Sin Datos","Sin Datos","Sin Datos",image,colorImage,typeLoc,"Sin Datos","");
			}
		    }
		}
	    flag_mark=1;
	}	
			
    }
    getGeos();
}
function mon_remove_map(){
    if(markers || markers.length>-1){
	    for (var i = 0; i < markers.length; i++) {
	      markers[i].setMap(null);
	    }	
	    markers = [];
    }

    if(arraygeos || arraygeos.length>-1){
	    for (var i = 0; i < arraygeos.length; i++) {
	      arraygeos[i].setMap(null);
	    }	
	    arraygeos = [];
    }
}
