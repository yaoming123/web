function trackDynamicWhatsAppClick(button) {
    // Captura los datos del botón y del entorno
    const servicio = button.getAttribute('data-servicio') || 'Sin servicio';
    const seccion = button.closest ? (button.closest('.scroll-section')?.id || 'Desconocido') : 'Desconocido';
    const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
    const hora = new Date().toISOString(); // Hora en formato UTC
    const accion = button.textContent.trim() || 'Desconocido';
    const urlReferencia = document.referrer || 'Directo';
    const urlActual = window.location.href;
    const idioma = navigator.language || navigator.userLanguage || 'Desconocido';
    const scrollDepth = Math.round((window.scrollY / document.body.scrollHeight) * 100) + '%';
    const tiempoEnPagina = Math.floor((Date.now() - (performance?.timing?.navigationStart || Date.now())) / 1000);
    window.numClicsWhatsApp = (window.numClicsWhatsApp || 0) + 1;

    // Determinar si el usuario es nuevo o recurrente
    let tipoUsuario = 'Nuevo';
    if (localStorage.getItem('visitado')) {
        tipoUsuario = 'Recurrente';
    } else {
        localStorage.setItem('visitado', 'true');
    }

    // Detectar tipo de conexión
    const conexion = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';

    // Asegurarse de que la capa de datos esté disponible
    window.dataLayer = window.dataLayer || [];

    // Enviar los datos al dataLayer
    window.dataLayer.push({
        event: "click_whatsapp", // Evento principal
        servicio: servicio,
        contacto: "WhatsApp", // Etiqueta fija
        seccion: seccion,
        dispositivo: dispositivo,
        hora: hora, // Formato UTC
        accion: accion,
        url_referencia: urlReferencia,
        url_actual: urlActual,
        idioma: idioma,
        scroll_depth: scrollDepth,
        tiempo_en_pagina: tiempoEnPagina, // Tiempo en segundos
        clics_totales: window.numClicsWhatsApp, // Total de clics en esta sesión
        tipo_usuario: tipoUsuario, // Nuevo o Recurrente
        conexion: conexion // Tipo de conexión
    });

}
