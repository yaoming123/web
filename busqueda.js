document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Select2 con estilos dinámicos
    $("#localidades").select2({
        placeholder: "Buscar localidad",
        allowClear: true,
        width: "100%",
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

    // Redirigir al enlace seleccionado
    $("#localidades").on("select2:select", function (e) {
        const selectedValue = e.params.data.id; // ID seleccionado
        if (selectedValue) {
            const targetSection = document.getElementById(selectedValue);
            if (targetSection) {
                const enlace = targetSection.querySelector("a.button");
                if (enlace) {
                    window.location.href = enlace.href; // Redirigir al enlace
                } else {
                    alert("El enlace para la sección seleccionada no está disponible.");
                }
            } else {
                alert("La sección seleccionada no está disponible.");
            }
        }
    });
});