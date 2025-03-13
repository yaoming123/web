document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Select2 con estilos dinámicos
    $("#localidades").select2({
        placeholder: "Buscar localidad",
        allowClear: true,
        width: "50%",
        templateResult: function (data) {
            if (!data.id) {
                return data.text;
            }

            // Obtener el color del estilo original
            const color = document.querySelector(`option[value="${data.id}"]`).style.color;
            const $result = $(`<span style="color: ${color};">${data.text}</span>`);
            return $result;
        },
        templateSelection: function (data) {
            // Mantener los colores también en la selección
            if (!data.id) {
                return data.text;
            }

            const color = document.querySelector(`option[value="${data.id}"]`).style.color;
            return $(`<span style="color: ${color};">${data.text}</span>`);
        }
    });
    $("#barrios").select2({
        placeholder: "Buscar barrios",
        allowClear: true,
        width: "50%",
        templateResult: function (data) {
            if (!data.id) {
                return data.text;
            }

            // Obtener el color del estilo original
            const color = document.querySelector(`option[value="${data.id}"]`).style.color;
            const $result = $(`<span style="color: ${color};">${data.text}</span>`);
            return $result;
        },
        templateSelection: function (data) {
            // Mantener los colores también en la selección
            if (!data.id) {
                return data.text;
            }

            const color = document.querySelector(`option[value="${data.id}"]`).style.color;
            return $(`<span style="color: ${color};">${data.text}</span>`);
        }
    });
});
