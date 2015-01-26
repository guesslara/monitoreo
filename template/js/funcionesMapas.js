/*
*Funciones para el manejo de los mapas
*/
var rendererOptions = { draggable: true };//variable para poder mover la linea de las rutas entre punto A y pnto B
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;//servicio para mostrar las direcciones
var directionsService = new google.maps.DirectionsService();//servicio para las direcciones
var flightPlanCoordinates = [];//areglo para pintar las posiciones del seguimiento x unidad
var flightPlanCoordinatesR = [];//arreglo para pintar las lineas de geocercas
var flightPath;//variable que se usara como objeto de la polilyne
var flightPathR;//variable que se usara como objeto de la polilyne en el pintado de las rutas
var monGeoZoom=0;//zoom del mapa
var monGeoBnds=0;//latitud y longitud del mapa
var strLat;//variable para almacenar las latitudes y longitudes extraidas
var geocoder;//variable para la busqueda de la direccion
function mostrarMapa(){
    try{
    	geocoder = new google.maps.Geocoder();
		var mapOptions = {
	  		zoom: 5,
	  		center: new google.maps.LatLng(24.5154926,-111.4534356),
	  		mapTypeId: google.maps.MapTypeId.ROADMAP,
	  		panControl: false,
	  		mapTypeControlOptions: {
        		style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        		position: google.maps.ControlPosition.TOP_LEFT
    		}
		};
		mapaMonitoreo = new google.maps.Map(document.getElementById('mon_content'),mapOptions);
	    google.maps.event.addListener(mapaMonitoreo, 'click', function() {
	    	infoWindow.close();
		});    
		google.maps.event.addListener(mapaMonitoreo, 'idle', showM);
		google.maps.event.trigger(mapaMonitoreo, 'resize');
		google.maps.event.addListener(mapaMonitoreo, 'click', function(event) {
  			colocarLatLon(event.latLng);
		});
		directionsDisplay.setMap(mapaMonitoreo);
    }catch(err){
		$("#error").show();
		$("#error_mensaje").html('Revise su conex&oacute;n a Internet.<br><br>El Mapa no pudo mostrarse.');
    }
}
/*Funcion que manda la latitud y longitud a los divs correspondientes*/
function colocarLatLon(latLng){
	strLat=latLng.toString();
	strLat=strLat.split(",");
	//se envia el valor a los divs
	document.getElementById("divLatLon").innerHTML = strLat[0].substring(1)+","+strLat[1].substring(0,(strLat[1].length-1));
	strLat.length=0;
}
//funcion que se ejecuta cuando se hace cualquier accion en el mapa
function showM(){
	var bounds = mapaMonitoreo.getBounds();
	var zoomLevel = mapaMonitoreo.getZoom();
	monGeoZoom   = zoomLevel;
	monGeoBnds   = bounds;
}
/*evento que se almacena por cada unidad para mostrar el infowindow*/
function add_info_marker(marker,content){	
    google.maps.event.addListener(marker, 'click',function() {
		if(infowindow){
		    infoWindow.close();
		    infowindow.setMap(null);
		}
		var marker = this;
		var latLng = marker.getPosition();
		infoWindow.setContent(content);
		infoWindow.open(mapaMonitoreo, marker);
		mapaMonitoreo.setZoom(18);
		mapaMonitoreo.setCenter(latLng); 
		mapaMonitoreo.panTo(latLng);     
    });
}
function verInfoGeoreferencia(marker,content){
	google.maps.event.addListener(marker, 'click',function() {
		if(infowindow){
		    infoWindow.close();
		    infowindow.setMap(null);
		}
		var marker = this;
		var latLng = marker.getPosition();
		infoWindow.setContent(content);
		infoWindow.open(mapaMonitoreo, marker);
		mapaMonitoreo.setZoom(18);
		mapaMonitoreo.setCenter(latLng); 
		mapaMonitoreo.panTo(latLng);     
    });	
}
//function verInfoGeocerca(geocerca,content){
function verInfoGeocerca(event){
	//var vertices=geocerca.getPaths;
	console.log("title "+this.title)

	//var contentString=content;
	var contentString=extraerDatosGeoreferencia(this.title,"datosGeocerca");
	//se reemplaza el contenido del info window y posicion
	infoWindow.setContent(contentString);
	infoWindow.setPosition(event.latLng);
	infoWindow.open(mapaMonitoreo);
}
/*Funcion para pintar el seguimiento de la unidad*/
function muestraPosicionesHistorico(posicionesHist){
	try{
		if(posicionesHist != 0){
			if(flightPlanCoordinates.length!=0){
				flightPlanCoordinates.length=0;
				flightPath.setMap(null);
			}
			posicionesHist=posicionesHist.split("|||");
			posicionesHist.reverse();
			for(i=0;i<posicionesHist.length;i++){
				ubicaciones=posicionesHist[i].split(",");
				array_latitudes[i]  = parseFloat(ubicaciones[1]);
				array_longitudes[i] = parseFloat(ubicaciones[2]);
				//se mandan las posiciones a la tabla del historial
				strHistorial="<div title='De click para conocer su ubicación' class='infoLatLon'>"+ubicaciones[0].substring(11)+" = "+ubicaciones[1]+" "+ubicaciones[2]+"</div>";
				$("#historialInfo").append(strHistorial);
				strHistorial="";
			}
			//posicion del mapa
		  	var positon = new google.maps.LatLng(array_latitudes[(posicionesHist.length-1)],array_longitudes[(posicionesHist.length-1)]);
			mapaMonitoreo.setZoom(16);
			mapaMonitoreo.setCenter(positon);	
			mapaMonitoreo.panTo(positon);
			//proceso del dibujo de la linea
			for(i=0;i<posicionesHist.length;i++){
				flightPlanCoordinates[i]=new google.maps.LatLng(array_latitudes[i],array_longitudes[i]);
			}

		  	var iconsetngs = {
			    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
			    strokeColor: '#155B90',
			    fillColor: '#155B90',
			    fillOpacity: 1,
			    strokeWeight: 4        
			};

			flightPath = new google.maps.Polyline({
			    path: flightPlanCoordinates,
			    geodesic: true,
			    strokeColor: '#FF0000',
			    strokeOpacity: 1.0,
			    strokeWeight: 2,
			    icons: [{
				    icon: iconsetngs,
				    repeat:'35px',         
				    offset: '100%'
				}]
			});

		  	flightPath.setMap(mapaMonitoreo);
			
		  	array_latitudes.length=0;
		  	array_longitudes.length=0;
		}else{
			banderaSeguimiento=false;
			$("#dialog_message").html("No hay posiciones para mostrar en el dia de hoy.");
			$("#dialog_message").dialog("open");
		}
  	}catch(err){
  		banderaSeguimiento=false;
		$("#error").show();
		$("#error_mensaje").html('Ocurrio un error en el pintado de trayectoria.');
    }
}
/*Funcion para remover los markers en el mapa*/
function mon_remove_map(){
    if(markers || markers.length>-1){
	    for (var i = 0; i < markers.length; i++) {
	      markers[i].setMap(null);
	    }	
	    markers = [];
    }

    if(arraygeosP || arraygeosP.length>-1){
	    for (var i = 0; i < arraygeosP.length; i++) {
	      arraygeosP[i].setMap(null);
	    }	
	    arraygeosP = [];
    }
}
/*Funcion que calcula la ruta*/
function calcularRuta(puntoA,puntoB){
	try{	
		var trafficLayer = new google.maps.TrafficLayer();//se instancia la capa del trafico
	  	trafficLayer.setMap(mapaMonitoreo);//se muestra en el mapa
		var request = {
			origin:puntoA,
			destination:puntoB,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			region: "Mexico"
		};
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
		  		directionsDisplay.setDirections(result);
			}else if(status == google.maps.DirectionsStatus.NOT_FOUND){//revisar los puntos de origen y/o destino
				$("#dialog_message").html("Favor de revisar los puntos de Origen(A) y/o destino(B).");
				$("#dialog_message").dialog("open");
			}else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){//revisar los puntos de origen y/o destino
				$("#dialog_message").html("La búsqueda de Rutas no obtuvo ningun resultado.");
				$("#dialog_message").dialog("open");
			}else if(status == google.maps.DirectionsStatus.INVALID_REQUEST){//revisar los puntos de origen y/o destino
				$("#dialog_message").html("Verifique que el punto de Origen(A) y destino(B) no esten vacios.");
				$("#dialog_message").dialog("open");
			}else if(status == google.maps.DirectionsStatus.UNKNOWN_ERROR){//revisar los puntos de origen y/o destino
				$("#dialog_message").html("Ocurrio un error desconocido, intenet de nuevo la petición de la ruta.");
				$("#dialog_message").dialog("open");
			}
		});
	}catch(err){
		$("#error").show();
		$("#error_mensaje").html('Ocurrio un error al trazar la Ruta especificada.');
    }
}
//acciones para las georeferencias
function accionesGeopuntosCercas(opcion){
	//console.log("opcion: "+opcion);
	if(opcion==0){//se ocultan todos los geopuntos
		setAllMap(null,"G");
	}else if(opcion==1){//se muestran todos los geopuntos
		setAllMap(mapaMonitoreo,"G");
	}else if(opcion==2){//se ocultan las geocercas
		setAllMap(null,"C");
	}else if(opcion==3){//se muestran las geocercas
		setAllMap(mapaMonitoreo,"C");
	}else if(opcion==4){//se ocultan las rutas
		setAllMap(null,"R");
	}else if(opcion==5){//se muestran las rutas
		setAllMap(mapaMonitoreo,"R");
	}else if(opcion==6){//se muestran las rutas
		setAllMap(null,"Geopuntos");
	}else if(opcion==7){//se muestran las rutas
		setAllMap(mapaMonitoreo,"Geopuntos");
	}else if(opcion==8){//se muestran las rutas
		setAllMap(null,"Geocercas");
	}else if(opcion==9){//se muestran las rutas
		setAllMap(mapaMonitoreo,"Geocercas");
	}else if(opcion==10){//se muestran las rutas
		setAllMap(null,"Georutas");
	}else if(opcion==11){//se muestran las rutas
		setAllMap(mapaMonitoreo,"Georutas");
	}
}
/*funcion para el manejo de las diferentes acciones con las georeferencias*/
function setAllMap(map,opcion){
	if(opcion=="G"){
		for(var i=0;i< monMarkers.length;i++){
			monMarkers[i].setMap(map);
		}
	}else if(opcion=="C"){
		for(var i=0;i< arraygeos.length;i++){
			arraygeos[i].setMap(map);
		}
	}else if(opcion=="R"){
		for(var i=0;i< monRutas.length;i++){
			monRutas[i].setMap(map);
		}
	}else if(opcion=="Geopuntos"){
		console.log(arrayGeopuntosGeo);
		for(var i=0;i< arrayGeopuntosGeo.length;i++){
			arrayGeopuntosGeo[i].setMap(map);
		}
	}else if(opcion=="Geocercas"){
		console.log(arrayGeocercasGeo);
		for(var i=0;i< arrayGeocercasGeo.length;i++){
			arrayGeocercasGeo[i].setMap(map);
		}
	}else if(opcion=="Georutas"){
		console.log(arrayGeorutasGeo);
		for(var i=0;i< arrayGeorutasGeo.length;i++){
			arrayGeorutasGeo[i].setMap(map);
		}
	}
}

function buscarDireccion(txtParametro,evento){
	var direccionGeo=txtParametro;
	if(direccionGeo.length==0){
		limpiaDirecciones();
	}else{
		if(evento.which==13){	
			if( direccionGeo.length > 3 ){
				limpiaDirecciones();
				geocoder.geocode( { 'address': direccionGeo,'region': "Mexico"}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
						//variables para el infowindow
						descripcionDireccion=results[0].formatted_address;
						tipoLocalizacion=results[0].geometry.location_type
						LatiLong=results[0].geometry.location.toString();
						//var infoDir=datosDireccion(descripcionDireccion,tipoLocalizacion,LatiLong);
				      	mapaMonitoreo.setCenter(results[0].geometry.location);
				      	mapaMonitoreo.setZoom(14);
				      	var markerGeoDir = new google.maps.Marker({
				        	map: mapaMonitoreo,
				        	//draggable:true,
				          	position: results[0].geometry.location
				      	});
				      	
						var infowindowD=new google.maps.InfoWindow();
	  					infowindowD.setContent(results[0].formatted_address);
        				infowindowD.open(mapaMonitoreo, markerGeoDir);
				      	
				      	arrayDireccionesResult.push(markerGeoDir);

				    }else if(status== google.maps.GeocoderStatus.ZERO_RESULTS || status==google.maps.GeocoderStatus.UNKNOWN_ERROR){
				      	$("#dialog_message").html("Direccion no encontrada, verifique la información introducida e intentelo de nuevo");
						$("#dialog_message").dialog("open");
				    }
				 });
			}
		}
	}
}

function limpiaDirecciones(){
	//se borra el arreglo de las direcciones y se quitan del mapa
	for(var i=0;i< arrayDireccionesResult.length;i++){
		arrayDireccionesResult[i].setMap(null);
	}
	arrayDireccionesResult.length=0;//se vacia el arreglo
}
