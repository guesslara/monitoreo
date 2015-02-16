/*
 *@name 	Funcion para hacer las peticiones ajax
 *@author	Gerardo Lara
 *@date		26 - Agosto - 2014
*/
function ajaxMonitoreo(accion,c,parametros,divCarga,divResultado,tipoPeticion){
	(accion=="cargaReportes" || accion=="cargaMenuReportes" || accion=="mostrarNuevoMenu") ? m="mReportes" : m="mMonitoreo4";
	$.ajax({
		url: "index.php?m="+m+"&c="+c,
		type: tipoPeticion,
		data: parametros,
		beforeSend:function(){ 
			$("#"+divCarga).show().html("Procesando Informacion ..."); 
		},
		success: function(data) {
			$("#"+divCarga).hide();
			controladorAcciones(accion,data,divResultado);
		},
		timeout:90000000,
		error:function() {
		    $("#"+divCarga).hide();
		    $("#error").show();
		    $("#error_mensaje").html('Ocurrio un error al procesar la solicitud.');
		}
	});
}
/*
 *@name 	Funcion controlar las acciones dependiendo de la accion pedida
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function controladorAcciones(accion,datos,divResultado){
    switch(accion){
		case "dibujaGrupos":
	    	dibujaAcordeonGrupos(accion,datos);
		break;
		case "cargarGrupos":
			$("#mon_menu_acordeon").show().html("");
			dibujaAcordeonGrupos("",datos);
		break;
		case "cargarUltimasPosiciones":
			//$("#"+divResultado).show().html(datos);
			//alert(datos);
			evaluarCadenaUnidades(datos);
		break;
		case "pintarUbicaciones":
			//$("#"+divResultado).show().html(datos);
			muestraPosicionesHistorico(datos);
		break;
		case "cargarComandosUnidad":
			$("#"+divResultado).show().html(datos);
		break;
		case "enviarComando":
			//$("#"+divResultado).show().html(datos);
			evaluaComandoEnviado(datos);
		break;
		case "cargaReportes":
			$("#"+divResultado).show().html(datos);
		break;
		case "cargaMenuReportes":
			$("#"+divResultado).show().html(datos);
		break;
		case "mostrarNuevoMenu":
			$("#"+divResultado).show().html(datos);
		break;
		case "mostrarTipoGeoreferencias":
			//$("#"+divResultado).show().html(datos);
			if(datos==0){
				$("#error").show();
				$("#error_mensaje").html('No hay tipos de Georeferencias en la Base de Datos para este usuario.');
			}else{
				dibujarAcordeonGeoreferencias("",datos);
			}
		break;
		case "extraerDatosGeoreferencia":
			contenteStrGeo=datos;
			//console.log(contenteStrGeo);
		break;
		case "cargarMenuAdmon":
			$("#"+divResultado).show().html(datos);
		break;
    }
}
/*
 *@name 	Funcion para cargar las ultimas posiciones de las unidades
 *@author	Gerardo Lara
 *@date		27 - Agosto -2014
*/
function cargarUltimasPosiciones(){
	usuarioId=$("#usuarioId").val();
	clienteId=$("#usuarioCliente").val();
	unidades="";
	for(i=0;i<array_selected.length;i++){
		(unidades=="") ? unidades=array_selected[i] : unidades+=","+array_selected[i];
	}
	parametros="action=cargarUltimasPosiciones&filtro="+unidades+"&idUsuario="+usuarioId+"&clienteId="+clienteId;
	ajaxMonitoreo("cargarUltimasPosiciones","controlador",parametros,"cargador2","mon_content","POST");
	if(banderaSeguimiento){//se compara el valor de la bandera y se manda a llamar la funcion para actualizar el seguimiento
		dibujaSeguimiento(unidadSeleccionada);//variable global con el id de la unidad seleccionada
		pintadoPosiciones=true;
	}
}
/*
 *@name 	Funcion para cargar los grupos de la base de datos
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function cargarGrupos(){
	usuarioId=$("#usuarioId").val();
	parametros="action=cargarGrupos&idUsuario="+usuarioId;
	ajaxMonitoreo("cargarGrupos","controlador",parametros,"mon_menu_acordeon","mon_menu_acordeon","POST");
}
/*
 *@name 	Funcion para dibujar el acordeon de las unidades
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function dibujaAcordeonGrupos(accion,datos){
	try{
		idGrupo="";
		bUnidades=false;
		title="De clic para activar el seguimiento de la unidad"; title1="De clic para activar todas las unidades";
		datos=datos.split("|");//se procesa el resultado para crear los grupos
		acordeon="<div id='mon_acordeon_unidades' style='border:0px solid #FF0000;height:auto;position:relative;width:99%;'>";
		for(i=0;i<datos.length;i++){
			grupos=datos[i].split(",");//se descomponen los elementos para la creacion de los grupos
			var miobjeto=new Object();/*inclusion para el autocomplete*/
			miobjeto.label=grupos[3];
			miobjeto.desc=grupos[2];
			mon_array_autocomplete.push(miobjeto);/*fin del autocomplete*/
			img="img_"+grupos[2];//identificador de las imagenes
			div="div_"+grupos[2];//identificador de los divs
			grupo="grupo_"+i;
			imgT="imgT_"+i;
			if (grupos[0] != idGrupo) {//se verifica si se crea un grupo
				if (bUnidades) {
					acordeon+="</div>";
					bUnidades=false;
				}
				acordeon+="<h3><span class='espacioTitulo'>"+grupos[1]+"</span></h3><div id='"+grupo+"'><div onclick='seleccionarTodas(\""+grupo+"\",0)' class='listadoUnidadesTodas' title='"+title1+"'><img id='"+imgT+"' src='./public/images/ok16.png' border='0' /><span class='textoTodas'>Todas</span></div><div onclick='seleccionarUnidad("+grupos[2]+",0)' id='"+div+"' class='listadoUnidades' title='"+title+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+grupos[3]+"</span></div>";
				bUnidades=true;
			}else{
				acordeon+="<div onclick='seleccionarUnidad("+grupos[2]+",0)' id='"+div+"' class='listadoUnidades' title='"+title+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+grupos[3]+"</span></div>";    
			}
			idGrupo=grupos[0];
		}
		acordeon+="</div>";
		$("#mon_menu_acordeon").append(acordeon);
		$("#mon_acordeon_unidades").accordion({clearStyle: true, autoHeight: false});

		$("#tags").autocomplete({
	      source: mon_array_autocomplete,
	      select: function( event, ui ) {      	
			seleccionarUnidad(ui.item.desc+"",0);
			enviarAUP();
			cargarUltimasPosiciones();
			mon_refresh_units();
	      },open: function () {
	        $(this).data("autocomplete").menu.element.width(250);
	    	}
	    });
	}catch(err){
		$("#error").show();
	    $("#error_mensaje").html('Ocurrio un error al crear los Grupos.');
	}
}
/*
 *@name 	Funcion para dibujar el acordeon de las unidades
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function dibujarAcordeonGeoreferencias(accion,datos){
	try{
		accionesGeopuntosCercas(7);
		datosGeopuntos="";
		idGrupoGeo="";
		bUnidades=false;
		itemNombre="";
		title="De clic para mostrar la Georeferencia"; title1="De clic para activar todas las georeferencias";
		datos=datos.split("||||");//se procesa el resultado para crear los grupos
		acordeon="<div id='mon_acordeon_GeoreferenciasM' style='border:0px solid #FF0000;height:auto;position:relative;width:99%;'>";
		for(i=0;i<datos.length;i++){
			grupos=datos[i].split(",");//se descomponen los elementos para la creacion de los grupos
			////console.log(grupos)
			var miobjeto=new Object();/*inclusion para el autocomplete*/
			miobjeto.label=grupos[2];
			miobjeto.desc=grupos[0];
			miobjeto.idObjectMap=grupos[1];
			miobjeto.tipo=grupos[5];
			mon_array_autocompleteGeo.push(miobjeto);/*fin del autocomplete*/
			img="img_"+grupos[1];//identificador de las imagenes
			div="div_"+grupos[1];//identificador de los divs
			grupo="grupoG_"+i;
			imgT="imgTG_"+i;
			//modificacion y prueba de los objetos de informacion para javascript
			if(grupos[5]=="G"){
				datosGeopuntos=new geoPuntos(grupos[0],grupos[1],grupos[2],grupos[3],grupos[4],grupos[5],grupos[6],grupos[7],grupos[8],grupos[9],grupos[10],grupos[11],grupos[12],grupos[13]);
				datosGeoreferencias.push(datosGeopuntos);
				////console.log(datosGeoreferencias);
			}else if(grupos[5]=="C"){
				datosGeocerca=new geoCercaRuta(grupos[0],grupos[1],grupos[2],grupos[3],grupos[4],grupos[5],grupos[6],grupos[7],grupos[8],grupos[9]);
				datosGeocercas.push(datosGeocerca);
				////console.log(datosGeocercas);
			}else if(grupos[5]=="R"){
				datosGeoruta=new geoCercaRuta(grupos[0],grupos[1],grupos[2],grupos[3],grupos[4],grupos[5],grupos[6],grupos[7],grupos[8],grupos[9]);
				datosGeorutas.push(datosGeoruta);
			}
			
			if(grupos[2].length > 30){
				itemNombre=grupos[2].substring(0,35)+" ...";
			}else{
				itemNombre=grupos[2];
			}

			if (grupos[0] != idGrupoGeo) {//se verifica si se crea un grupo
				if (bUnidades) {
					acordeon+="</div>";
					bUnidades=false;
				}
				//acordeon+="<h3><span class='espacioTitulo'>"+grupos[0]+"</span></h3><div id='"+grupo+"'><div onclick='seleccionarTodosGeoreferencias(\""+grupo+"\",0)' class='listadoUnidadesTodas' title='"+title1+"'><img id='"+imgT+"' src='./public/images/ok16.png' border='0' /><span class='textoTodas'>Todas</span></div><div onclick='seleccionarGeoreferencia("+grupos[1]+",0,\""+grupos[5]+"\",\""+grupos[6]+"\",\""+grupos[3]+"\",\""+grupos[4]+"\")' id='"+div+"' class='listadoUnidades' title='"+title+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+grupos[2]+"</span></div>";
				acordeon+="<h3><span class='espacioTitulo'>"+grupos[0]+"</span></h3><div id='"+grupo+"'><div onclick='seleccionarTodosGeoreferencias(\""+grupo+"\",0,\""+grupos[5]+"\")' class='listadoUnidadesTodas' title='"+title1+"'><img id='"+imgT+"' src='./public/images/ok16.png' border='0' /><span class='textoTodas'>Todas</span></div><div onclick='seleccionarGeoreferencia("+grupos[1]+",0,\""+grupos[5]+"\")' id='"+div+"' class='listadoUnidades' title='"+grupos[2]+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+itemNombre+"</span></div>";
				bUnidades=true;
			}else{
				//acordeon+="<div onclick='seleccionarGeoreferencia("+grupos[1]+",0,\""+grupos[5]+"\",\""+grupos[6]+"\",\""+grupos[3]+"\",\""+grupos[4]+"\")' id='"+div+"' class='listadoUnidades' title='"+title+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+grupos[2]+"</span></div>";
				acordeon+="<div onclick='seleccionarGeoreferencia("+grupos[1]+",0,\""+grupos[5]+"\")' id='"+div+"' class='listadoUnidades' title='"+grupos[2]+"'><img id='"+img+"' src='./public/images/ok16.png' border='0' /><span class='listadoInfoUnidades'>"+itemNombre+"</span></div>";    
			}
			idGrupoGeo=grupos[0];
			datosGeopuntos="";
		}
		acordeon+="</div>";

		$("#mon_menu_acordeonGeoreferencias").append(acordeon);
		$("#mon_acordeon_GeoreferenciasM").accordion({clearStyle: true, autoHeight: false});


		$("#tagsGeoreferencias").autocomplete({
	      source: mon_array_autocompleteGeo,
	      select: function( event, ui ) {
			seleccionarGeoreferencia(ui.item.idObjectMap,0,ui.item.tipo);
			
	      },open: function () {
	        $(this).data("autocomplete").menu.element.width(250);
	    	}
	    });
	    //se verifican los elementos seleccionados
	    if(georeferenciasSel.length != 0){
			verificarGeoreferenciasSeleccionadas();
	    }
	}catch(err){
		$("#error").show();
	    $("#error_mensaje").html('Ocurrio un error al cargar las georeferencias.');
	    console.log(err);
	}
}
function seleccionarGeoreferencia(idObjectMap,bandera,tipo){
	if(bandera==1){
		idGeoABorrar=-1;
	}else{
		idGeoABorrar=georeferenciasSel.indexOf(idObjectMap+"??"+tipo);	
	}
	if(idGeoABorrar == -1){//no existe en el array
		if(tipo=="G"){
			imageGeopunto="public/images/"+extraerDatosGeoreferencia(idObjectMap,"imagen");
			markerGeoReferenciasG=new google.maps.Marker({//se crea el marker para los geopuntos
				map:mapaMonitoreo,
				position:new google.maps.LatLng(parseFloat(extraerDatosGeoreferencia(idObjectMap,"latitud")),parseFloat(extraerDatosGeoreferencia(idObjectMap,"longitud"))),
				title: idObjectMap.toString(),
				icon: imageGeopunto
			});
			verInfoGeoreferencia(markerGeoReferenciasG,extraerDatosGeoreferencia(idObjectMap,"datosGeopunto"));
			georeferenciasSel.push(idObjectMap+"??"+tipo);
			arrayGeopuntosGeo.push(markerGeoReferenciasG);
			//se verifica si el check de informacion esta habilitado caso contrario lo habilitamos
			if(!$("#ui-multiselect-mnuGeoreferencias2-option-0").is(':checked')){
	            $("#ui-multiselect-mnuGeoreferencias2-option-0").attr('checked', true);
	        }
		}else if(tipo=="C"){
			var geocercaMonitoreo;
			datosGeocerca=extraerDatosGeoreferencia(idObjectMap,"Geocerca");
			color=extraerDatosGeoreferencia(idObjectMap,"GeocercaColor");
			var coordernadasGeocerca=[];
			for(i=0;i<datosGeocerca.length;i++){//se llena el arreglo de las coordenadas para la geocerca
				coordenadas=datosGeocerca[i].split(" ");
				coordernadasGeocerca[i]=new google.maps.LatLng(parseFloat(coordenadas[0]),parseFloat(coordenadas[1]));
			}
			geocercaMonitoreo = new google.maps.Polygon({//construccion de la geocerca
				map: mapaMonitoreo,
			    paths: coordernadasGeocerca,
			    fillColor: color,
			    fillOpacity: 0.35,
			    title:idObjectMap		//se añade la opcion de title que sirve como identificador para poder mostrarla despues
			});
			google.maps.event.addListener(geocercaMonitoreo,'click',verInfoGeocerca);
			georeferenciasSel.push(idObjectMap+"??"+tipo);
			arrayGeocercasGeo.push(geocercaMonitoreo);//se almacena la geocerca en el array de geocercas
			geocercaMonitoreo="";//se limpia el array del pintado de geocercas
			coordernadasGeocerca.length=0;
			////console.log(arrayGeocercasGeo);
			if(!$("#ui-multiselect-mnuGeoreferencias2-option-1").is(':checked')){
				$("#ui-multiselect-mnuGeoreferencias2-option-1").attr("checked",true);
			}

		}else if(tipo=="R"){
			datosGeoruta=extraerDatosGeoreferencia(idObjectMap,"Georuta");
			colorGeoruta=extraerDatosGeoreferencia(idObjectMap,"GeorutaColor");
			var coordernadasGeoruta=[];
			////console.log("DatosGeocerca "+datosGeocerca);
			//se llena el arreglo de las coordenadas para la geocerca
			////console.log("Longitud datosGeocerca "+datosGeoruta.length);
			for(i=0;i<datosGeoruta.length;i++){
				coordenadas=datosGeoruta[i].split(" ");
				coordernadasGeoruta[i]=new google.maps.LatLng(parseFloat(coordenadas[0]),parseFloat(coordenadas[1]));
			}
			georutaMonitoreo= new google.maps.Polyline({
				path:coordernadasGeoruta,
				geodesic:true,
				strokeColor: colorGeoruta,
				strokeOpacity: 1.0,
				strokeWeight:2,
				title: idObjectMap,
				map:mapaMonitoreo
			});
			georeferenciasSel.push(idObjectMap+"??"+tipo);
			//se almacena la geocerca en el array de geocercas	
			arrayGeorutasGeo.push(georutaMonitoreo);
			georutaMonitoreo="";
			coordernadasGeoruta.length=0;

			if(!$("#ui-multiselect-mnuGeoreferencias2-option-2").is(':checked')){
				$("#ui-multiselect-mnuGeoreferencias2-option-2").attr("checked",true);
			}

		}
		$("#mon_acordeon_GeoreferenciasM").find("#img_"+idObjectMap).attr("src","./public/images/tick.png")//cambia la imagen del div
		
	}else{
		if(tipo=="G"){
			accionesGeopuntosCercas(6);//se ocultan los markers
			for(var i=0;i< arrayGeopuntosGeo.length;i++){//se busca el elemento a borrar
				if(idObjectMap==arrayGeopuntosGeo[i].title){
					arrayGeopuntosGeo.splice(i, 1);//se quita el elemento del array de markers
				}
			}
			$("#mon_acordeon_GeoreferenciasM").find("#img_"+idObjectMap).attr("src","./public/images/ok16.png")//cambia la imagen del div
			georeferenciasSel.splice(idGeoABorrar, 1);//se quita el elemento del array
			accionesGeopuntosCercas(7);//se vuelve a pintar las ubicaciones
		}else if(tipo=="C"){
			accionesGeopuntosCercas(8);//se ocultan las geocercas
			////console.log("Longitud del array "+arrayGeocercasGeo.length);
			for(var i=0;i< arrayGeocercasGeo.length;i++){//se busca el elemento a borrar
				if(idObjectMap==arrayGeocercasGeo[i].title){
					////console.log("Se elimina elemento")
					arrayGeocercasGeo.splice(i, 1);//se quita el elemento del array de markers
				}
			}
			$("#mon_acordeon_GeoreferenciasM").find("#img_"+idObjectMap).attr("src","./public/images/ok16.png")//cambia la imagen del div
			georeferenciasSel.splice(idGeoABorrar, 1);//se quita el elemento del array
			accionesGeopuntosCercas(9);//se muestran las geocercas
		}else if(tipo=="R"){
			accionesGeopuntosCercas(10);//se ocultan las geocercas
			////console.log("Longitud del array "+arrayGeorutasGeo.length);
			for(var i=0;i< arrayGeorutasGeo.length;i++){//se busca el elemento a borrar
				if(idObjectMap==arrayGeorutasGeo[i].title){
					////console.log("Se elimina elemento")
					arrayGeorutasGeo.splice(i, 1);//se quita el elemento del array de markers
				}
			}
			$("#mon_acordeon_GeoreferenciasM").find("#img_"+idObjectMap).attr("src","./public/images/ok16.png")//cambia la imagen del div
			georeferenciasSel.splice(idGeoABorrar, 1);//se quita el elemento del array
			accionesGeopuntosCercas(11);//se ocultan las geocercas
		}		
	}
}

function seleccionarTodosGeoreferencias(grupo,bandera,tipo){
	$("#"+grupo+" .listadoUnidades").each(function (index) {//se recorren los divs contenidos en cada grupo
		idE=this.id;//id del elemento que se marcara
		srcImg=$("#"+idE+" img").attr("src");//averiguar el src de la imagen de cada elemento
		if(srcImg.substring(16)=="ok16.png" && bandera==0){
			seleccionarGeoreferencia(parseInt(idE.substring(4)),0,tipo)
		}else if(srcImg.substring(16)=="tick.png" && bandera==1){
		    seleccionarGeoreferencia(parseInt(idE.substring(4)),0,tipo);//se envia a la funcion para cambiar las imagenes y almacenar el valor
		}
    });
	imagenT=$("#imgTG_"+grupo.substring(7)).attr("src");//imagen del div del grupo
    if (imagenT.substring(16)=="ok16.png") {
		$("#imgTG_"+grupo.substring(7)).attr("src","./public/images/tick.png");//cambia la imagen del div
		$("#"+grupo+" .listadoUnidadesTodas").attr("onclick","seleccionarTodosGeoreferencias('"+grupo+"',1,\""+tipo+"\")");//cambia la bandera de la funcion
    }else{
		$("#imgTG_"+grupo.substring(7)).attr("src","./public/images/ok16.png");//cambia la imagen del div
		$("#"+grupo+" .listadoUnidadesTodas").attr("onclick","seleccionarTodosGeoreferencias('"+grupo+"',0,\""+tipo+"\")");//cambia la bandera de la funcion
		
    }
}
function extraerDatosGeoreferencia(idObjectMap,propiedad){
	indiceObjeto="";
	datos="";
	if(propiedad=="Geocerca" || propiedad=="GeocercaColor" || propiedad=="datosGeocerca"){
		for(i=0;i<datosGeocercas.length;i++){
			if(parseInt(datosGeocercas[i].idObjectMap)==parseInt(idObjectMap)){
				indiceObjeto=i;
				break;
			}
		}
	}else if(propiedad=="Georuta" || propiedad=="GeorutaColor"){
		for(i=0;i<datosGeorutas.length;i++){
			if(parseInt(datosGeorutas[i].idObjectMap)==parseInt(idObjectMap)){
				indiceObjeto=i;
				break;
			}
		}
	}else{
		for(i=0;i<datosGeoreferencias.length;i++){
			if(parseInt(datosGeoreferencias[i].idObjectMap)==parseInt(idObjectMap)){
				indiceObjeto=i;
				break;
			}
		}
	}
	switch(propiedad){
		case "imagen":
			datos=datosGeoreferencias[indiceObjeto].url;
		break;
		case "latitud":
			datos=datosGeoreferencias[indiceObjeto].latitud;
		break;
		case "longitud":
			datos=datosGeoreferencias[indiceObjeto].longitud;
		break;
		case "datosGeopunto":
			datos="<div style='height:38px;border-bottom:1px solid blue;'><div style='float:left;border:0px solid red;'><img src='public/images/"+datosGeoreferencias[indiceObjeto].url+"' border='0' /></div><div style='float:left;margin-top:10px;border:0px solid red;'>Informacion Georeferencia</div></div><table border='0' id='tblinfoUnidadGlobo' cellpadding='1' cellspacing='1' width='380'>"+
				"<tr>"+
					"<td width='130' class='estiloTituloTablaInfoUnidad'>Clasificado como:</td>"+
					"<td width='270'>"+datosGeoreferencias[indiceObjeto].tipoGeo+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Descripcion:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].descripcion+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Calle:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].calle+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>No. Interior:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].noInt+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>No. Ext:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].noExt+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Colonia:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].colonia+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Municipio:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].municipio+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Estadp:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].estado+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>C.P.:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].cp+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Latitud:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].latitud+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Longitud:</td>"+
					"<td>"+datosGeoreferencias[indiceObjeto].longitud+"</td>"+
				"</tr>"+
				"</table>";
		break;
		case "Geocerca":
			datos=datosGeocercas[indiceObjeto].geom;//se extraen las coordenadas de la geocerca
			datos=datos.substring(9,datos.length-2);//se separan en un array las coordenadas
			datos=datos.split("*");
		break;
		case "GeocercaColor":
			datos=datosGeocercas[indiceObjeto].color;
		break;
		case "datosGeocerca":
			datos="<div style='height:38px;border-bottom:1px solid blue;'>Informacion Georeferencia</div></div><table border='0' id='tblinfoUnidadGlobo' cellpadding='1' cellspacing='1' width='380'>"+
				"<tr>"+
					"<td width='130' class='estiloTituloTablaInfoUnidad'>Clasificado como:</td>"+
					"<td width='270'>"+datosGeocercas[indiceObjeto].tipoGeo+"</td>"+
				"</tr>"+
				"<tr>"+
					"<td class='estiloTituloTablaInfoUnidad'>Descripcion:</td>"+
					"<td>"+datosGeocercas[indiceObjeto].descripcion+"</td>"+
				"</tr>"+
				"</table>";
		break;
		case "Georuta":
			datos=datosGeorutas[indiceObjeto].geom;
			datos=datos.substring(11,datos.length-1);//se separan en un array las coordenadas
			datos=datos.split("*");
			//console.log(datos);
		break;
		case "GeorutaColor":
			datos=datosGeorutas[indiceObjeto].color;
		break;
	}
	return datos;
}
function verificarGeoreferenciasSeleccionadas(){
	try{
		for(i=0;i<georeferenciasSel.length;i++){//se verifican los elementos previamente seleccionados
			info=georeferenciasSel[i].split("??");//se separan los datos
			seleccionarGeoreferencia("'"+info[0]+"'",1,"'"+info[1]+"'");//se llama al metodo para seleccionar las georefrencias previamente seleccionadas
			$("#mon_acordeon_GeoreferenciasM").find("#img_"+info[0]).attr("src","./public/images/tick.png")//cambia la imagen del div
		}	
	}catch(err){
		$("#error").show();
	    $("#error_mensaje").html('Ocurrio un error al cargar las georeferencias.');
	}
}
/*
 *@name 	Funcion para seleccionar la unidad
 *@author	Gerardo Lara
 *@date		6 - Mayo - 2014
*/
function seleccionarUnidad(idUnidad,bandera) {    
    try{
	    idUnidad=parseInt(idUnidad);
	    idABorrar = array_selected.indexOf(idUnidad);//se busca el id de la unidad en el array
	    if(idABorrar == -1){//no existe en el array
			array_selected.push(idUnidad);//se agrega el id de la unidad al array llamado array_selected
			//se buscan los elementos concordantes
			$("#mon_acordeon_unidades").find("#img_"+idUnidad).attr("src","./public/images/tick.png")//cambia la imagen del div
	    }else{
			array_selected.splice(idABorrar, 1);//se quita el elemento del array
			$("#mon_acordeon_unidades").find("#img_"+idUnidad).attr("src","./public/images/ok16.png")//cambia la imagen del div
			//se quita la informacion de la tabla de informacion
			idTr="#posicionTr_"+idUnidad;
			mon_remove_map();
			$(idTr).remove();
			
			if (array_selected.length==0) {
		    	stopTimer();
			}
    	}
    }catch(err){
    	$("#error").show();
	    $("#error_mensaje").html('Ha ocurrido un error en la seleccion.');
    }
}
/*
 *@name 	Funcion para seleccionar todas las unidades
 *@author	Gerardo Lara
 *@date		7 - Mayo - 2014
*/
function seleccionarTodas(grupo,bandera){
    $("#"+grupo+" .listadoUnidades").each(function (index) {//se recorren los divs contenidos en cada grupo
		idE=this.id;//id del elemento que se marcara
		srcImg=$("#"+idE+" img").attr("src");//averiguar el src de la imagen de cada elemento
		if(srcImg.substring(16)=="ok16.png" && bandera==0){
		    seleccionarUnidad(parseInt(idE.substring(4)));//se envia a la funcion para cambiar las imagenes y almacenar el valor
		}else if(srcImg.substring(16)=="tick.png" && bandera==1){
		    seleccionarUnidad(parseInt(idE.substring(4)));//se envia a la funcion para cambiar las imagenes y almacenar el valor
		}
    });
    imagenT=$("#imgT_"+grupo.substring(6)).attr("src");//imagen del div del grupo
    if (imagenT.substring(16)=="ok16.png") {
		$("#imgT_"+grupo.substring(6)).attr("src","./public/images/tick.png");//cambia la imagen del div
		$("#"+grupo+" .listadoUnidadesTodas").attr("onclick","seleccionarTodas('"+grupo+"',1)");//cambia la bandera de la funcion
    }else{
		$("#imgT_"+grupo.substring(6)).attr("src","./public/images/ok16.png");//cambia la imagen del div
		$("#"+grupo+" .listadoUnidadesTodas").attr("onclick","seleccionarTodas('"+grupo+"',0)");//cambia la bandera de la funcion
		mon_remove_map();
    }
}
/*Datos necesarios para el infowindow*/
function mon_datosUnidad(stringLoc,dunit,imei,textoMensaje,evt,fecha,direccion,pdi,type){
    var info = '<div class="infoUnidadGlobo">'+
			'<div>Informacion de la Unidad</div>'+
			    '<table width="400" id="tblinfoUnidadGlobo" cellpading="0" cellspacing="0">'+
				'<tr>'+
				    '<td colspan="2">&nbsp;</td>'+
				'<tr>'+
				    '<td align="left" width="125" class="estiloTituloTablaInfoUnidad">Localizado por:</td>'+
				    '<td align="left" width="275">'+stringLoc+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Unidad :</td>'+
				    '<td align="left">'+dunit+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">IMEI :</td>'+
				    '<td align="left">'+imei+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Evento :</td>'+
				    '<td align="left">'+textoMensaje+evt+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Fecha  :</td>'+
				    '<td align="left">'+fecha+'</td>'+
				'</tr>'+								
				'<tr  rowspan="3">'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Direccion:</td>'+
				    '<td align="left">'+direccion+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td>&nbsp;</td>'+
				    '<td align="left">'+pdi+'</td>'+
				'</tr>'+
		  	    '</table>'+
		  	'</div>';
    return info;
}
function datosDireccion(direccionCompleta,tipoLocalizacion,latlng){
	(tipoLocalizacion=="APPROXIMATE") ? tipoLocalizacion="APROXIMADA" : tipoLocalizacion;
	var info = '<div class="infoUnidadGlobo">'+
			'<div>Informacion de la Dirección</div>'+
			    '<table width="400" id="tblinfoUnidadGlobo" cellpading="0" cellspacing="0">'+
				'<tr>'+
				    '<td colspan="2">&nbsp;</td>'+
				'<tr>'+
				    '<td align="left" width="125" class="estiloTituloTablaInfoUnidad">Tipo de Localización::</td>'+
				    '<td align="left" width="275">'+tipoLocalizacion+'</td>'+
				'</tr>'+
				'<tr>'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Dirección :</td>'+
				    '<td align="left">'+direccionCompleta+'</td>'+
				'</tr>'+
				'<tr  rowspan="3">'+
				    '<td align="left" class="estiloTituloTablaInfoUnidad">Latitud/Longitud:</td>'+
				    '<td align="left">'+latlng+'</td>'+
				'</tr>'+
		  	    '</table>'+
		  	'</div>';
    return info;
}
/*Funcion para mostrar los comandos disponibles por Unidad*/
function mon_get_info(valor,imei,idUnidad,servidor,instancia){//envio de comandos
	$("#mon_dialog").dialog("open");
	usuarioId=$("#usuarioId").val();
	clienteId=$("#usuarioCliente").val();
	parametros="action=cargarComandosUnidad&idUsuario="+usuarioId+"&clienteId="+clienteId+"&tipo="+valor+"&imei="+imei+"&idUnidad="+idUnidad+"&servidor="+servidor+"&instancia="+instancia;
	ajaxMonitoreo("cargarComandosUnidad","controlador",parametros,"mon_dialog","mon_dialog","POST");
}
/*Centra la posicion en el mapa y dibuja el infowindow*/
function mon_center_map(idUnidad,stringLoc,unidad,imei,evento,fecha,velocidad,pdi,lat,lon,nivelBateria,direccion,idTr,type){
	try{
		$("#tablaX tr").css("background","#FFF");
		$("#"+idTr).css("background","#CEE3F6");
		direccion=direccion.replace(/\s/g,' ');
	    fecha		= fecha;
	    evt 		= evento;
	    pdi 		= pdi;
	    vel 		= velocidad;
	    lat 		= parseFloat(lat);
	    lon 		= parseFloat(lon);
	    dunit 		= unidad;
	    imei 		= imei;
	    var radioLbs 	= 0;
	    //var textoMensaje = (blockMotor==1) ? 'MOTOR BLOQUEADO -': '';
	    var image = new google.maps.MarkerImage('public/images/car.png',
			new google.maps.Size(1, 1),
			new google.maps.Point(0,0),
			new google.maps.Point(0, 32));
	    var myLatLng 	= new google.maps.LatLng(lat,lon);
	    var beachMarker = new google.maps.Marker({
	        position: myLatLng,
	        map: 	mapaMonitoreo,
	        title: 	dunit,
	        icon:   image,
	    });
	    markers.push(beachMarker);
	    var image 		= '';
	    var colorImage 		= '';
	    var textoMensaje 	= '';
	    var otrosCampos		= '';
	    //var stringLoc		= '';
	    //Se arma la informacion para el infowindow
	    var info=mon_datosUnidad(stringLoc,unidad,imei,"",evento,fecha,direccion,pdi,type);
	    
	    if(infowindow){infoWindow.close();infowindow.setMap(null);}
	    	infowindow = new google.maps.InfoWindow({
			content: info
	    });
	    
	    infowindow.open(mapaMonitoreo,beachMarker);

	    var positon = new google.maps.LatLng(lat, lon);
	    mapaMonitoreo.setZoom(18);
	    mapaMonitoreo.setCenter(positon);	
	    mapaMonitoreo.panTo(positon);
    }catch(err){
		$("#error").show();
		$("#error_mensaje").html('Ocurrio un error al intentar dibujar la Posicion de la unidad seleccionada.\n\n'+err.description);
	}
}
var array_datos=new Array();
var array_posiciones=new Array();
var array_temporal=new Array();
/*
 *@name 	Funcion para evaluar la cadena obtenida de la consulta
 *@param	strUnidadesCompleto
 *@author	Gerardo Lara
 *@date		30 - Agosto - 2014
*/
function evaluarCadenaUnidades(strUnidadesCompleto){
	if(array_posiciones.length != 0){//se separan las unidades con datos de las que no se encontraron datos
		array_posiciones.length=0;//se vacia el array posiciones
	}
	array_datos=strUnidadesCompleto.split("|||||");
	array_temporal=array_datos.slice();//se copia el contenido a array_temporal
	array_posiciones=array_temporal.slice();//se copia a array_posiciones
	array_temporal.length=0;//se vacia array_temporal
	array_datos.length=0;//se vacia array_datos
	dibujarUltimasPosiciones(array_posiciones);//se llama a la funcion para recorrer el array ultimas posiciones
}
/*
 *@name 	Funcion para dibujar evaluar las ultimas posiciones
 *@param	array_posiciones
 *@author	Gerardo Lara
 *@date		30 - Agosto - 2014
*/
function dibujarUltimasPosiciones(array_posiciones){
	if(array_posiciones != ""){//se verifica que array_posiciones no este vacio
		mon_remove_map();
		for(i=0;i<array_posiciones.length;i++){//se recorre el array_posiciones y se extrae la informacion
			var datosUnidad=array_posiciones[i].split(",");//se separan los valores del array
			var id 					= datosUnidad[0];
			var fecha				= datosUnidad[3];
		    var evt 				= datosUnidad[5];
		    var estatus				= datosUnidad[10];
		    var colstus				= datosUnidad[11];
		    var pdi 				= datosUnidad[14];
		    var vel 				= datosUnidad[4];
		    var dire 				= datosUnidad[15];
		    var priory 				= datosUnidad[2];
		    var lat 				= parseFloat(datosUnidad[6]);
		    var lon 				= parseFloat(datosUnidad[7]);
		    var dunit 				= datosUnidad[1];
		    //var icons 			= datosUnidad[12];
		    var angulo 				= datosUnidad[9];
		    var colprio 			= datosUnidad[8];
		    var blockMotor 			= datosUnidad[12];
		    var type    			= datosUnidad[20];
		    var battery  			= datosUnidad[13];
		    var type_loc 			= datosUnidad[19];
		    var distancia			= datosUnidad[16];
		    var radioLbs 			= 0;
		    var image 				= '';
		    var colorImage 			= '';
		    var textoMensaje 		= '';
		    var otrosCampos			= '';
		    var typeLoc  			= '';
		    var stringLoc			= '';
		    var codTypeEquipment	= datosUnidad[21];
		    var comandos			= datosUnidad[22];
		    var imei				= datosUnidad[23];
		    var servidor			= datosUnidad[24];
		    var instancia			= datosUnidad[25];
		    var fondoFila			= "#FFF";
		    //se procesan los datos
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
			        	fondoFila = "orange";
			    	}	
				}else{
			    	image = 'public/images/car_gray.png';	
			    	colorImage = "width:12px;' public/images/circle_gray.png";
			    	textoMensaje = 'MOTOR BLOQUEADO - ';
			    	fondoFila = "gray";
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
						fondoFila = "orange";	
			    	}else if(battery>66){						
			        	image = 'public/images/geo_icons/phone_green.png';
						colorImage = "width=10px;' src='public/images/geo_icons/battery.png";	
			    	}
				}else{
			    	image = 'public/images/geo_icons/phone_red.png';
			    	colorImage = "width=10px;' src='public/images/geo_icons/battery_low.png";	
				}
				otrosCampos= '<tr><td align="left">Nivel de Bateria:</td><td align="left">'	+ battery	+'% </td></tr>';
			}//fin if evaluacion de type

			if(type_loc == 1){//evaluacion type-loc
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
		    }//fin evaluacion type-loc
		    //eventos para el mapa
		    if(lat!=0 && lon !=0){
				marker = new google.maps.Marker({
					map: mapaMonitoreo,
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
					    map: mapaMonitoreo,
					    center: new google.maps.LatLng(lat,lon),
						radius: radioLbs
					};
					var cityCircle = new google.maps.Circle(populationOptions);	
			    	arraygeosP.push(cityCircle);				    	
				};				
		    }
		    google.maps.event.addDomListener(window, 'load');
		    
		    if (comandos=="") {
				comandos="S/C";
			}
			if(dunit=="Sin Datos"){
				var divUnidadGrupo="#div_"+id;
				if ($(divUnidadGrupo).length){
					dunit=$(divUnidadGrupo+" .listadoInfoUnidades").text();
				}
			}
		    mostrarultimasPosiciones(id,dunit,battery,evt,fecha,vel,distancia,dire,image,colorImage,typeLoc,stringLoc,codTypeEquipment,lat,lon,imei,servidor,instancia,fondoFila,type);
		}//fin for array_posiciones
	}//fin if verificacion array_posiciones
	//se vacia el array posiciones
	array_posiciones.length=0;
}
/*
 *@name 	Funcion para pintar las ultimas posiciones en el mapa y en la tabal
 *@author	Gerardo Lara
 *@date		18 - Abril - 2014 - Elaborado
 *@date		 1 - Septiembre - 2014 - Modificado
*/
var clase="even";
/*VARIABLE TEMPORAL CREADA*/
var contador=0;
/*FIN VARIABLE TEMPORAL*/
function mostrarultimasPosiciones(idUnidad,unidad,nivelBateria,evento,fecha,velocidad,pdi,direccion,image,colorImage,typeLoc,stringLoc,comandos,lat,lon,imei,servidor,instancia,fondoFila,type){
    //se recupera si se hara el seguimiento
    seguimiento=$("#seguimiento").val();
    direccion=direccion.replace(/\s/g,' ');
    if (nivelBateria=="Sin Datos") {
		nivelBateria="0 %";	
    }else{
		nivelBateria=nivelBateria+" %";	
    }    
    idTr="posicionTr_"+idUnidad;
    $("#"+idTr).remove();//eliminamos la fila
    
	if($("#"+idTr).length==0){
	    var filaTr="<tr id='"+idTr+"' class='registrosUP' style='background:"+fondoFila+"'>";
	    filaTr+="<td><a href='#' onclick='seleccionarUnidad(\""+idUnidad+"\",0)' title='Quitar unidad del listado'><img src='./public/images/tick.png' border='0' /></a></td>";
	    filaTr+="<td><img src='"+image+"' width='20' height='20' border='0' /></td>";
	    filaTr+="<td><img "+colorImage+"' border='0' /></td>";
	    filaTr+="<td><img "+typeLoc+"'/></td>";
	    filaTr+="<td class='enlaceFuncion'><span title='Enviar Comandos a la unidad' onclick='mon_get_info(\""+comandos+"\",\""+imei+"\",\""+idUnidad+"\",\""+servidor+"\",\""+instancia+"\")'><img src='./public/images/icon-commands.png' border='0' /></span></td>";
	    if(seguimiento=="Y"){
			filaTr+="<td class='enlaceFuncion'><input type='radio' name='rdbSeguimientoUnidad' onclick='dibujaSeguimiento(\""+idUnidad+"\")' /></td>";
	    }else if(seguimiento=="N"){
			filaTr+="<td class='enlaceFuncion'>&nbsp;</td>";
	    }
	    if (evento=="Sin Datos") {
			filaTr+="<td>"+unidad+" C="+contador+"</td>";
	    }else{
			filaTr+="<td><a onclick='mon_center_map(\""+idUnidad+"\",\""+stringLoc+"\",\""+unidad+"\",\""+imei+"\",\""+evento+"\",\""+fecha+"\",\""+velocidad+"\",\""+pdi+"\",\""+lat+"\",\""+lon+"\",\""+nivelBateria+"\",\""+direccion+"\",\""+idTr+"\",\""+type+"\")' title='Ver Ubicacion' class='verUbicacion' style='color:blue;'>"+unidad+" C="+contador+"</a></td>";		
	    }	    
	    filaTr+="<td>"+nivelBateria+"</td>";
	    filaTr+="<td>"+evento+"</td>";
	    filaTr+="<td>"+stringLoc+"</td>";
	    filaTr+="<td>"+fecha+"</td>";
	    filaTr+="<td>"+velocidad+"</td>";
	    filaTr+="<td>"+pdi+"</td>";
	    filaTr+="<td>"+direccion+"</td>";
	    filaTr+="<td>"+parseFloat(lat)+","+parseFloat(lon)+"</td></tr>";
	    $("#tablaX").append(filaTr);
	    contador+=1;
	}
}

function dibujaSeguimiento(idUnidad){
	unidadSeleccionada=idUnidad;
	banderaSeguimiento=true;//se cambia el valor de la bandera para que actualice con las posiciones
	usuarioId=$("#usuarioId").val();
	clienteId=$("#usuarioCliente").val();
	//se envia la peticion para el pintado de los mapas
	parametros="action=pintarUbicaciones&idUnidad="+idUnidad+"&idUsuario="+usuarioId+"&clienteId="+clienteId;
	ajaxMonitoreo("pintarUbicaciones","controlador",parametros,"cargador2","mon_content","POST");
}

function mon_send_command(){
	var imei    = $("#mon_cmds_imei").val();
	var command = $("#mon_sel_cmds").val();
	var comment = $("#mon_cmds_com").val();
	var unit   = $("#mon_cmds_unit").val();
	var servidor = $("#mon_cmds_servidor").val();
	var instancia = $("#mon_cmds_instancia").val();
	usuarioId=$("#usuarioId").val();
	clienteId=$("#usuarioCliente").val();
	if(imei!="" && command!="" && comment!=""){//proceso de peticion ajax
		parametros="action=enviarComando&imei="+imei+"&command="+command+"&comment="+comment+"&idUnidad="+unit+"&servidor="+servidor+"&instancia="+instancia+"&usuarioId="+usuarioId+"&clienteId="+clienteId;
		ajaxMonitoreo("enviarComando","controlador",parametros,"mon_dialog","mon_dialog","POST");
	}else{
      $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un comando y agregar un comentario.</p>');
      $("#dialog_message" ).dialog('open');  				
	}
	
}
function evaluaComandoEnviado(result){
	if(result=='no-data' || result=='problem'){
      	$('#dialog_message').html("<div class='ui-state-error ui-corner-all' style='padding:0.7em;'><p><span class='ui-icon ui-icon-alert' style='float:left;margin-right:.3em;'></span>El comando no pudo ser enviado.</p></div>");
      	$("#dialog_message" ).dialog('open');             	          
      	$("#mon_dialog").dialog("close");
  	}else if(result=='send'){ 
      	$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Comando enviado correctamente.</p>');
      	$("#dialog_message").dialog('open');
      	$("#mon_dialog").dialog("close");
      	setTimeout(cargarUltimasPosiciones(),5000);//se manda a actualizar la informacion de las unidades
  	}else if(result=='no-perm'){
		$('#dialog_message').html("<div class='ui-state-highlight ui-corner-all' style='margin-top:20px;padding:0.7em;'><p><span class='ui-icon ui-icon-info' style='float:left;margin-right:.3em;'></span>No tiene permiso para realizar esta acción. <br> Consulte a su administrador.</p></div>");
      	$("#dialog_message" ).dialog('open');
      	$("#mon_dialog").dialog("close");       
  	}else if(result=='pending'){
      	$('#dialog_message').html("<div class='ui-state-error ui-corner-all' style='padding:0.7em;'><p><span class='ui-icon ui-icon-alert' style='float:left;margin-right:.3em;'></span>No se puede enviar este comando, ya que existe uno pendiente por enviar.</p></div>");
      	$("#dialog_message" ).dialog('open');       
      	$("#mon_dialog").dialog("close");
  	}
}

function verificaDatos(){
	var puntoA = document.getElementById("puntoDePartida").value;
	var puntoB = document.getElementById("destinoRuta").value;
	if(puntoA=="" || puntoB==""){
		$("#dialog_message").html("Verifique que el punto de Origen(A) y destino(B) no esten vacios.");
		$("#dialog_message").dialog("open");
	}else{
		calcularRuta(puntoA,puntoB);	
	}
}

