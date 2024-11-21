function trackDynamicWhatsAppClick(button) {
    const servicio = button.getAttribute('data-servicio');
    const seccion = button.closest('.scroll-section')?.id || 'Desconocido';
    const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
    const hora = new Date().toISOString();
    const accion = button.textContent.trim() || 'Desconocido';
    const urlReferencia = document.referrer || 'Directo';
    const urlActual = window.location.href;
    const idioma = navigator.language || 'Desconocido';
    const scrollDepth = Math.round((window.scrollY / document.body.scrollHeight) * 100) + '%';
    const tiempoEnPagina = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
    window.numClicsWhatsApp = (window.numClicsWhatsApp || 0) + 1;
    let tipoUsuario = 'Nuevo';
    if (localStorage.getItem('visitado')) {
        tipoUsuario = 'Recurrente';
    } else {
        localStorage.setItem('visitado', 'true');
    }
    const conexion = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "click_whatsapp",
        servicio: servicio,
        contacto: "WhatsApp",
        seccion: seccion,
        dispositivo: dispositivo,
        hora: hora,
        accion: accion,
        url_referencia: urlReferencia,
        url_actual: urlActual,
        idioma: idioma,
        scroll_depth: scrollDepth,
        tiempo_en_pagina: tiempoEnPagina,
        clics_totales: window.numClicsWhatsApp,
        tipo_usuario: tipoUsuario,
        conexion: conexion
    });
}