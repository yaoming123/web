function mostrarHora() {
  const opciones = { 
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false
  };

  const horaLocal = new Date().toLocaleString('es-AR', opciones);
  const relojElement = document.getElementById('reloj');
  if (relojElement) {
    relojElement.textContent = horaLocal;
  }
}

setInterval(mostrarHora, 1000);
mostrarHora();

// Inicializar data layer - IMPORTANTE: esto debe estar antes de GTM
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
    
    // Debug en consola
    console.log('WhatsApp tracking enviado:', data);
}

// Genérico
function trackEvent(element, eventName = 'click_evento', category = 'General', action = null, label = null) {
    const data = getCommonTrackingData(element, eventName, category, action, label);
    window.dataLayer.push(data);
    console.log('Evento genérico enviado:', data);
}

// Tel: (Click para llamar) - VERSIÓN CORREGIDA
function setupPhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (element) {
        element.addEventListener('click', function (event) {
            // NO prevenir el comportamiento por defecto inmediatamente
            const numeroTelefono = this.href.replace('tel:', '');
            const enlace = this.href;

            const data = getCommonTrackingData(
                this, 
                "phone_click", 
                "Contacto", 
                "Click Teléfono", 
                "Botón Teléfono"
            );
            data.numero_telefono = numeroTelefono;

            // Enviar a dataLayer
            window.dataLayer.push(data);
            
            // Debug en consola
            console.log('Phone click tracking enviado:', data);

            // Si el navegador soporta sendBeacon (más confiable)
            if (navigator.sendBeacon && typeof gtag !== 'undefined') {
                // Permitir que el enlace funcione normalmente
                return true;
            } else {
                // Solo prevenir si necesitamos el timeout
                event.preventDefault();
                
                // Esperar un poco más tiempo para asegurar que se envíe
                setTimeout(() => {
                    window.location.href = enlace;
                }, 500);
            }
        });
    });
    
    console.log('Phone tracking configurado para', document.querySelectorAll('a[href^="tel:"]').length, 'enlaces');
}

// ========== EVENTOS AL CARGAR ==========

document.addEventListener('DOMContentLoaded', function () {
    console.log('Tracking.js cargado - DOMContentLoaded');
    
    const currentURL = window.location.href;
    
    // Modificar enlaces de publicidad con "from"
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

// Verificar que GTM esté cargado
window.addEventListener('load', function() {
    if (typeof dataLayer !== 'undefined') {
        console.log('DataLayer disponible:', window.dataLayer.length, 'eventos');
    } else {
        console.error('DataLayer NO está disponible - verificar instalación de GTM');
    }
});
