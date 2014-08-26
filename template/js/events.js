var oTable;
var alerts_data;
var aNewAlerts;
var playSound=false;

$(document).ready(function(){
	$( "#dialog_message" ).dialog({
		autoOpen:false,
		modal: false,
		buttons: {
			Aceptar: function() {
				$("#dialog_message" ).dialog( "close" );
			}
		}
	});	
	$( "#evts_cancel" ).button({
	  icons: {	    primary: "ui-icon-volume-off"
	  },
	  text: "Silenciar"
	}).click(function( event ) {
        stopSound()
    });	

	drawTable();
});

function drawTable(){
	var scroll_table="300px";
	oTable= $('#grp_table').dataTable({ 
		"aaData" :alerts_data,
		"sScrollY": scroll_table,               
		"bDestroy": true,
		"bLengthChange": false,
		"bPaginate": true,
		"bFilter": true,
		"bSort": true,
		"bJQueryUI": true,
		"iDisplayLength": 15,
		"bAutoWidth": false,
		"bSortClasses": false,    
		"aoColumns": [
		  { "mData": "UNIT", sDefaultContent: "" },
		  { "mData": "DATE", sDefaultContent: "" },
		  { "mData": "EVENT", sDefaultContent: "" },
		  { "mData": "DIR", sDefaultContent: "" }
		],           
		"oLanguage": {
		    "sInfo": "Mostrando _TOTAL_ registros (_START_ a _END_)",
		    "sEmptyTable": "No hay registros.",
		    "sInfoEmpty" : "No hay registros.",
		    "sInfoFiltered": " - Filtrado de un total de  _MAX_ registros",
		    "sLoadingRecords": "Leyendo información",
		    "sProcessing": "Procesando",
		    "sSearch": "Buscar:",
		    "sZeroRecords": "No hay registros",
		},
	      "fnInitComplete": function(oSettings, json) {	        
			refreshEvents()
	      }
	});
}

function refreshEvents(){
	mon_timer = $.timer(10000 , function(){
		loadNewEvents()
	});		
}

function loadNewEvents(){
	var totalNewRows=0;
	$.ajax({
		type: "POST",
		dataType : 'json',
        url: "index.php?m=mMonitoreo&c=mGetEvents",
        success: function(datos){
			var result = datos;
			$.each(result, function(index, value) {
				var id_new = value.ID;
				var existe = -1;
				$.each(alerts_data, function(index, value) {
					if(value.ID == id_new){
						existe = 0;
					}	
				});
				if(existe==0){/*console.log("existe")*/}
				else{					
					alerts_data.push(value);
					totalNewRows++;
					/*console.log("No existe");*/
				}
			});
			if(totalNewRows>0){
				drawTable();
				if(playSound==false){
					playSound=true;
					$('#sAlerta').get(0).play();
					soundStartPlay();
				}
			}	
        }
	});
}

function soundStartPlay(){
	mon_timer = $.timer(4000 , function(){
		if(playSound==true){
			$('#sAlerta').get(0).play();
		}else{
			$('#sAlerta').get(0).pause(); 
		}
	});			
}

function stopSound(){
	$('#sAlerta').get(0).pause(); 
	if(mon_timer!=null){
		mon_timer.stop();	
		mon_timer=null;
	}
	playSound=false;
}