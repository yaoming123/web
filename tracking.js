// Inicializar data layer
window.dataLayer = window.dataLayer || [];

// ========== FUNCIÓN BASE DE TRACKING ==========
function getCommonTrackingData(element, eventName, category, action, label) {
    const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const hora = new Date().toISOString();

    const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
    const urlReferencia = document.referrer || 'Directo';
    const urlActual = window.location.href;
    const idioma = navigator.language || navigator.userLanguage || 'Desconocido';

    const scrollDepth = document.documentElement.scrollHeight > 0
        ? Math.round(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100) + '%'
        : '0%';

    const inicioPagina = window.performance?.timeOrigin || Date.now();
    const tiempoEnPagina = Math.floor((Date.now() - inicioPagina) / 1000);

    let tipoUsuario = 'Nuevo';
    if (localStorage.getItem('visitado')) {
        tipoUsuario = 'Recurrente';
    } else {
        localStorage.setItem('visitado', new Date().toISOString());
    }

    const conexion = navigator.connection?.effectiveType || 'No disponible';

    return {
        event: eventName,
        categoria: category || 'General',
        accion: action || (element?.textContent.trim().substring(0, 60) || 'Desconocido'),
        etiqueta: label || element?.getAttribute?.('aria-label') || 'Sin etiqueta',

        // Datos comunes
        dispositivo,
        hora,
        hora_local: horaLocal,
        url_referencia: urlReferencia,
        url_actual: urlActual,
        idioma,
        scroll_depth: scrollDepth,
        tiempo_en_pagina: tiempoEnPagina,
        tipo_usuario: tipoUsuario,
        conexion
    };
}

// ========== TRACKING ESPECÍFICO ==========

// WhatsApp
function trackDynamicWhatsAppClick(button) {
    if (!button) return;

    window.numClicsWhatsApp = (window.numClicsWhatsApp || 0) + 1;

    const data = getCommonTrackingData(
        button,
        "click_whatsapp",
        "WhatsApp",
        button.textContent.trim(),
        "Botón WhatsApp"
    );

    data.servicio = button.getAttribute('data-servicio') || 'Sin servicio';
    data.contacto = "WhatsApp";
    data.clics_totales = window.numClicsWhatsApp;

    window.dataLayer.push(data);
}

// Genérico
function trackEvent(element, eventName = 'click_evento', category = 'General', action = null, label = null) {
    const data = getCommonTrackingData(element, eventName, category, action, label);
    window.dataLayer.push(data);
}

// Tel: (Click para llamar)
function setupPhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();

            const numeroTelefono = this.href.replace('tel:', '');

            const data = getCommonTrackingData(this, "phone_click", "contacto", "click_tel", "Botón Teléfono");
            data.numero_telefono = numeroTelefono;

            window.dataLayer.push(data);

            setTimeout(() => {
                window.location.href = element.href;
            }, 300);
        });
    });
}

// ========== EVENTOS AL CARGAR ==========

// Modificar enlaces de publicidad con "from"
document.addEventListener('DOMContentLoaded', function () {
    const currentURL = window.location.href;
    document.querySelectorAll('a[href*="publicidad.html"]').forEach(link => {
        const url = new URL(link.href, currentURL);
        if (!url.searchParams.has('from')) {
            url.searchParams.set('from', currentURL);
            link.href = url.toString();
        }
    });

    // Activar phone tracking
    setupPhoneTracking();

});
