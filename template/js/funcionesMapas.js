var infoWindow='';
/*
*Funciones para el manejo de los mapas
*/
function mostrarMapa(){
    try{
		var mapOptions = {
	  		zoom: 5,
	  		center: new google.maps.LatLng(24.5154926,-111.4534356),
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('mon_content'),mapOptions);
	    google.maps.event.addListener(map, 'click', function() {
	    	infoWindow.close();
		});			
    
		google.maps.event.addListener(map, 'idle', showM);
		google.maps.event.trigger(map, 'resize');
    }catch(err){
		$("#error").show();
		$("#error_mensaje").html('Revise su conex&oacute;n a Internet.<br><br>El Mapa no pudo mostrarse.');
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