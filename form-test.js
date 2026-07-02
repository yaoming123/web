
// ═══════════════════════════════════════════════════════════
// SISTEMA DE PERSISTENCIA CON LOCALSTORAGE
// ═══════════════════════════════════════════════════════════

// Guardar estado del formulario en localStorage
function saveFormData() {
    const formData = {
        // Datos del negocio
        name: document.getElementById('name').value,
        cellphone: document.getElementById('cellphone').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        
        // Tipo de persona
        persona_tipo: document.querySelector('input[name="persona_tipo"]:checked')?.value || '',
        pf_nombre: document.getElementById('pf-nombre').value,
        pf_cuil: document.getElementById('pf-cuil').value,
        emp_cuit: document.getElementById('emp-cuit').value,
        
        // Redes sociales
        social_opts: Array.from(document.querySelectorAll('input[name="social_opts"]:checked')).map(el => el.value),
        mapLink: document.getElementById('mapLink').value,
        instagramLink: document.getElementById('instagramLink').value,
        facebookLink: document.getElementById('facebookLink').value,
        websiteLink: document.getElementById('websiteLink').value,
        tiktokLink: document.getElementById('tiktokLink').value,
        youtubeLink: document.getElementById('youtubeLink').value,
        otherLinks: document.getElementById('otherLinks').value,
        
        // Medios de pago
        payment_opts: Array.from(document.querySelectorAll('input[name="payment_opts"]:checked')).map(el => el.value),
        payment_otros: document.getElementById('payment-otros-text').value,
        
        // Disponibilidad
        availability_opts: Array.from(document.querySelectorAll('input[name="availability_opts"]:checked')).map(el => el.value),
        
        // Horarios (capturar estado de cada día)
        schedule: Array.from(document.querySelectorAll('.schedule-row')).map(row => ({
            day: row.dataset.day,
            active: row.querySelector('.day-active').checked,
            allday: row.querySelector('.day-allday').checked,
            open: row.querySelector('.time-open').value,
            close: row.querySelector('.time-close').value
        })),
        
        // Método de contacto
        contact_method: Array.from(document.querySelectorAll('input[name="contact_method"]:checked')).map(el => el.value),
        
        // Detalles adicionales
        details: document.getElementById('details').value,
        
        // URLs de imágenes
        logo_url: document.getElementById('logo-url').value,
        photos_urls: document.getElementById('photos-urls').value,
        
        // Términos
        terminos: document.getElementById('terminos-form').checked
    };
    
    localStorage.setItem('formData_publicidad', JSON.stringify(formData));
}

// Restaurar datos del formulario desde localStorage
function loadFormData() {
    const saved = localStorage.getItem('formData_publicidad');
    if (!saved) return;
    
    try {
        const formData = JSON.parse(saved);
        
        // Restaurar datos del negocio
        if (formData.name) document.getElementById('name').value = formData.name;
        if (formData.cellphone) document.getElementById('cellphone').value = formData.cellphone;
        if (formData.phone) document.getElementById('phone').value = formData.phone;
        if (formData.address) document.getElementById('address').value = formData.address;
        if (formData.email) document.getElementById('email').value = formData.email;
        
        // Restaurar tipo de persona
        if (formData.persona_tipo) {
            const radio = document.querySelector(`input[name="persona_tipo"][value="${formData.persona_tipo}"]`);
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        }
        if (formData.pf_nombre) document.getElementById('pf-nombre').value = formData.pf_nombre;
        if (formData.pf_cuil) document.getElementById('pf-cuil').value = formData.pf_cuil;
        if (formData.emp_cuit) document.getElementById('emp-cuit').value = formData.emp_cuit;
        
        // Restaurar redes sociales
        if (formData.social_opts) {
            formData.social_opts.forEach(value => {
                const checkbox = document.querySelector(`input[name="social_opts"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        }
        if (formData.mapLink) document.getElementById('mapLink').value = formData.mapLink;
        if (formData.instagramLink) document.getElementById('instagramLink').value = formData.instagramLink;
        if (formData.facebookLink) document.getElementById('facebookLink').value = formData.facebookLink;
        if (formData.websiteLink) document.getElementById('websiteLink').value = formData.websiteLink;
        if (formData.tiktokLink) document.getElementById('tiktokLink').value = formData.tiktokLink;
        if (formData.youtubeLink) document.getElementById('youtubeLink').value = formData.youtubeLink;
        if (formData.otherLinks) document.getElementById('otherLinks').value = formData.otherLinks;
        
        // Restaurar medios de pago
        if (formData.payment_opts) {
            formData.payment_opts.forEach(value => {
                const checkbox = document.querySelector(`input[name="payment_opts"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    if (value === 'Otros') checkbox.dispatchEvent(new Event('change'));
                }
            });
        }
        if (formData.payment_otros) document.getElementById('payment-otros-text').value = formData.payment_otros;
        
        // Restaurar disponibilidad
        if (formData.availability_opts) {
            formData.availability_opts.forEach(value => {
                const checkbox = document.querySelector(`input[name="availability_opts"][value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Restaurar horarios
        if (formData.schedule) {
            formData.schedule.forEach(scheduleData => {
                const row = document.querySelector(`.schedule-row[data-day="${scheduleData.day}"]`);
                if (row) {
                    const activeCheckbox = row.querySelector('.day-active');
                    const alldayCheckbox = row.querySelector('.day-allday');
                    const openSelect = row.querySelector('.time-open');
                    const closeSelect = row.querySelector('.time-close');
                    
                    activeCheckbox.checked = scheduleData.active;
                    alldayCheckbox.checked = scheduleData.allday;
                    openSelect.value = scheduleData.open;
                    closeSelect.value = scheduleData.close;
                    
                    activeCheckbox.dispatchEvent(new Event('change'));
                    if (scheduleData.allday) alldayCheckbox.dispatchEvent(new Event('change'));
                }
            });
        }
        
        // Restaurar método de contacto
        if (formData.contact_method) {
            formData.contact_method.forEach(value => {
                const checkbox = document.querySelector(`input[name="contact_method"][value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Restaurar detalles
        if (formData.details) document.getElementById('details').value = formData.details;
        
        // Restaurar URLs de imágenes
        if (formData.logo_url) {
            document.getElementById('logo-url').value = formData.logo_url;
            document.getElementById('logo-upload-status').innerHTML = '<span class="upload-success">✅ Logo cargado (guardado anteriormente)</span>';
        }
        if (formData.photos_urls) {
            document.getElementById('photos-urls').value = formData.photos_urls;
            document.getElementById('photos-upload-status').innerHTML = '<span class="upload-success">✅ Fotos cargadas (guardadas anteriormente)</span>';
        }
        
        // Restaurar términos
        if (formData.terminos) document.getElementById('terminos-form').checked = formData.terminos;
        
        console.log('✅ Datos del formulario restaurados desde localStorage');
    } catch (error) {
        console.error('Error al restaurar datos del formulario:', error);
    }
}

// Auto-guardar cada vez que cambia algo en el formulario
function setupAutoSave() {
    const form = document.getElementById('whatsapp-form');
    
    // Guardar cuando cambian inputs de texto
    form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="url"], textarea').forEach(input => {
        input.addEventListener('input', saveFormData);
    });
    
    // Guardar cuando cambian checkboxes y radios
    form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.addEventListener('change', saveFormData);
    });
    
    // Guardar cuando cambian selects (horarios)
    form.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', saveFormData);
    });
}

// Función para limpiar el formulario y localStorage
function clearFormData() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos del formulario?')) {
        localStorage.removeItem('formData_publicidad');
        document.getElementById('whatsapp-form').reset();
        location.reload();
    }
}

// ═══════════════════════════════════════════════════════════
// SISTEMA DE CACHÉ CON ETAG DE CLOUDINARY
// ═══════════════════════════════════════════════════════════

// Verificar si la imagen ya fue subida (por ETag)
function getImageFromCache(etag) {
    const cache = JSON.parse(localStorage.getItem('imageCache') || '{}');
    return cache[etag] || null;
}

// Guardar imagen en caché con su ETag
function saveImageToCache(etag, url, filename, publicId) {
    const cache = JSON.parse(localStorage.getItem('imageCache') || '{}');
    cache[etag] = { 
        url, 
        filename, 
        publicId,
        timestamp: Date.now() 
    };
    localStorage.setItem('imageCache', JSON.stringify(cache));
}

// Calcular hash del archivo para verificación previa (opcional, más rápido)
async function calculateFileHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Verificar si un archivo ya fue subido (por hash local)
function getFileByHash(fileHash) {
    const hashMap = JSON.parse(localStorage.getItem('fileHashMap') || '{}');
    return hashMap[fileHash] || null;
}

// Guardar mapeo de hash local → etag de Cloudinary
function saveFileHash(fileHash, etag) {
    const hashMap = JSON.parse(localStorage.getItem('fileHashMap') || '{}');
    hashMap[fileHash] = etag;
    localStorage.setItem('fileHashMap', JSON.stringify(hashMap));
}

// ═══════════════════════════════════════════════════════════
// VALIDAR TÉRMINOS Y CONDICIONES ANTES DE ENVIAR
// ═══════════════════════════════════════════════════════════
function validateForm() {
    const terminos = document.getElementById('terminos-form');
    
    if (!terminos.checked) {
        mostrarModalAdvertenciaformulario('Debes aceptar los Términos y Condiciones antes de enviar el formulario.');
        // Scroll al checkbox de términos
        terminos.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
    
    return true;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN E INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos guardados
    loadFormData();
    
    // Configurar auto-guardado
    setupAutoSave();
    
    console.log('✅ Sistema de persistencia inicializado');
    
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
            const email = document.getElementById('email').value || 'No especificado';

            // Tipo de persona
            const personaTipo = document.getElementById('persona_tipo_valor').value || 'No especificado';
            let personaDetalles = '';
            if (personaTipo === 'Física') {
                const pfNombre = document.getElementById('pf-nombre').value || 'No especificado';
                const pfCuil = document.getElementById('pf-cuil').value || 'No especificado';
                personaDetalles = `Persona Física - Nombre: ${pfNombre}, CUIL: ${pfCuil}`;
            } else if (personaTipo === 'Empresa') {
                const empCuit = document.getElementById('emp-cuit').value || 'No especificado';
                personaDetalles = `Empresa - CUIT: ${empCuit}`;
            }

            // Redes sociales - solo incluir las que están seleccionadas
            let redesSociales = [];
            if (document.getElementById('social-maps-cb').checked) {
                const mapLink = document.getElementById('mapLink').value || 'No especificado';
                redesSociales.push(`Google Maps: ${mapLink}`);
            }
            if (document.getElementById('social-instagram-cb').checked) {
                const instagramLink = document.getElementById('instagramLink').value || 'No especificado';
                redesSociales.push(`Instagram: ${instagramLink}`);
            }
            if (document.getElementById('social-facebook-cb').checked) {
                const facebookLink = document.getElementById('facebookLink').value || 'No especificado';
                redesSociales.push(`Facebook: ${facebookLink}`);
            }
            if (document.getElementById('social-website-cb').checked) {
                const websiteLink = document.getElementById('websiteLink').value || 'No especificado';
                redesSociales.push(`Sitio web: ${websiteLink}`);
            }
            if (document.getElementById('social-tiktok-cb').checked) {
                const tiktokLink = document.getElementById('tiktokLink').value || 'No especificado';
                redesSociales.push(`TikTok: ${tiktokLink}`);
            }
            if (document.getElementById('social-youtube-cb').checked) {
                const youtubeLink = document.getElementById('youtubeLink').value || 'No especificado';
                redesSociales.push(`YouTube: ${youtubeLink}`);
            }
            if (document.getElementById('social-otros-cb').checked) {
                const otherLinks = document.getElementById('otherLinks').value || 'No especificado';
                redesSociales.push(`Otras redes: ${otherLinks}`);
            }
            const redesSocialesTexto = redesSociales.length > 0 ? redesSociales.join('\n            - ') : 'Ninguna especificada';

            payment = document.getElementById('payment').value || 'No especificados';

            // Disponibilidad
            const availabilityOpts = Array.from(document.querySelectorAll('input[name="availability_opts"]:checked'))
                .map(el => el.value);
            const availabilityTexto = availabilityOpts.length > 0 ? availabilityOpts.join(', ') : 'No especificado';

            const hours = document.getElementById('hours').value || 'No especificado';

            // Método de contacto preferido
            const contactMethod = Array.from(document.querySelectorAll('input[name="contact_method"]:checked'))
                .map(el => el.value);
            const contactMethodTexto = contactMethod.length > 0 ? contactMethod.join(', ') : 'No especificado';

            details = document.getElementById('details').value || 'Sin detalles adicionales';

            // ═══════════════════════════════════════════════════════════
            // AGREGAR URLs DE IMÁGENES DE CLOUDINARY
            // ═══════════════════════════════════════════════════════════
            const logoUrl = document.getElementById('logo-url').value;
            const photosUrls = document.getElementById('photos-urls').value;
            
            let imagenesTexto = '';
            
            if (logoUrl) {
                imagenesTexto += `\n            
            🖼️ LOGO DEL NEGOCIO
            - ${logoUrl}`;
            }
            
            if (photosUrls) {
                const urlsArray = photosUrls.split(',');
                imagenesTexto += `\n            
            📸 FOTOS DEL SERVICIO (${urlsArray.length})`;
                urlsArray.forEach((url, index) => {
                    imagenesTexto += `\n            - Foto ${index + 1}: ${url}`;
                });
            }

            // Mensaje para publicidad
            mensaje = `
            Hola, he leído y aceptado los términos y condiciones. Me interesa publicitar en cerrajero.net.ar:
            
            📍 SECCIÓN
            - Enlace de la sección: ${section}
            
            🏢 DATOS DEL NEGOCIO
            - Nombre del negocio: ${name}
            - Número de celular: ${cellphone}
            - Número de teléfono fijo: ${phone}
            - Dirección: ${address}
            - Email: ${email}
            
            👤 TIPO DE PERSONA
            - ${personaDetalles}
            
            🌐 REDES SOCIALES Y UBICACIÓN
            - ${redesSocialesTexto}
            
            💳 MEDIOS DE PAGO
            - ${payment}
            
            🕒 DISPONIBILIDAD Y HORARIOS
            - Disponibilidad: ${availabilityTexto}
            - Horarios: ${hours}
            
            📞 MÉTODO DE CONTACTO PREFERIDO
            - ${contactMethodTexto}${imagenesTexto}
            
            ℹ️ INFORMACIÓN ADICIONAL
            - ${details}
            `;
        } else {
            mostrarModalAdvertenciaformulario('No se ha detectado un formulario válido.')
            return null;
        }

        // Validar que los campos requeridos estén llenos
        if (!section || !name || !cellphone) {
            mostrarModalAdvertenciaformulario('Por favor completa todos los campos requeridos (Sección, Nombre del Negocio y Celular).');
            return null;
        }

        return mensaje;
    }

    // Función para rastrear clics
    function trackClick(button, contacto) {
        const horaLocal = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
        const hora = new Date().toISOString();
        const seccion = "Formulario Publicitar";
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
            // VALIDAR TÉRMINOS PRIMERO
            if (!validateForm()) {
                return;
            }
            
            const message = generateMessage();
            if (message) {
                const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
                trackClick(whatsappButton, 'WhatsApp');
                window.open(whatsappLink, '_blank', 'noopener,noreferrer');
            }
        });
    }
    
    // Evento para Messenger
    if (messengerButton) {
        messengerButton.addEventListener('click', function () {
            // VALIDAR TÉRMINOS PRIMERO
            if (!validateForm()) {
                return;
            }
            
            const message = generateMessage();
            if (message) {
                const messengerLink = `https://www.messenger.com/t/cerrajero.net.ar?text=${encodeURIComponent(message)}`;
                trackClick(messengerButton, 'Messenger');
                window.open(messengerLink, '_blank', 'noopener,noreferrer');
            }
        });
    }
});

/* ── Tipo de persona: radio → muestra/oculta campos ── */
document.querySelectorAll('input[name="persona_tipo"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        document.getElementById('persona-fisica-fields').classList.remove('visible');
        document.getElementById('empresa-fields').classList.remove('visible');
        if (this.value === 'Física') document.getElementById('persona-fisica-fields').classList.add('visible');
        if (this.value === 'Empresa') document.getElementById('empresa-fields').classList.add('visible');
        document.getElementById('persona_tipo_valor').value = this.value;
    });
});

/* ── "Otros" medios de pago: muestra/oculta campo extra ── */
document.getElementById('payment-otros-cb').addEventListener('change', function () {
    var field = document.getElementById('otros-pago-field');
    field.classList.toggle('visible', this.checked);
    if (!this.checked) document.getElementById('payment-otros-text').value = '';
});

/* ── Redes sociales: muestra/oculta campos según checkbox ── */
var socialMap = {
    'social-maps-cb': 'social-maps-field',
    'social-instagram-cb': 'social-instagram-field',
    'social-facebook-cb': 'social-facebook-field',
    'social-website-cb': 'social-website-field',
    'social-tiktok-cb': 'social-tiktok-field',
    'social-youtube-cb': 'social-youtube-field',
    'social-otros-cb': 'social-otros-field'
};

Object.keys(socialMap).forEach(function (cbId) {
    var checkbox = document.getElementById(cbId);
    var field = document.getElementById(socialMap[cbId]);

    checkbox.addEventListener('change', function () {
        field.classList.toggle('visible', this.checked);
        if (!this.checked) {
            // Limpiar el campo cuando se deselecciona
            var input = field.querySelector('input');
            if (input) input.value = '';
        }
    });
});

/* ── Contador de caracteres ── */
function updateCharCount(el, counterId, max) {
    var counter = document.getElementById(counterId);
    var len = el.value.length;
    counter.textContent = len + ' / ' + max;
    counter.className = 'char-counter';
    if (len >= max) counter.classList.add('at-limit');
    else if (len >= max * 0.85) counter.classList.add('near-limit');
}

/* ── Sincroniza campos hidden antes de enviar ── */
function syncFormFields() {
    /* Medios de pago → #payment */
    var selected = Array.from(
        document.querySelectorAll('input[name="payment_opts"]:checked')
    ).map(function (el) { return el.value; });

    var otrosText = document.getElementById('payment-otros-text').value.trim();
    if (otrosText) {
        selected = selected.filter(function (v) { return v !== 'Otros'; });
        selected.push('Otros: ' + otrosText);
    }
    document.getElementById('payment').value = selected.length
        ? selected.join(', ')
        : 'No especificado';
}