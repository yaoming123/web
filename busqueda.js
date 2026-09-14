// Inicializa (o reinicializa) Select2 sobre un <select> dado.
// Reutilizable tanto para el buscador en el cuerpo de la página
// como para el que se inyecta dinámicamente dentro del modal.
function inicializarSelect2(selector, placeholder) {
    const $el = $(selector);

    if ($el.length === 0) {
        // El elemento no está en el DOM todavía (nivel sin selector
        // siguiente, o el include no corresponde a esta sección).
        return;
    }

    // Si ya existe una instancia previa de Select2 sobre este elemento
    // (por ejemplo, de una apertura anterior del modal), la destruimos
    // antes de re-inicializar para evitar duplicados o estado colgado.
    if ($el.hasClass("select2-hidden-accessible")) {
        $el.select2("destroy");
    }

    $el.select2({
        placeholder: placeholder,
        allowClear: true,
        width: "50%",
        templateResult: function (data) {
            if (!data.id) {
                return data.text;
            }

            // Obtener el color del estilo original
            const opcion = document.querySelector(`${selector} option[value="${data.id}"]`);
            const color = opcion ? opcion.style.color : "";
            return $(`<span style="color: ${color};">${data.text}</span>`);
        },
        templateSelection: function (data) {
            // Mantener los colores también en la selección
            if (!data.id) {
                return data.text;
            }

            const opcion = document.querySelector(`${selector} option[value="${data.id}"]`);
            const color = opcion ? opcion.style.color : "";
            return $(`<span style="color: ${color};">${data.text}</span>`);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Select2 con estilos dinámicos (buscadores en el cuerpo de la página, si existen)
    inicializarSelect2("#localidades", "Buscar localidad");
    inicializarSelect2("#barrios", "Buscar barrios");
});