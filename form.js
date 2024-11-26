document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('whatsapp-form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío estándar del formulario

        // Captura los datos del formulario
        const section = document.getElementById('section').value;
        const name = document.getElementById('name').value;
        const cellphone = document.getElementById('cellphone').value;
        const phone = document.getElementById('phone').value || 'No especificado';
        const address = document.getElementById('address').value || 'No especificado';
        const mapLink = document.getElementById('mapLink').value || 'No especificado';
        const payment = document.getElementById('payment').value || 'No especificado';

        // Formatea el mensaje
        const whatsappMessage = `
            Hola, me interesa publicar en cerrajero.net.ar:
            
            - Link de Sección: ${section}
            - Nombre del Negocio: ${name}
            - Número de Celular: ${cellphone}
            - Número de Teléfono Fijo: ${phone}
            - Dirección: ${address}
            - Link de Google Maps: ${mapLink}
            - Medios de Pago: ${payment}
        `;

        // Configura el enlace de WhatsApp
        const whatsappNumber = "5491122413762"; // Reemplazar con el número de WhatsApp del administrador
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Abre el enlace
        window.open(whatsappLink, '_blank');
    });
});

