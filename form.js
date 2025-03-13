document.addEventListener('DOMContentLoaded', function () {
    // Capturar los botones
    const whatsappButton = document.getElementById('whatsapp-button');
    const messengerButton = document.getElementById('messenger-button');

    function generateMessage() {
        let section, name, cellphone, phone, address, mapLink, payment, details, mensaje;
    
        if (document.getElementById('formulario-clientes') !== null) { 
            // Datos para clientes
            section = document.getElementById('section').value;
            details = document.getElementById('details').value || 'Sin detalles adicionales';
    
            // Mensaje para clientes
            mensaje = `
            Hola, vengo desde: ${section} y quiero consultar sobre:
            Detalles: ${details}.
            `;
        } 
        else if (document.getElementById('formulario-publicidad') !== null) {
            // Datos para publicidad
            section = document.getElementById('section').value;
            name = document.getElementById('name').value;
            cellphone = document.getElementById('cellphone').value;
            phone = document.getElementById('phone').value || 'No especificado';
            address = document.getElementById('address').value || 'No especificada';
            mapLink = document.getElementById('mapLink').value || 'No especificado';
            payment = document.getElementById('payment').value || 'No especificados';
            details = document.getElementById('details').value || 'Sin detalles adicionales';
    
            // Mensaje para publicidad
            mensaje = `
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
        } else {
            alert('No se ha detectado un formulario válido.');
            return null;
        }
    
        // Validar que los campos requeridos estén llenos
        if (!section || !name || !cellphone) {
            alert('Por favor completa todos los campos requeridos (Sección, Nombre del Negocio y Celular).');
            return null;
        }
    
        return mensaje; // Devuelve el mensaje según el formulario
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
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function () {
            const message = generateMessage();
            if (message) {
                const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
                trackClick(whatsappButton, 'WhatsApp');
                window.open(whatsappLink, '_blank');
            }
        });
    }
    if (messengerButton) {
        // Evento para Messenger
        messengerButton.addEventListener('click', function () {
            const message = generateMessage();
            if (message) {
                const messengerLink = `https://www.messenger.com/t/cerrajero.net.ar?text=${encodeURIComponent(message)}`;
                trackClick(messengerButton, 'Messenger');
                window.open(messengerLink, '_blank');
            }
        });
    }
});