
document.addEventListener('DOMContentLoaded', function () {
    // Capturar el botón de WhatsApp
    const whatsappButton = document.getElementById('whatsapp-button');
    const messengerButton = document.getElementById('messenger-button');

    // Capturar los valores del formulario
    whatsappButton.addEventListener('click', function () {
        const section = document.getElementById('section').value;
        const name = document.getElementById('name').value;
        const cellphone = document.getElementById('cellphone').value;

        // Validar que los campos requeridos estén llenos
        if (!section || !name || !cellphone) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        // Crear el enlace de WhatsApp
        const whatsappLink = `https://wa.me/${cellphone}?text=Hola,%20quiero%20publicitar%20en%20la%20sección:%20${encodeURIComponent(section)}%20para%20mi%20negocio:%20${encodeURIComponent(name)}.`;

        // Redirigir al enlace
        window.open(whatsappLink, '_blank');

        // Registrar el evento en el dataLayer
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            event: 'click_whatsapp',
            form_submitted: true,
            section: section,
            name: name,
            cellphone: cellphone
        });
    });

    // Manejo del botón de Messenger (ejemplo similar al de WhatsApp)
    messengerButton.addEventListener('click', function () {
        const section = document.getElementById('section').value;
        const name = document.getElementById('name').value;

        // Validar campos
        if (!section || !name) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        const messengerLink = `https://www.messenger.com/t/cerrajero.net.ar?text=Quiero%20publicitar%20en%20la%20sección:%20${encodeURIComponent(section)}%20para%20mi%20negocio:%20${encodeURIComponent(name)}.`;

        window.open(messengerLink, '_blank');

        dataLayer.push({
            event: 'click_messenger',
            form_submitted: true,
            section: section,
            name: name
        });
    });
});
