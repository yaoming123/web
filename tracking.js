document.addEventListener('DOMContentLoaded', function () {
    // Captura la URL actual
    const currentURL = window.location.href;

    // Encuentra todos los enlaces a publicidad.html
    const publicidadLinks = document.querySelectorAll('a[href*="publicidad.html"]');

    // Modifica cada enlace para incluir el parámetro "from"
    publicidadLinks.forEach(link => {
        const url = new URL(link.href, currentURL); // Crea la URL completa
        if (!url.searchParams.has('from')) { // Evita duplicados
            url.searchParams.set('from', currentURL); // Añade el parámetro "from"
            link.href = url.toString(); // Actualiza el enlace
        }
    });
});


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

}

// Función para rastrear eventos
function trackEvent(event, category, action, label) {
    window.dataLayer.push({
        event: event,
        category: category,
        action: action,
        label: label,
        timestamp: new Date().toISOString()
    });
}

// Rastrear clics en "Haz Click Para Llamar"
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();

            // Capturar el número de teléfono desde el href
            const numeroTelefono = this.href.replace('tel:', ''); // Quitar "tel:"

            // Capturar parámetros adicionales
            const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
            const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
            const idioma = navigator.language || navigator.userLanguage || 'Desconocido';
            const scrollDepth = document.body.scrollHeight > 0
                ? Math.round((window.scrollY / document.body.scrollHeight) * 100) + '%'
                : '0%';
            const tiempoEnPagina = performance?.timing?.navigationStart
                ? Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
                : 0;
            const tipoUsuario = localStorage.getItem('visitado') ? 'Recurrente' : 'Nuevo';
            if (tipoUsuario === 'Nuevo') {
                localStorage.setItem('visitado', 'true');
            }
            const conexion = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';

            // Enviar evento al dataLayer
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'phone_click',
                'event_category': 'contact',
                'event_label': this.href,
                'numero_telefono': numeroTelefono, // Nuevo parámetro
                'dispositivo': dispositivo,
                'hora_local': horaLocal,
                'idioma': idioma,
                'scroll_depth': scrollDepth,
                'tiempo_en_pagina': tiempoEnPagina,
                'tipo_usuario': tipoUsuario,
                'conexion': conexion
            });

            // Redirigir al enlace después de 300 ms
            setTimeout(function() {
                window.location.href = element.href;
            }, 300);
        });
    });
});





// Rastrear clics en elementos del menú
document.querySelectorAll('nav a').forEach(function(element) {
    element.addEventListener('click', function() {
        trackEvent('click', 'navigation', 'menu_click', this.textContent.trim());
    });
});

// Rastrear clic en "Publicite Aquí"
document.querySelectorAll('a.back-button').forEach(function(element) {
    element.addEventListener('click', function() {
        trackEvent('click', 'advertising', 'advertise_here_click', this.href);
    });
});


