/*
*Funciones para el manejo de los mapas
*/

//variable para las cajas de texto
var variableA=false;
var variableB=false;

function mostrarMapa(){
    try{
    	//directionsDisplay = new google.maps.DirectionsRenderer();
    	
		var mapOptions = {
	  		zoom: 5,
	  		center: new google.maps.LatLng(24.5154926,-111.4534356),
	  		mapTypeId: google.maps.MapTypeId.ROADMAP,
	  		//disableDefaultUI: true
		};
		map = new google.maps.Map(document.getElementById('mon_content'),mapOptions);
	    google.maps.event.addListener(map, 'click', function() {
	    	infoWindow.close();
		});    
		google.maps.event.addListener(map, 'idle', showM);
		google.maps.event.trigger(map, 'resize');
		google.maps.event.addListener(map, 'click', function(event) {
  			document.getElementById("latlng").innerHTML = event.latLng;

  			colocarMarcador(event.latLng,map);

		});
		directionsDisplay.setMap(map);
    }catch(err){
		$("#error").show();
		$("#error_mensaje").html('Revise su conex&oacute;n a Internet.<br><br>El Mapa no pudo mostrarse.');
    }
}
var markersAB = [];
function colocarMarcador(position,map){
	if(variableA==true){
		var marker = new google.maps.Marker({
			draggable: true,
	    	position: position,
	    	map: map
  		});
  		map.panTo(position);
  		markersAB.push(marker);
  		$("#puntoDePartida").attr("value",position);
	}
	if(variableB==true){
		var marker = new google.maps.Marker({
			draggable: true,
	    	position: position,
	    	map: map
  		});
  		map.panTo(position);
  		$("#destinoRuta").attr("value",position);
  		markersAB.push(marker);
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
/*
*Funcion para pintar el seguimiento de la unidad
*/
function muestraPosicionesHistorico(posicionesHist){
	posicionesHist=posicionesHist.split("|||");
	for(i=0;i<posicionesHist.length;i++){
		ubicaciones=posicionesHist[i].split(",");
		array_latitudes[i]  = parseFloat(ubicaciones[1]);
		array_longitudes[i] = parseFloat(ubicaciones[2]);
	}
	/*texto2="<pre>[0]=> "+array_longitudes[0]+"<br>"+
	"[1]=> "+array_longitudes[1]+"<br>"+
	"[2]=> "+array_longitudes[2]+"<br>"+
	"[3]=> "+array_longitudes[3]+"<br>"+
	"[4]=> "+array_longitudes[4]+"<br>"+
	"[5]=> "+array_longitudes[5]+"<br>"+
	"[6]=> "+array_longitudes[6]+"<br>"+
	"[7]=> "+array_longitudes[7]+"<br>"+
	"[8]=> "+array_longitudes[8]+"<br>"+
	"[9]=> "+array_longitudes[9]+"<br></pre>";
	//$("#mon_content").append(texto2);
	texto3="<pre>[0]=> "+array_latitudes[0]+"<br>"+
	"[1]=> "+array_latitudes[1]+"<br>"+
	"[2]=> "+array_latitudes[2]+"<br>"+
	"[3]=> "+array_latitudes[3]+"<br>"+
	"[4]=> "+array_latitudes[4]+"<br>"+
	"[5]=> "+array_latitudes[5]+"<br>"+
	"[6]=> "+array_latitudes[6]+"<br>"+
	"[7]=> "+array_latitudes[7]+"<br>"+
	"[8]=> "+array_latitudes[8]+"<br>"+
	"[9]=> "+array_latitudes[9]+"<br></pre>";*/
	//$("#mon_content").append(texto3);
	//flightPath.setMap(null);
	//posicion del mapa
  	var positon = new google.maps.LatLng(array_latitudes[0],array_longitudes[0]);
	map.setZoom(16);
	map.setCenter(positon);	
	map.panTo(positon);
	//proceso del dibujo de la linea
	var flightPlanCoordinates = [
	    new google.maps.LatLng(array_latitudes[9],array_longitudes[9]),
	    new google.maps.LatLng(array_latitudes[8],array_longitudes[8]),
	    new google.maps.LatLng(array_latitudes[7],array_longitudes[7]),
	    new google.maps.LatLng(array_latitudes[6],array_longitudes[6]),
	    new google.maps.LatLng(array_latitudes[5],array_longitudes[5]),
	    new google.maps.LatLng(array_latitudes[4],array_longitudes[4]),
	    new google.maps.LatLng(array_latitudes[3],array_longitudes[3]),
	    new google.maps.LatLng(array_latitudes[2],array_longitudes[2]),
	    new google.maps.LatLng(array_latitudes[1],array_longitudes[1]),
	    new google.maps.LatLng(array_latitudes[0],array_longitudes[0])
  	];

  	var iconsetngs = {
	    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
	    strokeColor: '#155B90',
	    fillColor: '#155B90',
	    fillOpacity: 1,
	    strokeWeight: 4        
	};

	var flightPath = new google.maps.Polyline({
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

  	flightPath.setMap(map);

  	array_latitudes.length=0;
  	array_longitudes.length=0;
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
var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
function calcularRuta(){
	
	var trafficLayer = new google.maps.TrafficLayer();
  	trafficLayer.setMap(map);

	var start = document.getElementById("puntoDePartida").value;
	var end   = document.getElementById("destinoRuta").value;



	//var start = new google.maps.LatLng(19.444126103465166, -99.17892265424598);
	//var end = new google.maps.LatLng(19.41498672016835, -99.13102913007606);
	
	//inicio = document.getElementById("puntoDePartida").value.split(",");
	//fin    = document.getElementById("destinoRuta").value.split(",");

	//alert(inicio[0].substring(1));
	//alert(inicio[1].substring(0,inicio[1].length-1));

	//var start = new google.maps.LatLng(inicio[0].substring(1),inicio[1].substring(0,inicio[1].length-1));
	//var end = new google.maps.LatLng(fin[0].substring(1),fin[1].substring(0,fin[1].length-1));
	
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		region: "Mexico"
	};

	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
	  		directionsDisplay.setDirections(result);
		}
	});
	
	//variableA=false;	
	//variableB=false;

}

function clearMarkersAB(){
	setAllMap(null);
	markersAB=[];
}

