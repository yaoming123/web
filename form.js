document.addEventListener('DOMContentLoaded', function () {
    const whatsappButton = document.getElementById('whatsapp-button');
    const messengerButton = document.getElementById('messenger-button');

    const getFormData = () => {
        const section = document.getElementById('section').value;
        const name = document.getElementById('name').value;
        const cellphone = document.getElementById('cellphone').value;
        const phone = document.getElementById('phone').value || 'No especificado';
        const address = document.getElementById('address').value || 'No especificado';
        const mapLink = document.getElementById('mapLink').value || 'No especificado';
        const payment = document.getElementById('payment').value || 'No especificado';
        const details = document.getElementById('details').value || 'No especificado';

        return `
            Hola, me interesa publicar en cerrajero.net.ar:
            
            - Link de Sección: ${section}
            - Nombre del Negocio: ${name}
            - Número de Celular: ${cellphone}
            - Número de Teléfono Fijo: ${phone}
            - Dirección: ${address}
            - Link de Google Maps: ${mapLink}
            - Medios de Pago: ${payment}
            - Detalles Adicionales: ${details}
        `;
    };

    whatsappButton.addEventListener('click', function () {
        const message = getFormData();
        const whatsappNumber = "5491122413762"; // Número de WhatsApp del administrador
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    });

    messengerButton.addEventListener('click', function () {
        const message = getFormData();
        const messengerLink = `https://m.me/cerrajero.net.ar?text=${encodeURIComponent(message)}`;
        window.open(messengerLink, '_blank');
    });
});
