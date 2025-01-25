// Inicializar data layer
window.dataLayer = window.dataLayer || [];

// Cuando el DOM ha cargado completamente
document.addEventListener('DOMContentLoaded', function () {
    // Captura la URL actual
    const currentURL = window.location.href;

    // Encuentra todos los enlaces que contienen "publicidad.html"
    const publicidadLinks = document.querySelectorAll('a[href*="publicidad.html"]');

    // Modifica cada enlace para incluir el parámetro "from" con la URL actual
    publicidadLinks.forEach(link => {
        const url = new URL(link.href, currentURL); // Crea la URL completa
        if (!url.searchParams.has('from')) { // Evita añadir el parámetro si ya existe
            url.searchParams.set('from', currentURL); // Agrega el parámetro "from"
            link.href = url.toString(); // Actualiza el enlace con la nueva URL
        }
    });
});

// Función para rastrear clics en botones de WhatsApp dinámicos
function trackDynamicWhatsAppClick(button) {
    if (!button) {
        console.error('El botón proporcionado es nulo o inválido.');
        return;
    }

    // Captura la hora local en Argentina y la hora en formato UTC
    const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const hora = new Date().toISOString(); 

    // Obtiene atributos del botón o asigna valores predeterminados
    const servicio = button.getAttribute('data-servicio') || 'Sin servicio';
    const seccion = button.closest ? (button.closest('.scroll-section')?.id || 'Desconocido') : 'Desconocido';
    const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
    const accion = button.textContent.trim() || 'Desconocido';
    const urlReferencia = document.referrer || 'Directo';  // De dónde viene el usuario
    const urlActual = window.location.href;  // Página actual
    const idioma = navigator.language || navigator.userLanguage || 'Desconocido';

    // Calcula la profundidad de desplazamiento en la página
    const scrollDepth = document.body.scrollHeight > 0
        ? Math.round((window.scrollY / document.body.scrollHeight) * 100) + '%'
        : '0%';

    // Calcula el tiempo transcurrido en la página
    const tiempoEnPagina = performance?.timing?.navigationStart
        ? Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
        : 0;

    // Contador de clics en botones de WhatsApp
    window.numClicsWhatsApp = (window.numClicsWhatsApp || 0) + 1;

    // Determinar si el usuario es nuevo o recurrente mediante localStorage
    let tipoUsuario = 'Nuevo';
    if (localStorage.getItem('visitado')) {
        tipoUsuario = 'Recurrente';
    } else {
        localStorage.setItem('visitado', 'true');
    }

    // Detecta el tipo de conexión de red del usuario (4G, 3G, etc.)
    const conexion = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';

    // Crea el objeto con los datos del evento
    const datosEvento = {
        event: "click_whatsapp",
        servicio: servicio,
        contacto: "WhatsApp",
        seccion: seccion,
        dispositivo: dispositivo,
        hora: hora,  // Hora UTC
        hora_local: horaLocal,  // Hora local
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

    // Enviar los datos a la capa de datos de Google Tag Manager
    window.dataLayer.push(datosEvento);
}

// Función genérica para rastrear eventos personalizados
function trackEvent(event, category, action, label) {
    window.dataLayer.push({
        event: event,
        category: category,
        action: action,
        label: label,
        timestamp: new Date().toISOString()  // Registrar la fecha y hora del evento
    });
}

// Rastrear clics en enlaces "Haz Click Para Llamar" (tel:)
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar la acción por defecto para rastreo primero

            // Obtener el número de teléfono del enlace
            const numeroTelefono = this.href.replace('tel:', '');

            // Capturar detalles del dispositivo, idioma y otros parámetros
            const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
            const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
            const idioma = navigator.language || navigator.userLanguage || 'Desconocido';
            const scrollDepth = document.body.scrollHeight > 0
                ? Math.round((window.scrollY / document.body.scrollHeight) * 100) + '%'
                : '0%';
            const tiempoEnPagina = performance?.timing?.navigationStart
                ? Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
                : 0;

            // Determinar si el usuario es nuevo o recurrente
            const tipoUsuario = localStorage.getItem('visitado') ? 'Recurrente' : 'Nuevo';
            if (tipoUsuario === 'Nuevo') {
                localStorage.setItem('visitado', 'true');
            }

            const conexion = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';

            // Enviar evento al dataLayer
            
            window.dataLayer.push({
                'event': 'phone_click',
                'event_category': 'contact',
                'event_label': this.href,
                'numero_telefono': numeroTelefono,
                'dispositivo': dispositivo,
                'hora_local': horaLocal,
                'idioma': idioma,
                'scroll_depth': scrollDepth,
                'tiempo_en_pagina': tiempoEnPagina,
                'tipo_usuario': tipoUsuario,
                'conexion': conexion
            });

            // Redirigir al número de teléfono después de un pequeño retraso para permitir el tracking
            setTimeout(function() {
                window.location.href = element.href;
            }, 300);
        });
    });
});

// Rastrear clics en elementos del menú de navegación
document.querySelectorAll('nav a').forEach(function(element) {
    element.addEventListener('click', function() {
        trackEvent('click', 'navigation', 'menu_click', this.textContent.trim());
    });
});

// Rastrear clics en el botón "Publicite Aquí"
document.querySelectorAll('a.back-button').forEach(function(element) {
    element.addEventListener('click', function() {
        trackEvent('click', 'advertising', 'advertise_here_click', this.href);
    });
});

// Determinar si el usuario es nuevo o recurrente
function getUserType() {
    if (localStorage.getItem('visitado')) {
        return 'Recurrente';
    } else {
        localStorage.setItem('visitado', 'true');
        return 'Nuevo';
    }
}