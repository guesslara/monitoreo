var map;  	
var tab_active=0;
var banderaUltimaPosicion=0;
var barraUP=1;
var focusVentanas=2;
$(document).ready(
	function(){
		//declaracion del objeto infowindow
		infoWindow = new google.maps.InfoWindow;
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
		
		$("#btnUltimaPosicion").click(function(){
			if(array_selected.length == 0){
				alert("Seleccione una unidad para mostrar su ultima posicion");
			}else{
				enviarAUP();
				cargarUltimasPosiciones();
				mon_refresh_units();//se inicia el contador para el refresco de las unidades
			}
		})
		
		$("#mostrarMapa").click(function (){
			$("#btnUltimasPosiciones").show();
			$("#mostrarMapa").hide();
		})
		
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
		$("#tablaX").click(function(){
			cambiarFocus("divUltimasPosiciones");
		})
		//cambiarFocus();
		//FUNCION QUE ACTUALIZA EL TEMPORIZADOR DE LAS UNIDADES
		$("#mon_sel_time").change(function (){
		    mon_refresh_units();//FUNCION PARA ACTUALIZAR LAS UNIDADES
		});
		
		$("#divEngraneActualiza").click(function(){
			$("#cambiarActualizacion").fadeIn("slow");
		});
		
		$("#enlaceCerrarAjusteTiempo").click(function(){
			$("#cambiarActualizacion").fadeOut("slow");
		});

		$("#btnCerrarVentanaError").click(function(){
			$("#error").hide();
		    $("#error_mensaje").html('');
		});

		$("#enlaceGenerarTicket").click(function(){
			if($("#frameSoporte").length==0){
				abrirTickets();
				$("#error").hide();
		    	$("#error_mensaje").html('');
			}else{
				if ($('#frameSoporte').is(':visible')){
					mostrarAdvertencia();	
				}else{
					$("#frameSoporte").remove();
					abrirTickets();
					$("#error").hide();
		    		$("#error_mensaje").html('');
				}
			}
		});

		$("#enlaceCerrarSesion").click(function(){
			window.location.href="index.php?m=login";
		})


		$("#enlaceVentana").click(function(){
 			window.open("modules/mMonitoreo4/test4.html", "popupId", "location=no,menubar=no,titlebar=no,resizable=yes,toolbar=no, menubar=no,width=500,height=500");
		});

	});
/*
 *funciones a cargar al inicio de la aplicacion
*/
function init(){
	try{
		mostrarMapa();
		tabAd();//tab administracion
		tabRe();//tab reportes
		redimensionarDivs();/*Funcion para redimensionar los divs*/
		//mostrarAvisos();/*Funcion para mostrar la advertencia*/
		//nuevas funciones para agilizar la carga
		cargarGrupos();//carga de grupos
	}catch(err){
		$("#error").show();
		$("#error_mensaje").html('Error al cargarse las dependencias.');
	}
}

function actualizaUltimasPosiciones(){
	if(banderaUltimaPosicion==0){
		mon_build_puntos(0);
		banderaUltimaPosicion=1;
	}else{
		mon_build_puntos(0);
	}
	enviarAUP();//funcion para mostrar el div
}
function enviarAUP(){
	$("#divUltimasPosiciones").show();//se muestra el div con las uposiciones
	$("#btnMinimizarUP").show();
	//animarBarraUnidades();//se oculta la barra de unidades
	$("#btnMinimizarUP").css("bottom","238px");//se coloca el boton de minimizar
	barraUP=1;
}
function cambiarFocus(divFocus){
	//alert(divFocus)
	//recuperar el z-index de los divs
	focusVentanas+=1;
	vAc=$("#"+divFocus).zIndex();
	//alert(vAc);
	$("#"+divFocus).css("zIndex",focusVentanas);
}

function minimizarPanel(){
	if (barraUP==1) {
		$("#divUltimasPosiciones").hide("fast");
		$("#btnMinimizarUP").html("<img src='./public/images/maximizar2.png' border='0' />");
		$("#btnMinimizarUP").attr('title','De clic para maximizar la ventana de Ultimas Posiciones');
		$("#btnMinimizarUP").css("bottom","9px");
		barraUP=0;
	}else{
		$("#divUltimasPosiciones").fadeTo("fast",1);
		$("#btnMinimizarUP").css("bottom","238px");
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
		movIzqC="305px";
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
	try{
		var horizontalPadding = 10;
		var verticalPadding = 0;
		$('<iframe id="frameSoporte" src="http://reportenet.2gps.net/open1.php" />').dialog({
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
	}catch(err){
		$("#error").show();
		$("#error_mensaje").html('Ha ocurrido un error al intentar mostrar la ventana<br>Verifique su conexion a Internet.');
	}
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