/* =====================================================================
   tracking.js - plomero.net.ar
   Va en el <head>. No requiere cambios en el HTML.
   ===================================================================== */

window.dataLayer = window.dataLayer || [];
window.formEnviado = false;

/* ---------- Parámetros que se "limpian" en cada evento ----------
   GTM conserva en memoria los valores del dataLayer entre eventos.
   Poner undefined evita que un parámetro de un evento aparezca en el siguiente. */
const VOLATILES = [
    'categoria', 'accion', 'etiqueta', 'canal', 'servicio', 'motivo', 'grupo',
    'valor', 'marcado', 'radio_km', 'cantidad', 'porcentaje', 'destino',
    'destino_con_anunciante', 'origen', 'form', 'resultado', 'tipo_archivo',
    'kb', 'metodo', 'referido', 'direccion', 'mensaje', 'archivo', 'linea',
    'clics_totales', 'tipo_modal'
];

const _contadores = {};
function limitado(clave, max) {
    _contadores[clave] = (_contadores[clave] || 0) + 1;
    return _contadores[clave] <= max;
}

/* ---------- Reloj del modal (con guarda: #reloj no siempre existe) ---------- */
function mostrarHora() {
    const reloj = document.getElementById('reloj');
    if (!reloj) return;
    reloj.textContent = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
}
setInterval(mostrarHora, 1000);
mostrarHora();

/* ---------- Contexto de la sección (lee la URL) ----------
   /cordoba.html                         -> provincia
   /cordoba/valle-de-anisacate.html      -> localidad
   /buenos-aires/almirante-brown/adrogue.html -> barrio */
const NIVELES = ['provincia', 'localidad', 'barrio'];

function tieneAnunciante() {
    const n = (typeof numeroWhatsAppAnunciante !== 'undefined')
        ? String(numeroWhatsAppAnunciante).trim() : '';
    return (n && n !== 'None') ? 'si' : 'no';
}

function getSeccionInfo() {
    const partes = location.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
    const info = {
        nivel: 'otra', provincia: '', localidad: '', barrio: '',
        zona: '', tiene_anunciante: tieneAnunciante()
    };

    if (!partes.length || partes[0] === 'index') { info.nivel = 'pais'; return info; }
    if (partes.length > 3 || ['terminos-y-condiciones', 'publicidad'].includes(partes[0])) return info;

    info.nivel     = NIVELES[partes.length - 1];
    info.provincia = partes[0] || '';
    info.localidad = partes[1] || '';
    info.barrio    = partes[2] || '';
    info.zona      = partes.join('/');
    return info;
}

/* ---------- Función base: todo pasa por acá ---------- */
function track(nombre, params) {
    const base = {};
    VOLATILES.forEach(k => { base[k] = undefined; });
    window.dataLayer.push(Object.assign(base, { event: nombre }, getSeccionInfo(), params || {}));
}

/* ---------- Compatibilidad con el HTML actual ---------- */
function trackEvent(element, eventName, category, action, label) {
    eventName = eventName || 'click_evento';
    track(eventName, {
        categoria: category || 'General',
        accion: action || (element && element.textContent ? element.textContent.trim().substring(0, 60) : 'Desconocido'),
        etiqueta: label || (element && element.getAttribute ? element.getAttribute('aria-label') : '') || 'Sin etiqueta'
    });
}

function trackDynamicWhatsAppClick(button) {
    if (!button) return;
    window.numClicsWhatsApp = (window.numClicsWhatsApp || 0) + 1;
    track('click_whatsapp', {
        categoria: 'WhatsApp',
        accion: button.textContent.trim().substring(0, 60),
        etiqueta: 'Botón WhatsApp',
        canal: 'whatsapp',
        servicio: button.getAttribute('data-servicio') || 'Contacto general',
        clics_totales: window.numClicsWhatsApp
    });
}

/* ---------- Canal según la URL ---------- */
function canalDeUrl(url) {
    if (/^tel:/i.test(url)) return 'telefono';
    if (/wa\.me|whatsapp\.com/i.test(url)) return 'whatsapp';
    if (/instagram\.com/i.test(url)) return 'instagram';
    if (/facebook\.com/i.test(url)) return 'facebook';
    if (/google\.com\/maps/i.test(url)) return 'mapa';
    return 'otro';
}

function esCanalDeContacto(a) {
    const href = a.getAttribute('href') || '';
    if (/^tel:/i.test(href)) return true;
    if (!(a.closest('#contacto') || a.closest('.servicio'))) return false;
    return canalDeUrl(a.href) !== 'otro';
}

function modalTieneContinuar() {
    return Array.from(document.querySelectorAll('#modal button'))
        .some(b => /continuar/i.test(b.textContent));
}

/* ---------- Helpers ---------- */
function envolver(nombre, antes) {
    const original = window[nombre];
    if (typeof original !== 'function') return;
    window[nombre] = function () {
        try { antes.apply(this, arguments); } catch (e) { /* nunca romper la página */ }
        return original.apply(this, arguments);
    };
}

function verUnaVez(selector, nombre, params) {
    const el = document.querySelector(selector);
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { track(nombre, params); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
}

/* =====================================================================
   NUEVOS EVENTOS
   - click_anunciar_aqui   (botón "¡Anunciá aquí!" de la página y de los modales)
   - click_copiar_info / click_descargar_info / click_reportar_problema (modal con anunciante)
   - modal_cerrar          (cualquier modal: X, botón Cerrar/Cancelar, clic afuera, Escape)
   - galeria_cerrar        (galería ampliada: X, clic afuera, Escape)
   - form_limpiar          (botón "Limpiar formulario")

   IMPORTANTE: este bloque va ANTES del listener de clics principal, porque
   necesita leer window.ultimoContacto antes de que ese listener lo ponga en null.
   ===================================================================== */

/* Detecta "¡Anunciá aquí!", "¡Anunciate aquí!", "Anuncia aquí", etc. */
const RE_ANUNCIAR = /an[uú]nci(?:a|á|ate|áte)\s+aqu[ií]/i;

/* Acciones de abajo del modal con anunciante */
const ACCIONES_MODAL = [
    { re: /copiar/i,    evento: 'click_copiar_info',       accion: 'copiar_info' },
    { re: /descargar/i, evento: 'click_descargar_info',    accion: 'descargar_info' },
    { re: /reportar/i,  evento: 'click_reportar_problema', accion: 'reportar_problema' }
];

/* Canal y servicio del contacto que abrió el modal (solo si es un modal de contacto) */
function contextoContacto() {
    const c = window.ultimoContacto;
    return (c && modalTieneContinuar())
        ? { canal: canalDeUrl(c.url), servicio: c.servicio }
        : {};
}

/* Qué modal es, según su contenido */
function tipoModal() {
    if (modalTieneContinuar()) return 'contacto';
    if (document.getElementById('loader')) return 'cargando';
    const h = document.getElementById('modal-title');
    const titulo = h ? h.textContent : '';
    if (/Buscar cerrajero/i.test(titulo)) return 'buscar';
    if (/Proveedores Cercanos/i.test(titulo)) return 'resultados';
    if (/Geolocalizaci/i.test(titulo)) return 'sin_resultados';
    if (/Error en la B/i.test(titulo)) return 'error';
    if (/Aviso/i.test(titulo)) return 'aviso';
    return 'otro';
}

function modalAbierto() {
    const m = document.getElementById('modal');
    return !!(m && m.classList.contains('active'));
}

function galeriaAbierta() {
    const g = document.getElementById('modalFoto');
    return !!(g && g.classList.contains('visible'));
}

function trackCierreGaleria(metodo) {
    track('galeria_cerrar', { metodo: metodo });
    /* También cuenta como cierre de modal. Si no lo querés duplicado, borrá esta línea. */
    track('modal_cerrar', { metodo: metodo, tipo_modal: 'galeria' });
}

document.addEventListener('click', function (e) {
    const t = e.target;
    if (!t || !t.closest) return;

    /* 1) "¡Anunciá aquí!" (botón de arriba de todo y botones dentro de los modales) */
    const cand = t.closest('a, button');
    if (cand && (cand.matches('a[href*="#formulario-publicidad"]') || RE_ANUNCIAR.test(cand.textContent))) {
        let extra;
        if (!cand.closest('#modal')) {
            extra = { origen: 'pagina' };
        } else {
            const ctx = contextoContacto();
            extra = ctx.canal
                ? Object.assign({ origen: 'modal_contacto' }, ctx)
                : { origen: 'modal_busqueda' };
        }
        track('click_anunciar_aqui', Object.assign({
            categoria: 'anunciantes',
            accion: 'anunciar_aqui',
            etiqueta: 'botón anunciar aquí'
        }, extra));
    }

    /* 2) Copiar / Descargar / Reportar (modal con anunciante) */
    const linkModal = t.closest('#modal a');
    if (linkModal) {
        const txt = linkModal.textContent;
        const a = ACCIONES_MODAL.find(x => x.re.test(txt));
        if (a) {
            track(a.evento, Object.assign({
                categoria: 'modal',
                accion: a.accion,
                etiqueta: txt.trim().substring(0, 60)
            }, contextoContacto()));
        }
    }

    /* 3) Cierre de modales (Continuar NO cuenta como cierre: es una confirmación) */
    if (modalAbierto()) {
        let metodo = null;
        if (t.id === 'modal') {
            metodo = 'fuera';
        } else if (t.closest('#modal-close-btn')) {
            metodo = 'x';
        } else {
            const b = t.closest('#modal button');
            if (b && !/continuar/i.test(b.textContent) && /cancelar|cerrar/i.test(b.textContent)) {
                metodo = /cancelar/i.test(b.textContent) ? 'cancelar' : 'boton';
            }
        }
        if (metodo) {
            track('modal_cerrar', Object.assign(
                { metodo: metodo, tipo_modal: tipoModal() },
                contextoContacto()
            ));
        }
    }

    /* 4) Cierre de la galería ampliada */
    if (galeriaAbierta()) {
        if (t.closest('#modalFoto .cerrar')) trackCierreGaleria('boton');
        else if (t.id === 'modalFoto') trackCierreGaleria('fuera');
    }

    /* 5) Limpiar formulario */
    if (t.closest('#clear-form-button')) {
        track('form_limpiar', { form: 'publicidad' });
    }
}, true);

document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    if (galeriaAbierta()) { trackCierreGaleria('escape'); return; }

    if (modalAbierto()) {
        track('modal_cerrar', Object.assign(
            { metodo: 'escape', tipo_modal: tipoModal() },
            contextoContacto()
        ));
    }
}, true);

/* =====================================================================
   Errores de JavaScript (máximo 5 por visita)
   ===================================================================== */
window.addEventListener('error', function (e) {
    if (!limitado('js_error', 5)) return;
    track('js_error', {
        mensaje: String(e.message || '').slice(0, 100),
        archivo: (e.filename || '').split('/').pop(),
        linea: e.lineno
    });
});
window.addEventListener('unhandledrejection', function (e) {
    if (!limitado('js_error', 5)) return;
    const r = e.reason;
    track('js_error', { mensaje: String((r && r.message) || r || '').slice(0, 100), archivo: 'promise' });
});

/* =====================================================================
   Clics (fase de captura: corre antes que los listeners de la página)
   ===================================================================== */
document.addEventListener('click', function (e) {
    const t = e.target;
    if (!t || !t.closest) return;

    /* 1) Botones del modal de advertencia: Continuar / Cancelar */
    const btnModal = t.closest('#modal button');
    if (btnModal && window.ultimoContacto && modalTieneContinuar()) {
        const c = window.ultimoContacto;
        if (/continuar/i.test(btnModal.textContent)) {
            track('contacto_confirmado', { canal: canalDeUrl(c.url), servicio: c.servicio });
            window.ultimoContacto = null;
        } else if (/cancelar/i.test(btnModal.textContent)) {
            track('contacto_cancelado', { canal: canalDeUrl(c.url), servicio: c.servicio });
            window.ultimoContacto = null;
        }
        return;
    }

    /* 2) Enlaces de contacto: guardar contexto antes de que se abra el modal */
    const a = t.closest('a[href]');
    if (a && !a.closest('#modal') && esCanalDeContacto(a)) {
        window.ultimoContacto = {
            url: a.href,
            servicio: a.getAttribute('data-servicio') || 'Contacto general'
        };
        if (/^tel:/i.test(a.getAttribute('href'))) {
            track('click_telefono', { canal: 'telefono', servicio: window.ultimoContacto.servicio });
        }
    }

    /* 3) Editor de servicios del formulario */
    const ed = t.closest('#services-editor button, #add-service-btn');
    if (ed) {
        if (ed.id === 'add-service-btn') {
            track('servicios_agregar');
        } else if (ed.classList.contains('btn-toggle')) {
            const card = ed.closest('.svc-card');
            const inp = card && card.querySelector('input[type="text"]');
            const nombre = (card && card.classList.contains('custom'))
                ? '(nuevo)' : (inp ? inp.value.slice(0, 80) : '');
            track(/eliminar/i.test(ed.textContent) ? 'servicios_eliminar' : 'servicios_mantener',
                { servicio: nombre });
        } else if (ed.classList.contains('btn-restore')) {
            track('servicios_restaurar');
        } else if (ed.title === 'Subir' || ed.title === 'Bajar') {
            if (limitado('servicios_mover', 20)) track('servicios_mover', { direccion: ed.title.toLowerCase() });
        }
    }

    /* 4) Flechas del carrusel */
    if (t.closest('.galeria-grid .prev, .galeria-grid .next') && limitado('galeria_navegar', 10)) {
        track('galeria_navegar', { direccion: t.closest('.next') ? 'siguiente' : 'anterior' });
    }
}, true);

/* =====================================================================
   Al cargar el DOM
   ===================================================================== */
document.addEventListener('DOMContentLoaded', function () {

    /* --- Parche: "trackEvent=(" (typo en el botón del mapa de la plantilla sin anunciante) --- */
    document.querySelectorAll('[onclick*="trackEvent=("]').forEach(el => {
        el.setAttribute('onclick', el.getAttribute('onclick').replace('trackEvent=(', 'trackEvent('));
    });

    /* --- Enlaces a publicidad.html con ?from= (comportamiento original) --- */
    document.querySelectorAll('a[href*="publicidad.html"]').forEach(link => {
        const url = new URL(link.href, location.href);
        if (!url.searchParams.has('from')) {
            url.searchParams.set('from', location.href);
            link.href = url.toString();
        }
    });

    /* --- Secciones vistas --- */
    verUnaVez('#servicios', 'ver_servicios');
    verUnaVez('#contacto', 'ver_contacto');
    verUnaVez('#formulario-publicidad', 'form_view', { form: 'publicidad' });

    /* --- Scroll 25/50/75/100 --- */
    const hitos = new Set();
    window.addEventListener('scroll', function () {
        const total = document.documentElement.scrollHeight;
        if (!total) return;
        const pct = (window.scrollY + window.innerHeight) / total * 100;
        [25, 50, 75, 100].forEach(m => {
            if (pct >= m - 1 && !hitos.has(m)) { hitos.add(m); track('scroll_depth', { porcentaje: m }); }
        });
    }, { passive: true });

    /* --- Visita referida --- */
    const ref = new URLSearchParams(location.search).get('referido');
    if (ref) track('visita_referida', { referido: ref.slice(0, 50) });

    /* --- Embudo del formulario (solo existe en zonas sin anunciante) --- */
    const form = document.getElementById('whatsapp-form');
    if (form) {
        let iniciado = false, abandonoEnviado = false;

        form.addEventListener('input', function () {
            if (!iniciado) { iniciado = true; track('form_start', { form: 'publicidad' }); }
        });

        /* Solo opciones de chips; nunca el contenido de campos de texto */
        form.addEventListener('change', function (e) {
            const t = e.target;
            if (t.name && t.matches('input[type=radio], input[type=checkbox]')) {
                track('form_opcion', { grupo: t.name, valor: t.value, marcado: !!t.checked });
            }
        });

        function reportarAbandono() {
            if (iniciado && !window.formEnviado && !abandonoEnviado) {
                abandonoEnviado = true;
                track('form_abandono', { form: 'publicidad' });
            }
        }
        window.addEventListener('pagehide', reportarAbandono);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') reportarAbandono();
        });

        /* Subida de imágenes (uploadToCloudinary es global en el formulario) */
        if (typeof window.uploadToCloudinary === 'function') {
            const subir = window.uploadToCloudinary;
            window.uploadToCloudinary = async function (file) {
                const datos = { tipo_archivo: file.type, kb: Math.round(file.size / 1024) };
                try {
                    const r = await subir(file);
                    track('form_imagen', Object.assign({ resultado: 'ok' }, datos));
                    return r;
                } catch (err) {
                    track('form_imagen', Object.assign({ resultado: 'error' }, datos));
                    throw err;
                }
            };
        }

        /* Editor de servicios: primera edición de texto */
        const editor = document.getElementById('services-editor');
        if (editor) {
            editor.addEventListener('input', function () {
                if (limitado('servicios_editar', 1)) track('servicios_editar');
            });
        }
    }

    /* --- Buscador por geolocalización --- */
    envolver('buscarPorUbicacion', function () {
        const inp = document.getElementById('umbral-km');
        track('search_proveedor', { radio_km: inp ? parseFloat(inp.value) || null : null });
    });
    const radio = () => (typeof ultimoUmbralKm !== 'undefined' ? ultimoUmbralKm : null);
    envolver('mostrarModalResultados', function (zonas) {
        track('search_resultados', { radio_km: radio(), cantidad: zonas ? zonas.length : 0 });
    });
    envolver('mostrarModalSinResultados', function () {
        track('search_sin_resultados', { radio_km: radio() });
    });
    envolver('mostrarModalError', function (mensaje) {
        track('search_error', { motivo: String(mensaje || '').slice(0, 60) });
    });

    /* --- Selector de localidades / barrios ---
       El <select> se crea dentro del modal cada vez que se abre, así que se
       reemplaza su onchange inline para medir ANTES de navegar. */
    const contModal = document.getElementById('modal-content');
    if (contModal) {
        new MutationObserver(function () {
            const sel = contModal.querySelector('select#localidades, select#barrios');
            if (!sel || sel.dataset.tk) return;
            sel.dataset.tk = '1';
            sel.removeAttribute('onchange');
            sel.onchange = function () {
                const v = this.value;
                if (!v) return;
                const opt = this.selectedOptions[0];
                const destino = new URL(v, location.href).pathname.replace(/^\//, '').replace(/\.html$/, '');
                track('select_zona', {
                    origen: this.id,
                    destino: destino,
                    destino_con_anunciante: (opt && opt.textContent.trim().startsWith('✔')) ? 'si' : 'no'
                });
                setTimeout(function () { window.location.href = v; }, 250);
            };
        }).observe(contModal, { childList: true, subtree: true });
    }

    /* --- Galería y compartir --- */
    envolver('abrirModalGaleria', function () { track('galeria_abrir'); });
    envolver('cambiarModal', function () { if (limitado('galeria_navegar', 10)) track('galeria_navegar', { origen: 'ampliada' }); });
    envolver('compartirSeccion', function () {
        track('share', { metodo: navigator.share ? 'web_share' : 'copiar_link' });
    });
});
