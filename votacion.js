if (!window.dataLayer) {
    window.dataLayer = [];
}

document.addEventListener('DOMContentLoaded', function () {
    const visitedKey = 'votacion_mostrada'; // Clave genérica para controlar la aparición
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    const now = new Date().getTime();

    // Verificar si ya se mostró en las últimas 24 horas
    const lastShown = localStorage.getItem(visitedKey);
    if (lastShown && (now - lastShown < oneDayInMillis)) {
        console.log('La votación ya se mostró en las últimas 24 horas.');
        return; // No mostrar el div
    }

    // Crear dinámicamente el div
    const votacionDiv = document.createElement('div');
    votacionDiv.id = 'rating-section';
    votacionDiv.innerHTML = `
        <button id="close-rating" title="Cerrar" style="width: 2rem; height: 2rem;">✖</button>
        <p>¿Podrías evaluar el sitio?</p>
        <p>Haz clic en las estrellas, considerando</p>
        <p>| Diseño | Usabilidad | Rendimiento |</p>
        <ul>
            <li class="star" data-value="1">⭐</li>
            <li class="star" data-value="2">⭐</li>
            <li class="star" data-value="3">⭐</li>
            <li class="star" data-value="4">⭐</li>
            <li class="star" data-value="5">⭐</li>
        </ul>
        <button id="submit-rating" style="width: -webkit-fill-available;" disabled>Finalizar Votación</button>
    `;

    document.body.appendChild(votacionDiv);

    // Actualiza el timestamp en localStorage al mostrar el div
    localStorage.setItem(visitedKey, now.toString());

    let selectedRating = null;

    // Agregar eventos a las estrellas
    votacionDiv.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function () {
            votacionDiv.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedRating = this.getAttribute('data-value');
            const submitButton = votacionDiv.querySelector('#submit-rating');
            submitButton.disabled = false;
            submitButton.classList.add('enabled');
        });
    });

    // Determinar si el usuario es nuevo o recurrente
    let tipoUsuario = 'Nuevo';
    if (localStorage.getItem('visitado')) {
        tipoUsuario = 'Recurrente';
    } else {
        localStorage.setItem('visitado', 'true');
    }

    // Evento para cerrar sin votar
    votacionDiv.querySelector('#close-rating').addEventListener('click', function () {
        votacionDiv.remove();

        // Enviar evento al dataLayer con 0 estrellas
        window.dataLayer.push({
            event: 'rating_event',
            estrella: 0,
            usuario: tipoUsuario
        });

        console.log('Votación cerrada sin interactuar.');
    });

    // Evento para finalizar la votación
    votacionDiv.querySelector('#submit-rating').addEventListener('click', function () {
        if (selectedRating) {
            // Enviar evento al dataLayer con las estrellas seleccionadas
            window.dataLayer.push({
                event: 'rating_event',
                estrella: parseInt(selectedRating, 10),
                usuario: tipoUsuario
            });

            console.log(`Votación enviada con ${selectedRating} estrellas.`);
            votacionDiv.remove();
        }
    });
});
