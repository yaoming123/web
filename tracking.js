function trackDynamicWhatsAppClick(button) {
    if (!button) {
        console.error('El botón proporcionado es nulo o inválido.');
        return;
    }

    // Capturar la hora local en el momento del clic
    const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const hora = new Date().toISOString(); // Hora en formato UTC

    // Captura los demás datos del botón y del entorno
    const servicio = button.getAttribute('data-servicio') || 'Sin servicio';
    const seccion = button.closest ? (button.closest('.scroll-section')?.id || 'Desconocido') : 'Desconocido';
    const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
    const accion = button.textContent.trim() || 'Desconocido';
    const urlReferencia = document.referrer || 'Directo';
    const urlActual = window.location.href;
    const idioma = navigator.language || navigator.userLanguage || 'Desconocido';
    const scrollDepth = document.body.scrollHeight > 0
        ? Math.round((window.scrollY / document.body.scrollHeight) * 100) + '%'
        : '0%';
    const tiempoEnPagina = performance?.timing?.navigationStart
        ? Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
        : 0;

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

    // Datos del evento
    const datosEvento = {
        event: "click_whatsapp",
        servicio: servicio,
        contacto: "WhatsApp",
        seccion: seccion,
        dispositivo: dispositivo,
        hora: hora, // Hora en UTC
        hora_local: horaLocal, // Hora local capturada en el clic
        accion: accion,
        url_referencia: urlReferencia,
        url_actual: urlActual,
        idioma: idioma,
        scroll_depth: scrollDepth,
        tiempo_en_pagina: tiempoEnPagina,
        clics_totales: window.numClicsWhatsApp,
        tipo_usuario: tipoUsuario,
        conexion: conexion
    };

    // Asegurarse de que la capa de datos esté disponible
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(datosEvento);

    // Depuración en consola (solo en desarrollo)
    if (window.location.hostname === 'localhost') {
        console.log('Datos enviados al dataLayer:', datosEvento);
    }
}
