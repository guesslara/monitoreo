var mapaMonitoreo;//instancia del mapa	
var tab_active			  			= 0;//tab activo
var banderaUltimaPosicion 			= 0;//bandera de ultima posicion
var barraUP				  			= 1;
var focusVentanas		  			= 2;
var mostrarBtnRutas		  			= false;
var arrayunits 			  			= new Array();
var array_selected  	  			= Array();
var markers 			  			= [];//array para almacenar los markers

var arraygeosP 			  			= [];//array para almacenar los datos de ultimas posiciones
var mon_timer,mon_timer_count;
var info_window			  			= '';
var infowindow;
var beachMarker;
var arrayReferencias	  			= Array();
var aComandosAll 		  			= '';
//var UnitsString  		  			= '';
var mon_array_autocomplete 			= Array();//array donde se guardan los nombres de las unidades
var mon_array_autocompleteGeo 		= Array();//array donde se guardan los nombres de las georeferencias
//variables adicionales
var cargadorInicial		  			= 0;
var array_latitudes	 	  			= Array();
var array_longitudes 	  			= Array();
var banderaSeguimiento 	  			= false;
var unidadSeleccionada 	  			= 0;
var arrayDireccionesResult			= Array();
var conexionIe						= true;
//modificacion georeferencias
var arrayGeopuntosGeo				= Array();
var arrayGeocercasGeo				= Array();
var arrayGeorutasGeo				= Array();

var datosGeoreferencias				= Array();
var datosGeocercas 					= Array();
var datosGeorutas 					= Array();

var georeferenciasSel 				= Array();

$(document).ready(function(){
		try{
			infoWindow = new google.maps.InfoWindow;//declaracion del objeto infowindow
		}catch(err){
			conexionIe=false;
			$("#error").show();
			$("#error_mensaje").html('Revise su conex&oacute;n a Internet.<br><br>El Mapa no pudo mostrarse.');
		}
		
		$( "#tabs" ).tabs({ //pestañas
        	select: function(event, ui) { 
				tab_active = ui.index;
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
		$( "#mon_dialog" ).dialog({//ventana para el envio de comandos
			autoOpen:false,
			modal: true,
			resizable: false,
			width: 280,
			height: 180,
			title: "Envio de Comandos",
			buttons: {
				Cancelar: function(){
					$( "#mon_dialog" ).dialog("close");
				},
				Enviar: function() {
					mon_send_command()
				}
			}
		});		
		$( "#mon_dialogAll" ).dialog({//ventana para el envio de comandos a todas las unidades
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
		$("#gral_button_close").click(function() {//Boton para cerrar la sesion en la plataforma
			location.href='index.php?m=login&c=login&md=lo';
		});

		$("#gral_button_admin").click(function() {
			location.href='index.php?m=mAdmin';
		});		

		$("#gral_button_manual").click(function(e) {
			window.open('/manuals/manual.pdf');
		});
		
		$("#gral_button_soporte").click(function(e){
			if($("#frameSoporte").length==0){//codigo necesario para el boton
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
			//nueva=window.open("index.php?m=mMonitoreo&c=mShowEvents", 'Popup', caracteristicas);
			nueva=window.open("index.php?m=mMonitoreo4&c=mUltimosEventos", 'Popup', caracteristicas);			
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
			cambiarFocus("mon_acordeon_unidades");//acciones sobre el div para cambiar su z-index
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
		//FUNCION QUE ACTUALIZA EL TEMPORIZADOR DE LAS UNIDADES
		$("#mon_sel_time").change(function (){
		    mon_refresh_units();//FUNCION PARA ACTUALIZAR LAS UNIDADES
		});
		
		$("#divEngraneActualiza").click(function(){
			$("#cambiarActualizacion").fadeIn("slow");
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

		$("#addRuta").click(function(){
			altoMainView=$("#main_view").height();
			if(mostrarBtnRutas==false){
				$("#addRuta").attr("title","De clic para cerrar la busqueda de rutas")
				$("#monitoreoRutas").show();
				$("#puntoDePartida").attr("value","");
				$("#destinoRuta").attr("value","");
				$("#puntoDePartida").focus();
				mostrarBtnRutas=true;
				$("#mon_menu_acordeon").css("height",(altoMainView-160)+"px");
			}else{
				$("#addRuta").attr("title","Buscar rutas")
				$("#monitoreoRutas").hide();
				mostrarBtnRutas=false;
				$("#mon_menu_acordeon").css("height",(altoMainView-70)+"px");
			}
		});

		$("#btnMostrarRuta").click(function(){
			verificaDatos();
		});

		$( "#mensajeMejoras" ).dialog({
			autoOpen:false,
			modal: false,
			width: 700,
			height: 520,
			modal: true,
			buttons: {
				Aceptar: function() {
					$("#mensajeMejoras" ).dialog( "close" );

				}
			}
		});

		$("#btnActualizaTiempo").button({
 			icons: {
				primary: "ui-icon-triangle-1-s"
			},
			text: false
		});

		$("#btnActualizaTiempo,#mon_TiempoActualizar").click(function(){
			$("#cambiarActualizacion").fadeIn("slow");
		});

		$("#btnMostrarOpcionesGeoreferencias").button({
			icons:{ primary: "ui-icon-triangle-1-s"},
			text:false
		})

		$("#btnMostrarOpcionesGeoreferencias,#btnMostrarOpcGeo2").click(function(){
			$("#menuGeoreferencias").show();
		});

		$("#cambiarActualizacion").hover(function(){
			$(this).css("background","F0F0F0");
		},function(){
			$(this).slideUp("fast");
		})

		$("#60secs, #1min, #2min").click(function(){
			mon_refresh_units();
		});

		$("#menuGeoreferencias").hover(function(){
			$(this).css("background","F0F0F0");
		},function(){
			$(this).slideUp("fast");
		})

 		$("#mnuGeoreferencias2").multiselect({
 			noneSelectedText: "Georefencias",
 			header: "Elija una opción:",
 			selectedText: "# Geos. seleccionada(s)",
 			minWidth: 170,
 			height: 87
 		});

 		$("#ui-multiselect-mnuGeoreferencias2-option-0").click(function(){
 			//console.log($(this).is(':checked'));
 			if($(this).is(':checked')==false){
 				accionesGeopuntosCercas(6);//se ocultan los geopuntos
 			}else{
 				accionesGeopuntosCercas(7);//se muestran los geopuntos
 			}
 		});

 		$("#ui-multiselect-mnuGeoreferencias2-option-1").click(function(){
			if($(this).is(':checked')==false){
 				accionesGeopuntosCercas(8);//se ocultan los geopuntos
 			}else{
 				accionesGeopuntosCercas(9);//se muestran los geopuntos
 			}
 		});

 		$("#ui-multiselect-mnuGeoreferencias2-option-2").click(function(){
			if($(this).is(':checked')==false){
 				accionesGeopuntosCercas(10);//se ocultan los geopuntos
 			}else{
 				accionesGeopuntosCercas(11);//se muestran los geopuntos
 			}
 		});


 		$("#rdbDireccion,#rdbUnidades").click(function(){
 			mostraCajaBusqueda($(this).attr("id"));
 		});
		
 		$("#txtDireccionM").keyup(function(e){
 			buscarDireccion($(this).val(),e)
 		});

		$("#tituloUnidadesDisponibles1,#tituloGeoreferenciasDisponibles").click(function () {
        	filtroControl=$(this).val();
        	if(filtroControl=="georeferencias"){
        		$("#main_view").hide();
        		$("#main_viewGeoreferencias").show();
        	}else if(filtroControl=="unidades"){
				$("#main_view").show();
        		$("#main_viewGeoreferencias").hide();
        	}

    	}); 		

 		$("input[name=rdbOpcionBuscaGeo]").click(function (){
        	filtroGeo=$(this).val();
        	//console.log(filtroGeo);
        	mon_array_autocompleteGeo.length=0;
        	mostrarTiposGeoreferencias(filtroGeo);
    	});

		init();//funcion inicial
		//$("#barraMonitoreo").draggable({ cursor: "move",containment: "#Monitoreo" });
	});

function mostrarTiposGeoreferencias(filtroGeo){
	usuarioId=$("#usuarioId").val();
	clienteId=$("#usuarioCliente").val();
	parametros="action=mostrarTipoGeoreferenciasMonitoreo&usuarioId="+usuarioId+"&clienteId="+clienteId+"&filtroGeo="+filtroGeo;
	//$("#mon_menu_acordeonGeoreferencias").html("");
	ajaxMonitoreo("mostrarTipoGeoreferenciasMonitoreo","controlador",parametros,"cargador2","mon_menu_acordeonGeoreferencias","POST");

}

function mostraCajaBusqueda(idRdb){
	if(idRdb=="rdbDireccion"){
		$("#tags").hide();
		$("#txtDireccionM").show();
		$("#txtDireccionM").focus();
		$("#txtDireccionM").attr("value","");
	}else if(idRdb=="rdbUnidades"){
		$("#tags").show();
		$("#tags").attr("value","");
		$("#txtDireccionM").hide();
	}
}	
/*
 *funciones a cargar al inicio de la aplicacion
*/
function init(){
	try{
		mostrarMapa();
		tabAd();//tab administracion
		menuAd();
		//menuRe();//menu reportes
		redimensionarDivs();/*Funcion para redimensionar los divs*/
		//mostrarAvisos();/*Funcion para mostrar la advertencia*/
		//nuevas funciones para agilizar la carga
		cargarGrupos();//carga de grupos
		mostrarMensaje=$("#seguimiento").val();
		/*if(mostrarMensaje=="Y"){
			$( "#mensajeMejoras" ).dialog("open");
		}*/
	}catch(err){
		$("#error").show();
		$("#error_mensaje").html('Error al cargarse las dependencias.');
	}
}

function actualizaUltimasPosiciones(){
	if(banderaUltimaPosicion==0){
		banderaUltimaPosicion=1;
	}else{
		cargarUltimasPosiciones();
	}
	enviarAUP();//funcion para mostrar el div
}
function enviarAUP(){
	$("#divUltimasPosiciones").show();//se muestra el div con las uposiciones
	$("#btnMinimizarUP").show();
	$("#btnMinimizarUP").css("bottom","238px");//se coloca el boton de minimizar
	barraUP=1;
}
function cambiarFocus(divFocus){
	focusVentanas+=1;
	vAc=$("#"+divFocus).zIndex();//recuperar el z-index de los divs
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
		$("#contenedorSlider").show("fast");
		barraUnidades=1;
	}
	$("#btnCejillaOcultar").animate({ //se mueve el indicador de la cejilla
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
/*Funcion de Administracion*/
function tabAd(){
	$("#Admon").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mAdmon&c=default",
        data: "",
        success: function(datos){
			if(datos!=0){
				$("#Admon").html(datos);
				menuAd();
			}else{
				$("#Admon").html("No se han Creado Grupos");
			}
			
        }
	});
}
/*Carga de menu*/
function menuAd(){
	$("#adm_menu").html("");
	$.ajax({
		type: "GET",
        url: "index.php?m=mAdmon&c=menu",
        data: "",
        success: function(datos){
			if(datos!=0){
				$("#adn_menu").html(datos);
			}else{
				$("#adn_menu").html("No se han Creado Grupos");
			}
        }
	});
	//profile=$("#profl").val();
	//ajaxMonitoreo("cargarMenuAdmon","controlador","action=mostrarMenuAdmon&profl="+profile,"cargador2","adm_menu","POST");
}
function menuRe(){
	usuarioId=$("#usuarioId").val();
	$("#rep_menu").html("");
	ajaxMonitoreo("cargaMenuReportes","menu","","rep_menu","rep_menu","POST");
	ajaxMonitoreo("mostrarNuevoMenu","controlador","action=mostrarNuevoMenu&idUsuario="+usuarioId,"menuReportes","menuReportes","POST");
}
function adm_abrir_modulo(m,indice){
	//alert(m);
	//$("#accordion_container").html("");
	$("#adm_menu div").each(function( index ) {
		//console.log( index + ": " + $( this ).text() );
		id=$(this).attr("id");
		console.log(id);
		$("#"+id).removeClass("ui-state-active");
		$("#"+id).addClass("estiloDivMenuAdmon");
	});
	$("#"+indice).addClass("ui-state-active")
	$.ajax({
		type: "POST",
		url: "index.php?m="+m+"&c=default",
		data: "",
		beforeSend:function(){
			$("#cargadorModulo").show(); 
			$("#span_welcome").html(""); 
		},
		success: function(datos){
			if(datos!=0){
				$("#cargadorModulo").hide(); 
				$("#adm_content").html(datos);
			    //$("#example").treeview();
			}else{
				$("#adm_content").html("No se han Creado un menú");
			}
			
		}
	});
}