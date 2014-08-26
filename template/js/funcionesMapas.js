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
    
		//mon_init();
    
		/*$('#mon_chk_g').change(function() {
		    mon_draw_table()
		});*/
    
		/*$('#mon_chk_c').change(function() {
	    	mon_draw_table()
		});*/

		google.maps.event.trigger(map, 'resize');
    }catch(err){
		$("#error").show();
		$("#error_mensaje").html('Revise su conex&oacute;n a Internet.<br><br>El Mapa no pudo mostrarse.');
    }
}