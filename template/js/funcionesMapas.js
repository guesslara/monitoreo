/*
*Funciones para el manejo de los mapas
*/
var rendererOptions = { draggable: true };
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var flightPlanCoordinates = [];
var flightPath;
function mostrarMapa(){
    try{
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
var strLat;
function colocarLatLon(latLng){
	strLat=latLng.toString();
	strLat=strLat.split(",");
	//se envia el valor a los divs
	document.getElementById("divLatitud").innerHTML = strLat[0].substring(1);
	document.getElementById("divLongitud").innerHTML = strLat[1].substring(0,(strLat[1].length-1));
	strLat.length=0;
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
		infoWindow.open(mapaMonitoreo, marker);
		mapaMonitoreo.setZoom(18);
		mapaMonitoreo.setCenter(latLng); 
		mapaMonitoreo.panTo(latLng);     
    });
}
/*
*Funcion para pintar el seguimiento de la unidad
*/
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
/*
*Funcion para remover los markers en el mapa
*/
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

/*
*Funcion que calcula la ruta
*/
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
			}else if(status == google.maps.DirectionsStatus.NOT_FOUND){
				//revisar los puntos de origen y/o destino
				$("#dialog_message").html("Favor de revisar los puntos de Origen(A) y/o destino(B).");
				$("#dialog_message").dialog("open");
			}else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
				//revisar los puntos de origen y/o destino
				$("#dialog_message").html("La búsqueda de Rutas no obtuvo ningun resultado.");
				$("#dialog_message").dialog("open");
			}else if(status == google.maps.DirectionsStatus.INVALID_REQUEST){
				//revisar los puntos de origen y/o destino
				$("#dialog_message").html("Verifique que el punto de Origen(A) y destino(B) no esten vacios.");
				$("#dialog_message").dialog("open");
			}else if(status == google.maps.DirectionsStatus.UNKNOWN_ERROR){
				//revisar los puntos de origen y/o destino
				$("#dialog_message").html("Ocurrio un error desconocido, intenet de nuevo la petición de la ruta.");
				$("#dialog_message").dialog("open");
			}
		});
	}catch(err){
		$("#error").show();
		$("#error_mensaje").html('Ocurrio un error al pintra la Ruta especificada.');
    }
}


