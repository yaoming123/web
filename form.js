document.addEventListener('DOMContentLoaded', function () {
    // Capturar los botones
    const whatsappButton = document.getElementById('whatsapp-button');
    const messengerButton = document.getElementById('messenger-button');

    // Función para generar el mensaje dinámico
    function generateMessage() {
        const section = document.getElementById('section').value;
        const name = document.getElementById('name').value;
        const cellphone = document.getElementById('cellphone').value;
        const phone = document.getElementById('phone').value || 'No especificado';
        const address = document.getElementById('address').value || 'No especificada';
        const mapLink = document.getElementById('mapLink').value || 'No especificado';
        const payment = document.getElementById('payment').value || 'No especificados';
        const details = document.getElementById('details').value || 'Sin detalles adicionales';

        // Validar que los campos requeridos estén llenos
        if (!section || !name || !cellphone) {
            alert('Por favor completa todos los campos requeridos (Sección, Nombre del Negocio y Celular).');
            return null; // Salir si faltan datos requeridos
        }

        // Generar el mensaje
        return `
        Hola, he leído y aceptado los términos y condiciones. Me interesa publicitar en cerrajero.net.ar:
        
        - Enlace de la sección: ${section}
        - Nombre del negocio: ${name}
        - Número de celular: ${cellphone}
        - Número de teléfono fijo: ${phone}
        - Dirección: ${address}
        - Enlace de Google Maps: ${mapLink}
        - Medios de pago: ${payment}
        - Detalles adicionales: ${details}.
    `;
    
    }

    // Función para rastrear clics en WhatsApp
    function trackClick(button, contacto) {
        const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
        const hora = new Date().toISOString();
        const seccion = "Formulario Publicitar"; // Especificar la sección actual
        const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
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

        let tipoUsuario = 'Nuevo';
        if (localStorage.getItem('visitado')) {
            tipoUsuario = 'Recurrente';
        } else {
            localStorage.setItem('visitado', 'true');
        }

        const conexion = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';

        const datosEvento = {
            event: contacto === 'WhatsApp' ? 'click_whatsapp' : 'click_messenger',
            contacto: contacto,
            seccion: seccion,
            dispositivo: dispositivo,
            hora: hora,
            hora_local: horaLocal,
            url_referencia: urlReferencia,
            url_actual: urlActual,
            idioma: idioma,
            scroll_depth: scrollDepth,
            tiempo_en_pagina: tiempoEnPagina,
            clics_totales: window.numClicsWhatsApp,
            tipo_usuario: tipoUsuario,
            conexion: conexion
        };

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(datosEvento);
    }

    // Evento para WhatsApp
    whatsappButton.addEventListener('click', function () {
        const message = generateMessage();
        if (message) {
            const whatsappLink = `https://wa.me/+5491122413762?text=${encodeURIComponent(message)}`;
            trackClick(whatsappButton, 'WhatsApp');
            window.open(whatsappLink, '_blank');
        }
    });

    // Evento para Messenger
    messengerButton.addEventListener('click', function () {
        const message = generateMessage();
        if (message) {
            const messengerLink = `https://www.messenger.com/t/cerrajero.net.ar?text=${encodeURIComponent(message)}`;
            trackClick(messengerButton, 'Messenger');
            window.open(messengerLink, '_blank');
        }
    });
});



// document.addEventListener('DOMContentLoaded', function () {
//     // Capturar los botones
//     const whatsappButton = document.getElementById('whatsapp-button');
//     const messengerButton = document.getElementById('messenger-button');

//     // Función para generar el mensaje dinámico
//     function generateMessage() {
//         const section = document.getElementById('section').value;
//         const name = document.getElementById('name').value;
//         const cellphone = document.getElementById('cellphone').value;
//         const phone = document.getElementById('phone').value || 'No especificado';
//         const address = document.getElementById('address').value || 'No especificada';
//         const mapLink = document.getElementById('mapLink').value || 'No especificado';
//         const payment = document.getElementById('payment').value || 'No especificados';
//         const details = document.getElementById('details').value || 'Sin detalles adicionales';

//         // Validar que los campos requeridos estén llenos
//         if (!section || !name || !cellphone) {
//             alert('Por favor completa todos los campos requeridos (Sección, Nombre del Negocio y Celular).');
//             return null; // Salir si faltan datos requeridos
//         }

//         // Generar el mensaje
//         return `
//             Hola, me interesa publicar en cerrajero.net.ar:

//             - Link de Sección: ${section}
//             - Nombre del Negocio: ${name}
//             - Número de Celular: ${cellphone}
//             - Número de Teléfono Fijo: ${phone}
//             - Dirección: ${address}
//             - Link de Google Maps: ${mapLink}
//             - Medios de Pago: ${payment}
//             - Detalles Adicionales: ${details}
//         `;
//     }

//     // Evento para WhatsApp
//     whatsappButton.addEventListener('click', function () {
//         const message = generateMessage();
//         if (message) {
//             const cellphone = document.getElementById('cellphone').value;
//             const whatsappLink = `https://wa.me/${cellphone}?text=${encodeURIComponent(message)}`;
//             window.open(whatsappLink, '_blank'); // Abrir enlace de WhatsApp
//             dataLayer.push({ event: 'click_whatsapp', form_submitted: true, message: message }); // Registrar en dataLayer
//         }
//     });

//     // Evento para Messenger
//     messengerButton.addEventListener('click', function () {
//         const message = generateMessage();
//         if (message) {
//             const messengerLink = `https://www.messenger.com/t/cerrajero.net.ar?text=${encodeURIComponent(message)}`;
//             window.open(messengerLink, '_blank'); // Abrir enlace de Messenger
//             dataLayer.push({ event: 'click_messenger', form_submitted: true, message: message }); // Registrar en dataLayer
//         }
//     });
// });
