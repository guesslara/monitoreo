var map;  	
var tab_active=0;

$(document).ready(
	
	function(){
		//pestañas
		$( "#tabs" ).tabs({ 
        	select: function(event, ui) { 
			tab_active = ui.index;
			
			if(tab_active==0){
				mon_refresh_units();
			}else{
				stopTimer();
			}
			if(tab_active==3){
				loadDashBoard()					
			}			
        	}
		
		});
		
		$( "#tabs" ).tabs({
			beforeActivate: function (event, ui) {
				alert("Mensaje");
			}
		});
	
		//Dialog mensajes		
		$( "#dialog_message" ).dialog({
			autoOpen:false,
			modal: false,
			buttons: {
				Aceptar: function() {
					$("#dialog_message" ).dialog( "close" );

				}
			}
		});	

		$( "#mon_dialog" ).dialog({
			autoOpen:false,
			modal: true,
			resizable: false,
			title: "Envio de Comandos",
			buttons: {
				Enviar: function() {
					mon_send_command()
				}
			}
		});		


		$( "#mon_dialogAll" ).dialog({
			autoOpen:false,
			modal: true,
			resizable: false,
			title: "Envio de Comandos",
			buttons: {
				Enviar: function() {
					sendCommands()
				}
			}
		});	

		$("#gral_button_close").click(function() {
			location.href='index.php?m=login&c=login&md=lo';
		});

		$("#gral_button_admin").click(function() {
			location.href='index.php?m=mAdmin';
		});		

		$("#gral_button_manual").click(function(e) {
			window.open('/manuals/manual.pdf');
		});
		
		$("#gral_button_soporte").click(function(e){
			//codigo necesario para el boton
			if($("#frameSoporte").length==0){
				abrirTickets();
			}else{
				if ($('#frameSoporte').is(':visible')){
					mostrarAdvertencia();	
				}else{
					$("#frameSoporte").remove();
					abrirTickets();
				}
			}
		});

		$("#gral_button_events").click(function() {
  			var caracteristicas = "height=560,width=660,scrollTo,resizable=1,scrollbars=1,location=0";
			nueva=window.open("index.php?m=mMonitoreo&c=mShowEvents", 'Popup', caracteristicas);
		});
		
		
		/*Modificaciones para la animacion de los divs en monitoreo*/
		//obtiene el tamaño de los divs, cuantos existen determina el tamaño del carrete de divs
		var imageWidth = $(".window").width();
		var imageSum = $(".divContenedorSlider").size();
		var imageReelWidth = imageWidth * imageSum;
		
		//Ajusta el carrete de divs a su nuevo tamaño
		$(".image_reel").css({'width' : imageReelWidth});
		
		//Funcion para el slider
		rotate = function(){
			var triggerID;
			
			triggerID = $active.attr("rel") - 1; //obtiene el numero de veces del slider
			var image_reelPosition = triggerID * imageWidth; //determina la distancia que el carrete necesita para moverse
			if($active.attr("rel")==1){
				$("#enlaceMisUnidades").html("Unidades Disponibles");
				$("#enlaceMisUnidades").attr("title","Unidades Disponibles");
			}
			//animacion de los divs
			$(".image_reel").animate({ 
				left: -image_reelPosition
			}, 500 );
		};
	
		//On Click
		$("#contenedorSlider a").click(function() {	
			//$active = $(this); //Activate the clicked paging
			//rotate(); //Trigger rotation immediately
			//return false; //Prevent browser jump to link anchor
		});	
		
		//se colocar el div Inicial para el arrastre de forma contraria 
		//var inicio=true;
		//var divInicial = 2; //Div Inicial
		//rotate(); //se llama a la rotacion del div	
		/*fin de las modificaciones en monitoreo*/
		
		
		
		
		$("#btnUltimasPosiciones").click(function (){
			//mostrarultimasPosiciones();
			$active = $(this); //Activate the clicked paging
			rotate(); //Trigger rotation immediately
			$("#btnUltimasPosiciones").hide();
			$("#mostrarMapa").show();
			return false; //Prevent browser jump to link anchor
		})
		
		$("#btnUltimaPosicion").click(function(){
			/*if(array_selected.length == 0){
				alert("Seleccione una unidad para mostrar su ultima posicion");
			}else{*/
				$("#enlaceMisUnidades").html("<img src='./public/images/ocultar2.png' height='13' border='0' />&nbsp;Regresar a Mis Unidades");//se cambia la propiedad
				$("#enlaceMisUnidades").attr("title","Regresar a Unidades Disponibles");//se cambia el atributo
				$("#divUltimasPosiciones").show();//se muestra el div con las uposiciones
				$("#btnMinimizarUP").show();
				animarBarraUnidades();//se oculta la barra de unidades
				$("#btnMinimizarUP").css("bottom","205px");//se coloca el boton de minimizar
				barraUP=1;
				
				
				//se llama a la funcion
				mon_build_puntos(0);
			//}
		})
		
		$("#mostrarMapa").click(function (){
			$("#btnUltimasPosiciones").show();
			$("#mostrarMapa").hide();
		})
		
		/*$("#enlaceMonitoreo").click(function(){
			$("#contenedorSlider").animate({ 
				left: 8
			}, 100 );
		})*/
		
		$("#btnCejillaOcultar").click(function(){//btnOcultar
			animarBarraUnidades();	
		})
		
		$("#btnMinimizarUP").click(function(){
			minimizarPanel();
		})
		
		$("#mon_acordeon_unidades").click(function(){
			//acciones sobre el div para cambiar su z-index
			cambiarFocus("mon_acordeon_unidades");
		})
		$("#contenedorSlider").click(function(){
			//acciones sobre el div para cambiar su z-index
			cambiarFocus("contenedorSlider");
		})
		$("#divUltimasPosiciones").click(function(){
			cambiarFocus("divUltimasPosiciones");
		})
		//cambiarFocus();
	});
function cambiarFocus(divFocus){
	//recuperar el z-index de los divs
	vAc=$("#"+divFocus).zIndex();
	$("#"+divFocus).css("zIndex",(vAc+1));
}
var barraUP=1;
function minimizarPanel(){
	if (barraUP==1) {
		$("#divUltimasPosiciones").hide("fast");
		$("#btnMinimizarUP").html("<img src='./public/images/maximizar2.png' border='0' />");
		$("#btnMinimizarUP").attr('title','De clic para maximizar la ventana de Ultimas Posiciones');
		$("#btnMinimizarUP").css("bottom","9px");
		barraUP=0;
	}else{
		$("#divUltimasPosiciones").fadeTo("fast",1);
		$("#btnMinimizarUP").css("bottom","205px");
		$("#btnMinimizarUP").html("<img src='./public/images/minimizar2.png' border='0' />");
		$("#btnMinimizarUP").attr('title','De clic para minimizar la ventana de Ultimas Posiciones');
		barraUP=1;
	}
}
var barraUnidades=1;
function animarBarraUnidades(){
	if (barraUnidades==1) {
		movIzqC=6;
		img="mostrar2.png";
		pal="mostrar";
		$("#contenedorSlider").hide("fast");
		barraUnidades=0;
	}else if(barraUnidades==0){
		movIzqC="28.3%";
		img="ocultar2.png";
		funcion="animarBarraUnidades(1)";
		pal="ocultar";
		$("#contenedorSlider").fadeTo("fast",1);
		barraUnidades=1;
	}	
	//se mueve el indicador de la cejilla
	$("#btnCejillaOcultar").animate({ 
		left: movIzqC
	}, 100 );
	//se cambia la imagen de la cejilla
	$("#btnCejillaOcultar").html("<img src='./public/images/"+img+"' border='0' style='margin: 7px 0px 0px 2px;' />");
	$("#btnCejillaOcultar").attr('title','Dar clic para '+pal+' la barra de unidades');
}
/*
 *@name Funcion para abrir los ticktes
 *@author Gerardo Lara
*/
function abrirTickets(){
	//$("#Soporte").dialog("open");
	var horizontalPadding = 10;
	var verticalPadding = 0;
	$('<iframe id="frameSoporte" src="http://192.168.0.70/tickets/open1.php" />').dialog({
	title: 'Soporte',
	autoOpen: true,
	width: 600,
	height: 600,
	modal: false,
	resizable: false,
	autoResize: true,
	overlay: {
	    opacity: 0.5,
	    background: "black"
	}
	}).width(600 - horizontalPadding).height(600 - verticalPadding);
}
/*
 *@name Funcion para mostrar el aviso de mas de una ventana en los tickets
 *@author Gerardo Lara
*/
function mostrarAdvertencia(){
	$('#mensajesTickets').dialog({
	title: 'Informaci&oacute;n - Soporte',
	autoOpen: true,
	width: 350,
	height: 150,
	modal: true,
	resizable: false,
	autoResize: true,
	buttons: {
		"Cerrar": function(){
				if($("#mensajesTickets" ).dialog('isOpen')){
					$("#mensajesTickets").dialog('close');
				}								
			}
		},
	});
}
/*
 *@name Funcion para mostrar los avisos en el modulo monitoreo
 *@author Gerardo Lara
*/
function mostrarAvisos(){	
	$('#divAviso').dialog({
	title: 'Informaci&oacute;n',
	autoOpen: true,
	width: 450,
	height: 400,
	modal: true,
	resizable: false,
	autoResize: true,
	buttons: {
		"Cerrar": function(){
				if($("#divAviso").dialog('isOpen')){
					$("#divAviso").dialog('close');
				}								
			}
		},
	});
}

function updateFields(latInt, lonInt){
	//alert('update');
	var latInt = parseFloat(latInt);
	var lonInt = parseFloat(lonInt);
	
	$("#txt_lat").val(latInt.toFixed(6));
	$("#txt_lon").val(lonInt.toFixed(6));
	
	var point = new GLatLng(latInt,lonInt);
	point_pan = point;
	
}

function init(){
	//onload_map();
	//tabAd();
	//tabRe();
	/*Funcion para redimensionar los divs*/
	redimensionarDivs();
	/*Funcion para mostrar la advertencia*/
	//mostrarAvisos();
	
	//nuevas funciones para agilizar la carga
	cargarGrupos();
	//funcion principal
	//mon_arreglo_carga();
}

function menudefault(){
	$("#accordion_container").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mMonitoreo&c=menu",
        data: "",
        success: function(datos){
			if(datos!=0){
				$("#accordion_container").html(datos);
			}else{
				$("#accordion_container").html("No se han Creado un menú");
			}
			
        }
	});
}

//---------------------------------------------
function tabAd(){
	$("#Admon").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mAdmon&c=default",
        data: "",
        success: function(datos){
			//alert(datos)
			if(datos!=0){
				$("#Admon").html(datos);
				menuAd();

			}else{
				$("#Admon").html("No se han Creado Grupos");
			}
			
        }
	});
}
//---------------------------------------------
function menuAd(){
	$("#adn_menu").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mAdmon&c=menu",
        data: "",
        success: function(datos){
			//alert(datos)
			if(datos!=0){
				$("#adn_menu").html(datos);
				//document.getElementById('adn_menu').innerHTML = datos;
				//$("#adn_menu").css('border-color', 'red');

			}else{
				$("#adn_menu").html("No se han Creado Grupos");
			}
			
        }
	});
}
//---------------------------------------------
function tabRe(){
	$("#Report").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mReportes&c=default",
        data: "",
        success: function(datos){
			if(datos!=0){
				$("#Report").html(datos);
				menuRe();

			}else{
				$("#Report").html("No se han Creado Grupos");
			}
			
        }
	});
}
//---------------------------------------------
function menuRe(){
	$("#rep_menu").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mReportes&c=menu",
        data: "",
        success: function(datos){
			//alert(datos)
			if(datos!=0){
				$("#rep_menu").html(datos);
				//document.getElementById('adn_menu').innerHTML = datos;
				//$("#adn_menu").css('border-color', 'red');

			}else{
				$("#rep_menu").html("No se han Creado Grupos");
			}
			
        }
	});
}
//---------------------------------------------
function tabAj(){
	$("#Ajuste").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mAjuste&c=default",
        data: "",
        success: function(datos){
			if(datos!=0){
				$("#Ajuste").html(datos);

			}else{
				$("#Ajuste").html("No se han Creado Grupos");
			}
			
        }
	});
}

function loadDashBoard(){
	$("#DashBoard").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mReports&c=default",
        data: "",
        success: function(datos){
			if(datos!=0){
				$("#DashBoard").html(datos);
			}else{
				$("#DashBoard").html("");
			}
			
        }
	});
}