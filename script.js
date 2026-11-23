/**
 * ==============================================================================
 * MATERMED - PORTAL WEB QUIRÚRGICO UNIFICADO (SCRIPT MAESTRO)
 * Diseño Web II (SIS-0141) • UPDS 2026 • Ing. Miguel Angel Cruz Ramos
 *
 * Arquitectura de Vista Única:
 * - #loginScreen: Inicio de sesión (medico, trabajador, admin).
 * - #appContent: Vista única unificada cuyo núcleo es el Catálogo de Suturas.
 * - Al iniciar sesión con cualquier usuario, solo cambia el nombre y rol
 *   mostrado en el navbar/barra de sesión; todas las funciones permanecen visibles.
 * ==============================================================================
 */

const APP_STATE = {
  currentRole: null,
  catalogo: [],
  categoriaActiva: 'todos',
  busquedaTexto: '',
  paginaCatalogo: 1,
  porPagina: 3,
  productoCalculador: { nombre: 'Medileben Poliglactina 910 Trenzada', precio: 175 },
  carrito: [
    { nombre: 'Medileben Poliglactina 910 Trenzada', precio: 175, cantidad: 1 }
  ],
  temporizadorModal: null,
  segundosRestantes: 30
};

const CREDENCIALES = {
  cliente: '123456',
  admin: '123456',
  administrador: '123456'
};

const ROL_MAP = {
  cliente: 'cliente',
  admin: 'admin',
  administrador: 'admin'
};

const ROLES_INFO = {
  cliente: {
    icon: '🛒',
    name: 'Médico / Cliente MEDILEBEN',
    pillText: '🛒 Vista Cliente',
    pillClass: 'role-medico'
  },
  admin: {
    icon: '🛡️',
    name: 'Administrador MEDILEBEN',
    pillText: '🛡️ Vista Administrador',
    pillClass: 'role-admin'
  }
};

const DATOS_CASCADA = {
  cardio: {
    planos: [
      { id: 'vasos', label: 'Anastomosis de Grandes Vasos', sutura: 'Polipropileno (Prolene) 5-0 o 6-0 con doble aguja vascular' },
      { id: 'pericardio', label: 'Cierre Pericárdico y Valvular', sutura: 'Polidioxanona (PDS) o Poliglactina 910' }
    ]
  },
  plastica: {
    planos: [
      { id: 'subdermico', label: 'Cierre Subdérmico Estético', sutura: 'Poliglactina 910 4-0 aguja triangular cortante' },
      { id: 'epidermico', label: 'Sutura Epidérmica Cutánea', sutura: 'Nylon Quirúrgico 5-0 o 6-0 monofilamento' }
    ]
  },
  general: {
    planos: [
      { id: 'aponeurosis', label: 'Fascia Muscular y Aponeurosis', sutura: 'Polidioxanona (PDS) o Poliglactina 910 Calibre 1' },
      { id: 'gastro', label: 'Anastomosis Gastrointestinal', sutura: 'Seda Quirúrgica 3-0 o Catgut Crómico 2-0' }
    ]
  },
  ginecologia: {
    planos: [
      { id: 'utero', label: 'Histerorrafia (Cesárea)', sutura: 'Catgut Crómico 1 o Poliglactina 910 Calibre 1' },
      { id: 'mucosa', label: 'Episiotomía / Mucosa Vaginal', sutura: 'Catgut Crómico 2-0 o Poliglactina 910 2-0' }
    ]
  }
};

// Respaldo offline si se abre directamente sin servidor HTTP
const FALLBACK_SUTURAS = [
    {
        "id":  "MED-001",
        "titulo":  "Medileben Poliglactina 910 Trenzada",
        "tipo":  "Absorbible Sintética Trenzada",
        "genero":  "Cirugía General",
        "calibre":  "USP 2-0 (Caja x12)",
        "precio":  175,
        "portada":  "images/poliglactina.svg",
        "descripcion":  "Sutura absorbible estéril recubierta para aproximación de tejidos blandos (56-70 días).",
        "created_at":  "2026-11-23T12:25:55.368354+00:00"
    },
    {
        "id":  "MED-002",
        "titulo":  "Medileben Nylon Monofilamento Dérmico",
        "tipo":  "No Absorbible Monofilamento",
        "genero":  "Cirugía Plástica",
        "calibre":  "USP 4-0 (Caja x12)",
        "precio":  120,
        "portada":  "images/nylon.svg",
        "descripcion":  "Monofilamento de poliamida con aguja reverso cortante para cierre cutáneo estético.",
        "created_at":  "2026-11-23T12:25:55.368354+00:00"
    },
    {
        "id":  "MED-003",
        "titulo":  "Medileben Polipropileno Vascular",
        "tipo":  "No Absorbible Monofilamento",
        "genero":  "Cirugía Cardiovascular",
        "calibre":  "USP 5-0 (Caja x12)",
        "precio":  205,
        "portada":  "images/polipropileno.svg",
        "descripcion":  "Doble aguja ahusada cardiovascular con resistencia tensil indefinida.",
        "created_at":  "2026-11-23T12:25:55.368354+00:00"
    },
    {
        "id":  "MED-004",
        "titulo":  "Medileben Seda Negra Trenzada Siliconada",
        "tipo":  "No Absorbible Natural",
        "genero":  "Cirugía General",
        "calibre":  "USP 0 (Caja x12)",
        "precio":  115,
        "portada":  "images/seda.svg",
        "descripcion":  "Fibras naturales de seda trenzada con recubrimiento siliconado de paso suave.",
        "created_at":  "2026-11-23T12:25:55.368354+00:00"
    },
    {
        "id":  "MED-005",
        "titulo":  "Medileben Catgut Crómico Ginecológico",
        "tipo":  "Absorbible Natural",
        "genero":  "Ginecología \u0026 Obstetricia",
        "calibre":  "USP 1 (Caja x12)",
        "precio":  145,
        "portada":  "images/catgut.svg",
        "descripcion":  "Tratado con sales de cromo para absorción prolongada en histerorrafia y mucosas.",
        "created_at":  "2026-11-23T12:25:55.368354+00:00"
    },
    {
        "id":  "MED-006",
        "titulo":  "Medileben Polidioxanona Monofilamento PDS",
        "tipo":  "Absorbible Sintética Monofilamento",
        "genero":  "Cirugía General",
        "calibre":  "USP 1 (Caja x12)",
        "precio":  235,
        "portada":  "images/polidioxanona.svg",
        "descripcion":  "Soporte prolongado de heridas fasciales y aponeurosis hasta por 6 semanas.",
        "created_at":  "2026-11-23T12:25:55.368354+00:00"
    }
]
;

// ==============================================================================
// 0. CONFIGURACIÓN SUPABASE REST API (PROYECTO: diseno-web-ii)
// ==============================================================================
const SUPABASE_URL = 'https://urvevemsosutoaexikpw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydmV2ZW1zb3N1dG9hZXhpa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyMjY3OTEsImV4cCI6MjExMDgwMjc5MX0.SnA1-iZxacnY3ylKUti5sdtA18336vvGUCCgKVQSVsQ';
const SUPABASE_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// ==============================================================================
// 1. REGISTRO SERVICE WORKER, INSTALACIÓN PWA Y DOMPURIFY
// ==============================================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[SW MATERMED] Registrado:', reg.scope))
      .catch(err => console.warn('[SW MATERMED] Registro omitido:', err));
  });
}

let eventoInstalacion;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalacion = e;
  const btnInstalar = document.getElementById('btnInstalarPWA');
  if (btnInstalar) btnInstalar.hidden = false;
});

function renderizarDetalleSeguro(htmlDesdeServidor) {
  if (typeof DOMPurify !== 'undefined') {
    const limpio = DOMPurify.sanitize(htmlDesdeServidor);
    $('#detalleProyecto').html(limpio);
  } else {
    $('#detalleProyecto').text(htmlDesdeServidor);
  }
}

function actualizarEstadoRedPC() {
  const $net = $('#estadoRedPC');
  if (!$net.length) return;
  if (navigator.onLine) {
    $net.text('🟢 En Línea').removeClass('offline');
  } else {
    $net.text('🟠 Modo Offline').addClass('offline');
  }
}

// ==============================================================================
// 2. AUTENTICACIÓN CON SUPABASE (public.usuarios_matermed) Y VISTAS CLIENTE / ADMIN
// ==============================================================================
async function intentarLogin(usuario, password) {
  const u = (usuario || '').trim().toLowerCase();
  const p = (password || '').trim();
  if (!u || !p) return false;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios_matermed?usuario=eq.${encodeURIComponent(u)}&password=eq.${encodeURIComponent(p)}&select=*`,
      { headers: SUPABASE_HEADERS }
    );
    if (res.ok) {
      const filas = await res.json();
      if (filas && filas.length > 0) {
        iniciarSesion(filas[0].rol);
        return true;
      }
    }
  } catch (_) {
    // Fallback offline si no hay internet
  }

  if (CREDENCIALES[u] && CREDENCIALES[u] === p) {
    iniciarSesion(ROL_MAP[u]);
    return true;
  }
  return false;
}

function esAdminActual() {
  return APP_STATE.currentRole === 'admin';
}

function iniciarSesion(rol) {
  if (!ROLES_INFO[rol]) rol = 'cliente';
  APP_STATE.currentRole = rol;
  localStorage.setItem('medileben_role', rol);
  localStorage.setItem('medileben_rol', rol);
  localStorage.setItem('medileben_nombre', ROLES_INFO[rol].name);

  aplicarPerfilEnNavbar(rol);
  renderizarCatalogo();
  cargarReservasQuirofanoSupabase();

  $('#loginScreen').fadeOut(250, () => {
    $('#appContent').fadeIn(250);
    logEvent('LOGIN_SUPABASE', `Sesión iniciada como ${ROLES_INFO[rol].name} (${rol})`);
  });
}

function cerrarSesion() {
  APP_STATE.currentRole = null;
  localStorage.removeItem('medileben_role');
  localStorage.removeItem('medileben_rol');
  localStorage.removeItem('medileben_nombre');

  $('#appContent').fadeOut(200, () => {
    $('#loginUser').val('');
    $('#loginPass').val('');
    $('#loginError').hide();
    $('#loginScreen').fadeIn(250);
  });
}

function aplicarPerfilEnNavbar(rol) {
  const info = ROLES_INFO[rol] || ROLES_INFO.cliente;
  $('#roleIcon').text(info.icon);
  $('#roleCurrentName').text(info.name);
  $('#navbarRolePill')
    .text(info.pillText)
    .removeClass('role-medico role-trabajador role-admin')
    .addClass(info.pillClass);

  // Permisos de Vista: solo 'admin' puede editar o eliminar en el Catálogo y BD
  $('#panelCrearSuturaCatalogo').hide();
  $('#panelExplorarCatalogo').show();
}

// ==============================================================================
// 3. CATÁLOGO ASÍNCRONO (FETCH JSON + LAZY LOADING + FILTROS + BÚSQUEDA)
// ==============================================================================
function obtenerCategoriaFiltro(item) {
  const genero = (item.genero || '').toLowerCase();
  const tipo = (item.tipo || '').toLowerCase();
  if (genero.includes('cardiovascular')) return 'cardio';
  if (tipo.includes('no absorbible')) return 'no-absorbible';
  return 'absorbible';
}

function cargarCatalogoAsync() {
  fetch(`${SUPABASE_URL}/rest/v1/catalogo_medileben?select=*&order=id.asc`, { headers: SUPABASE_HEADERS })
    .then(res => {
      if (!res.ok) throw new Error('Error Supabase ' + res.status);
      return res.json();
    })
    .then(data => {
      if (!data || !data.length) throw new Error('Tabla vacía');
      APP_STATE.catalogo = data;
      renderizarCatalogo();
      renderizarDetalleSeguro(`<strong>Supabase Conectado:</strong> ${data.length} productos sincronizados desde <code>public.catalogo_medileben</code>.`);
      logEvent('SUPABASE_SELECT', `${data.length} suturas cargadas desde Postgres`);
    })
    .catch(() => {
      fetch('data/suturas.json')
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          APP_STATE.catalogo = data;
          renderizarCatalogo();
          logEvent('CATALOGO_FETCH', `${data.length} suturas cargadas desde suturas.json`);
        })
        .catch(() => {
          APP_STATE.catalogo = FALLBACK_SUTURAS;
          renderizarCatalogo();
          logEvent('CATALOGO_OFFLINE', `${FALLBACK_SUTURAS.length} suturas cargadas en modo local`);
        });
    });

  // Cargar reservas de quirófano desde Supabase (CRUD con botón eliminar)
  cargarReservasQuirofanoSupabase();
}

function cargarReservasQuirofanoSupabase() {
  fetch(`${SUPABASE_URL}/rest/v1/reservas_quirofano?select=*&order=created_at.desc&limit=10`, { headers: SUPABASE_HEADERS })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(turnos => {
      if (turnos && turnos.length) {
        $('#listaReservas').empty();
        turnos.forEach(t => {
          const $item = $('<li>').addClass('item-reserva').attr('data-id', t.id).css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px'
          });
          const $info = $('<div>').css({ flex: 1, minWidth: 0 }).append(
            $('<strong>').text(`${t.cirujano} — `),
            $('<span>').text(t.sala)
          );
          const $btnDel = $('<button>').attr({ type: 'button', title: 'Eliminar reserva de Supabase' })
            .addClass('btn-tactil btn-eliminar-quirofano')
            .css({ background: '#fee2e2', color: '#dc2626', minWidth: '36px', minHeight: '36px', padding: '0 10px' })
            .text('✕');
          $item.append($info, $btnDel);
          $('#listaReservas').append($item);
        });
      }
      const $cotList = $('#listaCotizacionesSupabase');
      if ($cotList.length) {
        $cotList.empty();
        $('#countCotizacionesSupa').text(turnos ? turnos.length : 0);
        if (!turnos || !turnos.length) {
          $cotList.append($('<li>').addClass('item-reserva').text('Aún no hay cotizaciones guardadas en Supabase.'));
        } else {
          turnos.forEach(t => {
            const $li = $('<li>').addClass('item-reserva').attr('data-id', t.id).css({
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'
            });
            $li.append(
              $('<div>').css({ flex: 1, minWidth: 0 }).append(
                $('<strong>').text(`🛒 ${t.cirujano} — `),
                $('<span>').text(t.sala)
              )
            );
            if (esAdminActual()) {
              $li.append(
                $('<button>').attr({ type: 'button', title: 'Eliminar cotización de Supabase (Solo Admin)' })
                  .addClass('btn-tactil btn-eliminar-quirofano')
                  .css({ background: '#fee2e2', color: '#dc2626', minWidth: '36px', minHeight: '36px', padding: '0 10px' })
                  .text('✕')
              );
            }
            $cotList.append($li);
          });
        }
      }
    })
    .catch(() => {});
}

function agregarItemAlCarrito(nombre, precio, cantidad) {
  const cant = Math.max(1, parseInt(cantidad, 10) || 1);
  const prec = parseFloat(precio) || 180;
  const existente = APP_STATE.carrito.find(x => x.nombre === nombre);
  if (existente) {
    existente.cantidad += cant;
  } else {
    APP_STATE.carrito.push({ nombre, precio: prec, cantidad: cant });
  }
  APP_STATE.productoCalculador = { nombre, precio: prec };
  $('#nombreProductoCalc').text(`${nombre} (${prec} BOB/caja)`);
  renderizarCarritoCotizacion();
}

function renderizarCarritoCotizacion() {
  const $lista = $('#listaCarritoCotizacion');
  if (!$lista.length) return;
  $lista.empty();

  let totalCajas = 0;
  let totalBob = 0;

  if (!APP_STATE.carrito.length) {
    $lista.append($('<div>').addClass('item-reserva').css({ color: 'var(--text-muted)', textAlign: 'center' })
      .text('🛒 Tu carrito de cotización está vacío. Elige un producto del catálogo o del selector superior.'));
    $('#total').text('0');
    $('#badgeCarrito').text('0');
    return;
  }

  APP_STATE.carrito.forEach((item, idx) => {
    const sub = item.cantidad * item.precio;
    totalCajas += item.cantidad;
    totalBob += sub;

    const $row = $('<div>').addClass('item-reserva').css({
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap'
    });
    const $info = $('<div>').css({ flex: 1, minWidth: '140px' }).append(
      $('<strong>').text(item.nombre),
      $('<span>').css({ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block' })
        .text(`${item.cantidad} caja(s) × ${item.precio} BOB = ${sub} BOB`)
    );
    const $ctrls = $('<div>').css({ display: 'flex', alignItems: 'center', gap: '6px' }).append(
      $('<button type="button" class="btn-stock-qty btn-restar-carrito">−</button>').attr('data-idx', idx),
      $('<strong>').css({ minWidth: '22px', textAlign: 'center' }).text(item.cantidad),
      $('<button type="button" class="btn-stock-qty btn-sumar-carrito">+</button>').attr('data-idx', idx),
      $('<button type="button" class="btn-stock-qty btn-quitar-carrito" style="background:#fee2e2;color:#dc2626;border-color:#fca5a5;">✕</button>').attr('data-idx', idx)
    );
    $row.append($info, $ctrls);
    $lista.append($row);
  });

  $('#total').text(totalBob);
  $('#badgeCarrito').text(totalCajas);
}

// Validación reutilizable: Nombre, Celular (exactamente 8 dígitos) y Fecha (hoy hasta +1 mes)
function actualizarEstadoCampoUnificado($msg, $inputs, esValido, texto) {
  $msg.removeClass('oculto msg-error msg-exito').addClass(esValido ? 'msg-exito' : 'msg-error').text(texto);
  $inputs.removeClass('input-invalido input-valido').addClass(esValido ? 'input-valido' : 'input-invalido');
}

function validarNombreUnificado($input, $msg, mostrarVacio = false) {
  const val = ($input.val() || '').trim();
  if (!val) {
    if (mostrarVacio) actualizarEstadoCampoUnificado($msg, $input, false, '⚠️ Este campo de nombre es obligatorio.');
    else { $msg.addClass('oculto'); $input.removeClass('input-invalido input-valido'); }
    return false;
  }
  if (val.length < 3 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü.\s]+$/.test(val)) {
    actualizarEstadoCampoUnificado($msg, $input, false, '⚠️ Ingrese un nombre válido (solo letras, mín. 3 caracteres).');
    return false;
  }
  actualizarEstadoCampoUnificado($msg, $input, true, '✓ Nombre válido.');
  return true;
}

function validarCelularUnificado($input, $msg, mostrarVacio = false) {
  const val = ($input.val() || '').trim();
  if (!val) {
    if (mostrarVacio) actualizarEstadoCampoUnificado($msg, $input, false, '⚠️ El número de celular es obligatorio.');
    else { $msg.addClass('oculto'); $input.removeClass('input-invalido input-valido'); }
    return false;
  }
  if (!/^\d+$/.test(val)) {
    actualizarEstadoCampoUnificado($msg, $input, false, '⚠️ Solo se permiten números (sin espacios ni letras).');
    return false;
  }
  if (val.length !== 8) {
    actualizarEstadoCampoUnificado($msg, $input, false, `⚠️ El celular debe tener exactamente 8 dígitos (tienes ${val.length}).`);
    return false;
  }
  actualizarEstadoCampoUnificado($msg, $input, true, '✓ Número de celular válido (8 dígitos).');
  return true;
}

function validarFechaRangoMesUnificado($d, $m, $a, $msg, mostrarVacio = false) {
  const $todos = $d.add($m).add($a);
  const dStr = ($d.val() || '').trim();
  const mStr = ($m.val() || '').trim();
  const aStr = ($a.val() || '').trim();

  if (!dStr && !mStr && !aStr) {
    if (mostrarVacio) actualizarEstadoCampoUnificado($msg, $todos, false, '⚠️ La fecha (Día, Mes y Año) es obligatoria.');
    else { $msg.addClass('oculto'); $todos.removeClass('input-invalido input-valido'); }
    return false;
  }
  if (!dStr || !mStr || !aStr) {
    actualizarEstadoCampoUnificado($msg, $todos, false, '⚠️ Complete Día, Mes y Año.');
    return false;
  }

  const d = parseInt(dStr, 10);
  const m = parseInt(mStr, 10);
  const a = parseInt(aStr, 10);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const anioActual = hoy.getFullYear();

  if (isNaN(a) || a < anioActual || a > anioActual + 1) {
    actualizarEstadoCampoUnificado($msg, $a, false, `⚠️ El Año debe ser ${anioActual} o ${anioActual + 1} (no años pasados como 1950).`);
    return false;
  }
  if (isNaN(m) || m < 1 || m > 12) {
    actualizarEstadoCampoUnificado($msg, $m, false, '⚠️ El Mes debe estar entre 1 y 12.');
    return false;
  }
  const maxDias = new Date(a, m, 0).getDate();
  if (isNaN(d) || d < 1 || d > maxDias) {
    actualizarEstadoCampoUnificado($msg, $d, false, `⚠️ Día inválido: ese mes tiene máximo ${maxDias} días.`);
    return false;
  }

  const fechaIngresada = new Date(a, m - 1, d);
  fechaIngresada.setHours(0, 0, 0, 0);
  const maxFecha = new Date(hoy);
  maxFecha.setMonth(maxFecha.getMonth() + 1);

  if (fechaIngresada < hoy) {
    actualizarEstadoCampoUnificado($msg, $todos, false, '⚠️ No puedes seleccionar una fecha pasada.');
    return false;
  }
  if (fechaIngresada > maxFecha) {
    const limiteStr = `${String(maxFecha.getDate()).padStart(2, '0')}/${String(maxFecha.getMonth() + 1).padStart(2, '0')}/${maxFecha.getFullYear()}`;
    actualizarEstadoCampoUnificado($msg, $todos, false, `⚠️ La fecha debe estar dentro del rango de 1 mes (máximo hasta el ${limiteStr}).`);
    return false;
  }

  actualizarEstadoCampoUnificado($msg, $todos, true, `✓ Fecha válida (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${a}).`);
  return true;
}

function obtenerUrlDocumentacionSutura(item) {
  if (item.url_info) return item.url_info;
  const t = ((item.titulo || '') + ' ' + (item.tipo || '')).toLowerCase();
  if (t.includes('chocolate') || t.includes('cacao') || t.includes('trufa')) return 'https://es.wikipedia.org/wiki/Chocolate';
  if (t.includes('gomita') || t.includes('osito')) return 'https://es.wikipedia.org/wiki/Gominola';
  if (t.includes('caramelo') || t.includes('miel')) return 'https://es.wikipedia.org/wiki/Caramelo';
  if (t.includes('fricas')) return 'https://es.wikipedia.org/wiki/Fricas%C3%A9';
  if (t.includes('charque')) return 'https://es.wikipedia.org/wiki/Charqui';
  if (t.includes('salte') || t.includes('combo')) return 'https://es.wikipedia.org/wiki/Salte%C3%B1a';
  if (t.includes('aceite') || t.includes('girasol')) return 'https://es.wikipedia.org/wiki/Aceite_de_girasol';
  if (t.includes('arroz')) return 'https://es.wikipedia.org/wiki/Arroz';
  if (t.includes('leche')) return 'https://es.wikipedia.org/wiki/Leche';
  if (t.includes('queso') || t.includes('edam')) return 'https://es.wikipedia.org/wiki/Queso_Edam';
  if (t.includes('gaseosa') || t.includes('refresco')) return 'https://es.wikipedia.org/wiki/Bebida_carbonatada';
  if (t.includes('detergente')) return 'https://es.wikipedia.org/wiki/Detergente';
  if (t.includes('poliglactina') || t.includes('vicryl')) return 'https://es.wikipedia.org/wiki/Poliglactina_910';
  if (t.includes('nylon') || t.includes('poliamida')) return 'https://es.wikipedia.org/wiki/Nailon';
  if (t.includes('polipropileno') || t.includes('prolene')) return 'https://es.wikipedia.org/wiki/Polipropileno';
  if (t.includes('seda')) return 'https://es.wikipedia.org/wiki/Seda';
  if (t.includes('catgut')) return 'https://es.wikipedia.org/wiki/Catgut';
  if (t.includes('polidioxanona') || t.includes('pds')) return 'https://es.wikipedia.org/wiki/Polidioxanona';
  return 'https://es.wikipedia.org/wiki/Hilo_de_sutura';
}

function abrirModalDetalleSutura(item) {
  if (!item) return;
  const precio = parseFloat(item.precio) || 180;
  const urlDoc = obtenerUrlDocumentacionSutura(item);

  $('#zoomImgSutura').attr({
    src: item.portada || 'images/poliglactina.svg',
    alt: item.titulo || 'Sutura Quirúrgica'
  });
  $('#zoomTagSutura').text(item.tipo || 'Sutura Quirúrgica');
  $('#zoomTituloSutura').text(item.titulo || 'Sutura');
  $('#zoomGeneroSutura').text(item.genero || 'Cirugía General');
  $('#zoomCalibreSutura').text(item.calibre || 'USP 2-0');
  $('#zoomPrecioSutura').text(`${precio} BOB / caja`);
  $('#zoomDescSutura').text(item.descripcion || 'Sutura quirúrgica estéril de grado hospitalario.');
  $('#zoomLinkInfoSutura')
    .attr('href', urlDoc)
    .text(`🌐 Ver información completa de ${item.titulo} (${urlDoc}) ↗`);

  $('#btnZoomAgregarCarrito')
    .data('nombre', item.titulo)
    .data('precio', precio);

  $('#modalDetalleSutura').fadeIn(200).css('display', 'flex');
  logEvent('ZOOM_SUTURA', `Ficha ampliada: ${item.titulo}`);
}
function poblarSelectCotizadorSupabase() {
  const $sel = $('#selectSuturaCalc');
  if (!$sel.length || !APP_STATE.catalogo.length) return;
  $sel.empty();
  APP_STATE.catalogo.forEach(item => {
    const precio = parseFloat(item.precio) || 180;
    const $opt = $('<option>')
      .val(precio)
      .attr('data-id', item.id)
      .attr('data-nombre', item.titulo)
      .text(`${item.titulo} (${item.calibre || 'USP'}) — ${precio} BOB/caja`);
    $sel.append($opt);
  });
  const primero = APP_STATE.catalogo[0];
  if (primero) {
    APP_STATE.productoCalculador = { nombre: primero.titulo, precio: parseFloat(primero.precio) || 180 };
    $('#nombreProductoCalc').text(`${primero.titulo} (${APP_STATE.productoCalculador.precio} BOB/caja)`);
    const cant = parseInt($('#hrs').val(), 10) || 1;
    $('#total').text(cant * APP_STATE.productoCalculador.precio);
  }
}

function renderizarCatalogo() {
  poblarSelectCotizadorSupabase();
  $('#countSuturasCat').text(APP_STATE.catalogo.length);
  const $grid = $('#suturasGrid');
  $grid.empty();

  const texto = APP_STATE.busquedaTexto.toLowerCase();
  const catFiltro = APP_STATE.categoriaActiva;

  const filtradas = APP_STATE.catalogo.filter(item => {
    const cat = obtenerCategoriaFiltro(item);
    const coincideCat = catFiltro === 'todos' || cat === catFiltro;
    const textoItem = `${item.titulo} ${item.genero} ${item.calibre} ${item.tipo}`.toLowerCase();
    const coincideTexto = !texto || textoItem.includes(texto);
    return coincideCat && coincideTexto;
  });

  if (filtradas.length === 0) {
    $grid.append($('<p>').css({ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '24px' })
      .text('No se encontraron productos que coincidan con el filtro actual.'));
    $('#paginadorSuturas').hide();
    return;
  }

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / APP_STATE.porPagina));
  if (APP_STATE.paginaCatalogo > totalPaginas) APP_STATE.paginaCatalogo = totalPaginas;
  if (APP_STATE.paginaCatalogo < 1) APP_STATE.paginaCatalogo = 1;

  const inicio = (APP_STATE.paginaCatalogo - 1) * APP_STATE.porPagina;
  const paginaItems = filtradas.slice(inicio, inicio + APP_STATE.porPagina);

  $('#paginadorSuturas').css('display', totalPaginas > 1 ? 'flex' : 'none');
  $('#infoPagSuturas').text(`Página ${APP_STATE.paginaCatalogo} de ${totalPaginas}`);
  $('#btnPrevSuturas').prop('disabled', APP_STATE.paginaCatalogo <= 1);
  $('#btnNextSuturas').prop('disabled', APP_STATE.paginaCatalogo >= totalPaginas);

  paginaItems.forEach(item => {
    const cat = obtenerCategoriaFiltro(item);
    const tagClass = cat === 'cardio' ? 'tag-cardio' : (cat === 'no-absorbible' ? 'tag-no-absorbible' : 'tag-absorbible');

    const $card = $('<article>').addClass('card card-item tarjeta-ods').attr('data-categoria', cat);
    const $imgWrap = $('<div>')
      .addClass('card-img-wrap btn-ver-detalle-sutura')
      .css({ cursor: 'zoom-in', position: 'relative' })
      .attr('title', 'Haz clic para ampliar la imagen y ver la información completa')
      .data('item', item);
    const $img = $('<img>').addClass('tarjeta-ods__imagen').attr({
      src: item.portada || 'images/poliglactina.svg',
      alt: item.titulo,
      width: 220,
      height: 130,
      loading: 'lazy'
    }).on('error', function () {
      if (!$(this).data('fallback')) {
        $(this).data('fallback', true).attr('src', 'images/poliglactina.svg');
      }
    });
    const $zoomHint = $('<span>')
      .css({
        position: 'absolute', bottom: '6px', right: '8px',
        background: 'rgba(15,23,42,0.72)', color: '#fff',
        fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '10px'
      })
      .text('🔍 Ampliar');
    $imgWrap.append($img, $zoomHint);

    const $body = $('<div>').addClass('card-body card-cuerpo');
    const $tag = $('<span>').addClass(`card-tag ${tagClass}`).text(item.tipo || 'Sutura Quirúrgica');
    const $title = $('<h3>').addClass('card-title').text(item.titulo);
    const $meta = $('<small>').css({ color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' })
      .text(`${item.genero || 'General'} • ${item.calibre || 'USP 2-0'}`);
    const $desc = $('<p>').addClass('card-text').text(item.descripcion || '');
    const $linkInfo = $('<a>')
      .attr({
        href: obtenerUrlDocumentacionSutura(item),
        target: '_blank',
        rel: 'noopener noreferrer'
      })
      .css({ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px', textDecoration: 'underline', display: 'inline-block' })
      .text('🔗 Ver más información del producto ↗');
    const $price = $('<div>').addClass('card-price').text(`${item.precio} BOB / caja`);
    const $btnAdd = $('<button>')
      .attr('type', 'button')
      .addClass('btn-card btn-cotizar-card tarjeta-ods__boton--destacado')
      .css({ flex: 1 })
      .data('nombre', item.titulo)
      .data('precio', item.precio)
      .text('🛒 Agregar a Cotización');

    const $btnZoom = $('<button>')
      .attr({ type: 'button', title: 'Ampliar imagen y ver ficha técnica' })
      .addClass('btn-tactil btn-ver-detalle-sutura')
      .css({ background: '#f1f5f9', color: '#0f172a', border: '1px solid var(--border-color)' })
      .data('item', item)
      .text('🔍');

    const $btnEdit = $('<button>')
      .attr({ type: 'button', title: 'Editar precio en Supabase' })
      .addClass('btn-tactil btn-editar-sutura-cat')
      .css({ background: '#e0f2fe', color: '#0369a1' })
      .attr('data-id', item.id)
      .attr('data-nombre', item.titulo)
      .attr('data-precio', item.precio)
      .text('✏️');

    const $btnDel = $('<button>')
      .attr({ type: 'button', title: 'Eliminar sutura del catálogo Supabase' })
      .addClass('btn-tactil btn-eliminar-sutura-cat')
      .css({ background: '#fee2e2', color: '#dc2626' })
      .attr('data-id', item.id)
      .attr('data-nombre', item.titulo)
      .text('🗑️');

    const $actionsRow = $('<div>').css({ display: 'flex', gap: '6px', alignItems: 'center' })
      .append($btnAdd, $btnZoom);

    if (esAdminActual()) {
      $actionsRow.append($btnEdit, $btnDel);
    }

    $body.append($tag, $title, $meta, $desc, $linkInfo, $price, $actionsRow);
    $card.append($imgWrap, $body);
    $grid.append($card);
  });
}

// ==============================================================================
// 4. INICIALIZACIÓN Y EVENTOS DELEGADOS (.off().on())
// ==============================================================================
$(document).ready(function () {
  actualizarEstadoRedPC();
  $(window).off('online offline').on('online offline', actualizarEstadoRedPC);

  // Recuperar sesión activa si ya inició
  const rolGuardado = localStorage.getItem('medileben_role') || localStorage.getItem('medileben_rol');
  if (rolGuardado && ROLES_INFO[rolGuardado]) {
    APP_STATE.currentRole = rolGuardado;
    aplicarPerfilEnNavbar(rolGuardado);
    $('#loginScreen').hide();
    $('#appContent').show();
  }

  // Cargar catálogo asíncrono
  cargarCatalogoAsync();

  // Botón Instalar PWA
  $('#btnInstalarPWA').off('click').on('click', async function () {
    if (!eventoInstalacion) return;
    eventoInstalacion.prompt();
    await eventoInstalacion.userChoice;
    this.hidden = true;
    logEvent('PWA_INSTALL', 'Instalación PWA solicitada');
  });

  // Simulaciones Semana 3: Alto Contraste, Vista Móvil/Escritorio y Auditoría A11Y
  $('#btnSimularContraste').off('click').on('click', function () {
    document.body.classList.toggle('alto-contraste');
    logEvent('A11Y_CONTRASTE', document.body.classList.contains('alto-contraste') ? 'Alto Contraste ON' : 'Alto Contraste OFF');
  });

  $('#btnSimularVista').off('click').on('click', function () {
    const grid = document.querySelector('.catalogo-grid');
    if (grid) {
      grid.classList.toggle('sim-movil');
      logEvent('LAYOUT_SIM', grid.classList.contains('sim-movil') ? 'Simulación Móvil (1 col)' : 'Simulación Escritorio');
    }
  });

  $('#btnAuditarA11Y').off('click').on('click', function () {
    const zonas = document.querySelectorAll('header, nav, main, article, footer').length;
    const sinAlt = document.querySelectorAll('img:not([alt]), img[alt=""]').length;
    const rep = document.getElementById('reporteA11Y');
    if (rep) {
      rep.textContent = `Auditoría en vivo: ${zonas} etiquetas semánticas HTML5 detectadas | Imágenes sin alt: ${sinAlt}.`;
    }
    logEvent('AUDITORIA_A11Y', `${zonas} etiquetas semánticas | sin alt: ${sinAlt}`);
  });

  // Navegación por vistas mediante botones (sin scrolling largo)
  function mostrarVistaUnificado(destino) {
    $('.dock-btn').removeClass('activo');
    $('#navMenu a').removeClass('active');
    $('#inicio, #catalogo, .catalog-toolbar, #cascada, #seccionCotizadorReserva, #calculador, #reservaXSS, #seccionColaBitacora, #colaQuirurgica, #bitacora, #contacto, footer').hide();

    if (!destino || destino === '#catalogo' || destino === '#inicio') {
      $('#catalogo, .catalog-toolbar').fadeIn(200);
      $('.dock-btn[data-scroll="#catalogo"]').addClass('activo');
      $('#navMenu a[href="#catalogo"]').addClass('active');
    } else if (destino === '#calculador') {
      $('#seccionCotizadorReserva, #calculador').fadeIn(200);
      $('.dock-btn[data-scroll="#calculador"]').addClass('activo');
      $('#navMenu a[href="#calculador"]').addClass('active');
    } else if (destino === '#reservaXSS') {
      $('#seccionCotizadorReserva, #reservaXSS').fadeIn(200);
      $('.dock-btn[data-scroll="#reservaXSS"]').addClass('activo');
      $('#navMenu a[href="#reservaXSS"]').addClass('active');
    } else if (destino === '#bitacora') {
      $('#seccionColaBitacora, #bitacora').fadeIn(200);
      $('.dock-btn[data-scroll="#bitacora"]').addClass('activo');
      $('#navMenu a[href="#bitacora"]').addClass('active');
    } else if (destino === '#contacto') {
      $('#contacto').fadeIn(200);
      $('.dock-btn[data-scroll="#contacto"]').addClass('activo');
      $('#navMenu a[href="#contacto"]').addClass('active');
    } else if (destino === '#cascada') {
      $('#cascada').removeAttr('hidden').fadeIn(200);
    } else if (destino === '#colaQuirurgica') {
      $('#seccionColaBitacora, #colaQuirurgica').removeAttr('hidden').fadeIn(200);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('#btnPrevSuturas').off('click').on('click', function () {
    if (APP_STATE.paginaCatalogo > 1) {
      APP_STATE.paginaCatalogo--;
      renderizarCatalogo();
    }
  });

  $('#btnNextSuturas').off('click').on('click', function () {
    APP_STATE.paginaCatalogo++;
    renderizarCatalogo();
  });

  $(document).off('click', '.dock-btn').on('click', '.dock-btn', function () {
    const destino = $(this).attr('data-scroll');
    mostrarVistaUnificado(destino);
  });

  $(document).off('click', '.brand-wrapper').on('click', '.brand-wrapper', function (e) {
    e.preventDefault();
    mostrarVistaUnificado('#catalogo');
  });

  mostrarVistaUnificado('#catalogo');

  // Login rápido (1 clic)
  $(document).off('click', '.quick-btn').on('click', '.quick-btn', function () {
    iniciarSesion($(this).data('rol'));
  });

  // Login tradicional validado contra public.usuarios_matermed en Supabase
  $('#loginForm').off('submit').on('submit', async function (e) {
    e.preventDefault();
    const u = $('#loginUser').val();
    const p = $('#loginPass').val();
    const ok = await intentarLogin(u, p);
    if (ok) {
      $('#loginError').hide();
    } else {
      $('#loginError')
        .text('⚠️ Credenciales incorrectas. Use: cliente / 123456 o admin / 123456')
        .slideDown();
    }
  });

  // Mostrar/ocultar contraseña
  $('#btnTogglePass').off('click').on('click', function () {
    const $inp = $('#loginPass');
    $inp.attr('type', $inp.attr('type') === 'password' ? 'text' : 'password');
  });

  // Cerrar sesión
  $('#btnLogout').off('click').on('click', cerrarSesion);

  // Menú Hamburguesa
  $('#burguerBtn').off('click').on('click', function () {
    $('#navMenu').toggleClass('show');
  });

  $('#navMenu').off('click', 'a').on('click', 'a', function (e) {
    const href = $(this).attr('href');
    if (window.innerWidth <= 768) $('#navMenu').removeClass('show');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      mostrarVistaUnificado(href);
    }
  });

  // Modo Oscuro / Claro
  $('#themeBtn').off('click').on('click', function () {
    $('body').toggleClass('dark-mode');
    const osc = $('body').hasClass('dark-mode');
    $('#themeIcon').text(osc ? '☀️' : '🌙');
    $('#themeText').text(osc ? 'Modo Claro' : 'Modo Oscuro');
    logEvent('TEMA', osc ? 'Modo Oscuro activado' : 'Modo Claro activado');
  });

  // Filtros de Catálogo (Event Delegation)
  $('#filterBar').off('click', '.filter-btn').on('click', '.filter-btn', function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    APP_STATE.categoriaActiva = $(this).data('cat');
    APP_STATE.paginaCatalogo = 1;
    renderizarCatalogo();
    logEvent('FILTRO_CATALOGO', `Categoría: ${APP_STATE.categoriaActiva}`);
  });

  // Buscador en vivo (keyup)
  $('#buscarSutura').off('keyup').on('keyup', function () {
    APP_STATE.busquedaTexto = $(this).val().trim();
    APP_STATE.paginaCatalogo = 1;
    renderizarCatalogo();
    logEvent('BUSQUEDA_KEYUP', `Término: "${APP_STATE.busquedaTexto}"`);
  });

  // Doble clic en tarjeta de sutura para marcar como favorito (Semana 1 Día 1: dblclick)
  $(document).off('dblclick', '.card-item').on('dblclick', '.card-item', function () {
    const titulo = $(this).find('.card-title, h3').first().text().trim() || 'Sutura';
    mostrarToast(`❤️ Producto marcado como favorito: ${titulo}`);
    logEvent('DBLCLICK_FAV', titulo);
  });

  // Ampliar imagen de sutura y ver ficha + enlace externo al hacer clic en la imagen o botón 🔍
  $('#suturasGrid').off('click', '.btn-ver-detalle-sutura').on('click', '.btn-ver-detalle-sutura', function () {
    const item = $(this).data('item');
    abrirModalDetalleSutura(item);
  });

  $('#btnCerrarZoomSutura, #btnCerrarZoomSutura2').off('click').on('click', function () {
    $('#modalDetalleSutura').fadeOut(200);
  });

  $('#modalDetalleSutura').off('click').on('click', function (e) {
    if (e.target === this) $(this).fadeOut(200);
  });

  $('#btnZoomAgregarCarrito').off('click').on('click', function () {
    const nombre = $(this).data('nombre');
    const precio = parseFloat($(this).data('precio')) || 180;
    $('#modalDetalleSutura').fadeOut(180);
    agregarItemAlCarrito(nombre, precio, 1);
    mostrarToast(`🛒 Añadido al carrito: ${nombre}`);
    mostrarVistaUnificado('#calculador');
  });

  // Seleccionar sutura desde el catálogo para agregarla al carrito de cotización
  $('#suturasGrid').off('click', '.btn-cotizar-card').on('click', '.btn-cotizar-card', function () {
    const nombre = $(this).data('nombre');
    const precio = parseFloat($(this).data('precio')) || 180;
    $('#selectSuturaCalc option').each(function () {
      if ($(this).attr('data-nombre') === nombre) {
        $('#selectSuturaCalc').val($(this).val());
      }
    });
    agregarItemAlCarrito(nombre, precio, 1);
    mostrarToast(`🛒 Añadido al carrito: ${nombre}`);
    renderizarDetalleSeguro(`<strong>Producto añadido a cotización (DOMPurify):</strong> ${nombre} — ${precio} BOB/caja`);
    logEvent('CARRITO_ADD', `${nombre} (${precio} BOB)`);
    mostrarVistaUnificado('#calculador');
  });

  // Selector interactivo de sutura en el Cotizador (alimentado por Supabase)
  $('#selectSuturaCalc').off('change').on('change', function () {
    const $opt = $(this).find('option:selected');
    const nombre = $opt.attr('data-nombre') || $opt.text();
    const precio = parseFloat($(this).val()) || 180;
    APP_STATE.productoCalculador = { nombre, precio };
    $('#nombreProductoCalc').text(`${nombre} (${precio} BOB/caja)`);
    logEvent('COTIZADOR_SELECT_SUPABASE', `${nombre} (${precio} BOB/caja)`);
  });

  $('#btnAgregarAlCarrito').off('click').on('click', function () {
    const $opt = $('#selectSuturaCalc option:selected');
    const nombre = $opt.attr('data-nombre') || APP_STATE.productoCalculador.nombre;
    const precio = parseFloat($opt.val()) || APP_STATE.productoCalculador.precio;
    const cant = Math.max(1, parseInt($('#hrs').val(), 10) || 1);
    agregarItemAlCarrito(nombre, precio, cant);
    mostrarToast(`🛒 +${cant}x ${nombre} añadido al carrito.`);
  });

  $('#listaCarritoCotizacion').off('click', '.btn-sumar-carrito').on('click', '.btn-sumar-carrito', function () {
    const idx = parseInt($(this).attr('data-idx'), 10);
    if (APP_STATE.carrito[idx]) {
      APP_STATE.carrito[idx].cantidad++;
      renderizarCarritoCotizacion();
    }
  });

  $('#listaCarritoCotizacion').off('click', '.btn-restar-carrito').on('click', '.btn-restar-carrito', function () {
    const idx = parseInt($(this).attr('data-idx'), 10);
    if (APP_STATE.carrito[idx]) {
      if (APP_STATE.carrito[idx].cantidad > 1) APP_STATE.carrito[idx].cantidad--;
      else APP_STATE.carrito.splice(idx, 1);
      renderizarCarritoCotizacion();
    }
  });

  $('#listaCarritoCotizacion').off('click', '.btn-quitar-carrito').on('click', '.btn-quitar-carrito', function () {
    const idx = parseInt($(this).attr('data-idx'), 10);
    APP_STATE.carrito.splice(idx, 1);
    renderizarCarritoCotizacion();
  });

  $('#btnVaciarCarrito').off('click').on('click', function () {
    APP_STATE.carrito = [];
    renderizarCarritoCotizacion();
    mostrarToast('🗑️ Carrito vaciado.');
  });

  // Sub-pestañas dentro de Cotizar: 1. Armar Cotización vs 2. Cotizaciones en BD Supabase
  $('#btnSubTabCarrito').off('click').on('click', function () {
    $('#btnSubTabCarrito').addClass('active');
    $('#btnSubTabHistorialCot').removeClass('active');
    $('#panelHistorialCotizaciones').hide();
    $('#panelArmarCarrito').fadeIn(180);
  });

  $('#btnSubTabHistorialCot').off('click').on('click', function () {
    $('#btnSubTabHistorialCot').addClass('active');
    $('#btnSubTabCarrito').removeClass('active');
    $('#panelArmarCarrito').hide();
    $('#panelHistorialCotizaciones').fadeIn(180);
    cargarReservasQuirofanoSupabase();
  });

  $('#btnRefrescarCotSupa').off('click').on('click', function () {
    cargarReservasQuirofanoSupabase();
    mostrarToast('🔄 Cotizaciones actualizadas desde Supabase.');
  });

  $('#listaCotizacionesSupabase').off('click', '.btn-eliminar-quirofano').on('click', '.btn-eliminar-quirofano', function () {
    const $li = $(this).closest('.item-reserva');
    const id = $li.attr('data-id');
    if (id) {
      fetch(`${SUPABASE_URL}/rest/v1/reservas_quirofano?id=eq.${id}`, {
        method: 'DELETE',
        headers: SUPABASE_HEADERS
      })
        .then(() => {
          mostrarToast('🗑️ Cotización eliminada de Supabase.');
          cargarReservasQuirofanoSupabase();
        })
        .catch(() => {});
    }
    $li.fadeOut(150, function () { $(this).remove(); });
  });

  // Validaciones en tiempo real de los datos del cliente en el Carrito/Cotizador
  $('#cotNombre').off('input').on('input', () => validarNombreUnificado($('#cotNombre'), $('#msgCotNombre'), false));
  $('#cotCelular').off('input').on('input', () => validarCelularUnificado($('#cotCelular'), $('#msgCotCelular'), false));
  $('#cotDia, #cotMes, #cotAnio').off('input').on('input', () => validarFechaRangoMesUnificado($('#cotDia'), $('#cotMes'), $('#cotAnio'), $('#msgCotFecha'), false));

  renderizarCarritoCotizacion();

  // Sub-pestañas en Catálogo: 1. Ver Catálogo vs 2. Aumentar Sutura al Catálogo (Supabase CRUD)
  function abrirSubVistaCatalogo(modo) {
    if (modo === 'crear') {
      $('#btnSubCatCrear').addClass('active');
      $('#btnSubCatExplorar').removeClass('active');
      $('#panelExplorarCatalogo').hide();
      $('#panelCrearSuturaCatalogo').fadeIn(200);
    } else {
      $('#btnSubCatExplorar').addClass('active');
      $('#btnSubCatCrear').removeClass('active');
      $('#panelCrearSuturaCatalogo').hide();
      $('#panelExplorarCatalogo').fadeIn(200);
    }
  }

  $('#btnSubCatExplorar, #btnCancelarCrearCat').off('click').on('click', () => abrirSubVistaCatalogo('explorar'));
  $('#btnSubCatCrear').off('click').on('click', () => abrirSubVistaCatalogo('crear'));

  // Botón "+ BD" en Cotizar abre directamente el formulario para aumentar sutura al catálogo
  $('#btnNuevaSuturaSupa').off('click').on('click', function () {
    mostrarVistaUnificado('#catalogo');
    abrirSubVistaCatalogo('crear');
  });

  // Cascada de 3 Capas en "Aumentar Sutura al Catálogo" (Capa 1: Tipo -> Capa 2: Especialidad -> Capa 3: Calibre)
  const CASCADA_CATALOGO_SUTURAS = {
    'Absorbible Sintética Trenzada': {
      'Cirugía General': ['USP 2-0', 'USP 1', 'USP 0'],
      'Ginecología & Obstetricia': ['USP 2-0', 'USP 3-0', 'USP 1']
    },
    'Absorbible Sintética Monofilamento': {
      'Cirugía General': ['USP 1', 'USP 0', 'USP 2-0'],
      'Cirugía Pediátrica': ['USP 4-0', 'USP 5-0']
    },
    'Absorbible Natural': {
      'Ginecología & Obstetricia': ['USP 2-0', 'USP 1'],
      'Cirugía General': ['USP 3-0', 'USP 2-0']
    },
    'No Absorbible Monofilamento': {
      'Cirugía Cardiovascular': ['USP 5-0', 'USP 6-0', 'USP 4-0'],
      'Cirugía Plástica': ['USP 4-0', 'USP 5-0', 'USP 6-0'],
      'Traumatología': ['USP 2-0', 'USP 0']
    },
    'No Absorbible Natural': {
      'Cirugía General': ['USP 0', 'USP 2-0', 'USP 3-0'],
      'Oftalmología': ['USP 6-0', 'USP 5-0']
    }
  };

  $('#catCapa1Tipo').off('change').on('change', function () {
    const tipo = $(this).val();
    const $esp = $('#catCapa2Genero').empty().append('<option value="">-- Elige Especialidad --</option>');
    const $cal = $('#catCapa3Calibre').empty().append('<option value="">-- Primero elige Especialidad --</option>').prop('disabled', true);
    if (tipo && CASCADA_CATALOGO_SUTURAS[tipo]) {
      Object.keys(CASCADA_CATALOGO_SUTURAS[tipo]).forEach(g => $esp.append($('<option>').val(g).text(g)));
      $esp.prop('disabled', false);
      actualizarEstadoCampoUnificado($('#msgCatCascada'), $('#catCapa1Tipo'), true, `✓ Capa 1 seleccionada: ${tipo}. Ahora elige la Especialidad.`);
    } else {
      $esp.prop('disabled', true);
      $('#msgCatCascada').addClass('oculto');
    }
  });

  $('#catCapa2Genero').off('change').on('change', function () {
    const tipo = $('#catCapa1Tipo').val();
    const gen = $(this).val();
    const $cal = $('#catCapa3Calibre').empty().append('<option value="">-- Elige Calibre USP --</option>');
    if (tipo && gen && CASCADA_CATALOGO_SUTURAS[tipo] && CASCADA_CATALOGO_SUTURAS[tipo][gen]) {
      CASCADA_CATALOGO_SUTURAS[tipo][gen].forEach(c => $cal.append($('<option>').val(c).text(c)));
      $cal.prop('disabled', false);
      actualizarEstadoCampoUnificado($('#msgCatCascada'), $('#catCapa2Genero'), true, `✓ Capa 2 seleccionada: ${gen}. Ahora elige el Calibre USP.`);
    } else {
      $cal.prop('disabled', true);
    }
  });

  $('#catCapa3Calibre').off('change').on('change', function () {
    const cal = $(this).val();
    if (cal) {
      actualizarEstadoCampoUnificado(
        $('#msgCatCascada'),
        $('#catCapa1Tipo, #catCapa2Genero, #catCapa3Calibre'),
        true,
        `✓ Clasificación completa (3 Capas): ${$('#catCapa1Tipo').val()} → ${$('#catCapa2Genero').val()} → ${cal}`
      );
    }
  });

  // Validaciones en tiempo real del formulario de Nueva Sutura
  function validarTituloCat(mostrarVacio = false) {
    const val = ($('#catTitulo').val() || '').trim();
    if (!val) {
      if (mostrarVacio) actualizarEstadoCampoUnificado($('#msgCatTitulo'), $('#catTitulo'), false, '⚠️ El nombre de la sutura es obligatorio.');
      else $('#msgCatTitulo').addClass('oculto');
      return false;
    }
    if (val.length < 4) {
      actualizarEstadoCampoUnificado($('#msgCatTitulo'), $('#catTitulo'), false, '⚠️ Ingresa al menos 4 caracteres para el nombre.');
      return false;
    }
    actualizarEstadoCampoUnificado($('#msgCatTitulo'), $('#catTitulo'), true, '✓ Nombre de sutura válido.');
    return true;
  }

  function validarPrecioCat(mostrarVacio = false) {
    const val = parseFloat($('#catPrecio').val());
    if (isNaN(val)) {
      if (mostrarVacio) actualizarEstadoCampoUnificado($('#msgCatPrecio'), $('#catPrecio'), false, '⚠️ El precio por caja es obligatorio.');
      else $('#msgCatPrecio').addClass('oculto');
      return false;
    }
    if (val <= 0 || val > 5000) {
      actualizarEstadoCampoUnificado($('#msgCatPrecio'), $('#catPrecio'), false, '⚠️ El precio debe estar entre 1 y 5000 BOB.');
      return false;
    }
    actualizarEstadoCampoUnificado($('#msgCatPrecio'), $('#catPrecio'), true, `✓ Precio válido (${val} BOB/caja).`);
    return true;
  }

  function validarDescCat(mostrarVacio = false) {
    const val = ($('#catDescripcion').val() || '').trim();
    if (!val) {
      if (mostrarVacio) actualizarEstadoCampoUnificado($('#msgCatDesc'), $('#catDescripcion'), false, '⚠️ Agrega una breve descripción clínica.');
      else $('#msgCatDesc').addClass('oculto');
      return false;
    }
    if (val.length < 6) {
      actualizarEstadoCampoUnificado($('#msgCatDesc'), $('#catDescripcion'), false, '⚠️ La descripción debe tener al menos 6 caracteres.');
      return false;
    }
    actualizarEstadoCampoUnificado($('#msgCatDesc'), $('#catDescripcion'), true, '✓ Descripción clínica válida y segura (Anti-XSS).');
    return true;
  }

  $('#catTitulo').off('input').on('input', () => validarTituloCat(false));
  $('#catPrecio').off('input').on('input', () => validarPrecioCat(false));
  $('#catDescripcion').off('input').on('input', () => validarDescCat(false));

  $('#formNuevaSuturaCat').off('submit').on('submit', function (e) {
    e.preventDefault();
    const okTit = validarTituloCat(true);
    const okPre = validarPrecioCat(true);
    const okDes = validarDescCat(true);
    const tipo = $('#catCapa1Tipo').val();
    const genero = $('#catCapa2Genero').val();
    const calibre = $('#catCapa3Calibre').val();
    const okCasc = Boolean(tipo && genero && calibre);

    if (!okCasc) {
      actualizarEstadoCampoUnificado(
        $('#msgCatCascada'),
        $('#catCapa1Tipo, #catCapa2Genero, #catCapa3Calibre'),
        false,
        '⚠️ Completa los 3 niveles de clasificación (Tipo, Especialidad y Calibre USP).'
      );
    }
    if (!okTit || !okPre || !okDes || !okCasc) {
      mostrarToast('⚠️ Completa todos los campos requeridos del catálogo.');
      return;
    }

    const nuevaSutura = {
      id: 'SUT-' + Math.floor(100 + Math.random() * 900),
      titulo: $('#catTitulo').val().trim(),
      tipo: tipo,
      genero: genero,
      calibre: calibre,
      precio: parseFloat($('#catPrecio').val()),
      portada: $('#catPortada').val() || 'images/poliglactina.svg',
      descripcion: $('#catDescripcion').val().trim()
    };

    fetch(`${SUPABASE_URL}/rest/v1/catalogo_medileben`, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify(nuevaSutura)
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        mostrarToast(`✅ "${nuevaSutura.titulo}" guardada en Supabase y añadida al Catálogo y Cotizador.`);
        renderizarDetalleSeguro(`<strong>Nueva sutura registrada en Supabase (DOMPurify):</strong> ${nuevaSutura.titulo} (${nuevaSutura.calibre}) — ${nuevaSutura.precio} BOB/caja`);
        logEvent('SUPABASE_INSERT_CATALOGO', `${nuevaSutura.titulo} (${nuevaSutura.precio} BOB)`);
        this.reset();
        $('#catCapa2Genero, #catCapa3Calibre').prop('disabled', true);
        $('#msgCatTitulo, #msgCatPrecio, #msgCatCascada, #msgCatDesc').addClass('oculto');
        $('#catTitulo, #catPrecio, #catDescripcion, #catCapa1Tipo, #catCapa2Genero, #catCapa3Calibre').removeClass('input-valido input-invalido');
        abrirSubVistaCatalogo('explorar');
        cargarCatalogoAsync();
      })
      .catch(() => mostrarToast('⚠️ Error al guardar sutura en Supabase.'));
  });

  // CRUD en Tarjetas del Catálogo: Editar Precio (PATCH) y Eliminar Sutura (DELETE) en Supabase
  $('#suturasGrid').off('click', '.btn-editar-sutura-cat').on('click', '.btn-editar-sutura-cat', function () {
    const id = $(this).attr('data-id');
    const nombre = $(this).attr('data-nombre');
    const actual = $(this).attr('data-precio');
    const nuevoPrecio = parseFloat(prompt(`Nuevo precio en BOB/caja para "${nombre}":`, actual));
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) return;

    fetch(`${SUPABASE_URL}/rest/v1/catalogo_medileben?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({ precio: nuevoPrecio })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        mostrarToast(`✏️ Precio de "${nombre}" actualizado a ${nuevoPrecio} BOB en Supabase.`);
        cargarCatalogoAsync();
      })
      .catch(() => mostrarToast('⚠️ No se pudo actualizar el precio en Supabase.'));
  });

  $('#suturasGrid').off('click', '.btn-eliminar-sutura-cat').on('click', '.btn-eliminar-sutura-cat', function () {
    const id = $(this).attr('data-id');
    const nombre = $(this).attr('data-nombre');
    fetch(`${SUPABASE_URL}/rest/v1/catalogo_medileben?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: SUPABASE_HEADERS
    })
      .then(r => r.ok ? r : Promise.reject())
      .then(() => {
        mostrarToast(`🗑️ "${nombre}" eliminada del catálogo en Supabase.`);
        cargarCatalogoAsync();
      })
      .catch(() => mostrarToast('⚠️ No se pudo eliminar de Supabase.'));
  });

  // Filtro en Cascada de 3 Niveles
  $('#cascadaEspecialidad').off('change').on('change', function () {
    const esp = $(this).val();
    const $plano = $('#cascadaPlano');
    $plano.empty().append('<option value="">-- Seleccionar Plano Tisular --</option>');
    $('#resultadoCascada').hide();

    if (esp && DATOS_CASCADA[esp]) {
      DATOS_CASCADA[esp].planos.forEach(p => {
        const $opt = $('<option>').val(p.id).text(p.label).data('sutura', p.sutura);
        $plano.append($opt);
      });
      $plano.prop('disabled', false);
      logEvent('CASCADA_NIVEL_1', `Especialidad: ${esp}`);
    } else {
      $plano.prop('disabled', true);
    }
  });

  $('#cascadaPlano').off('change').on('change', function () {
    const sutura = $(this).find(':selected').data('sutura');
    if (sutura) {
      $('#textoRecomendacion').text(sutura);
      $('#resultadoCascada').fadeIn();
      logEvent('CASCADA_NIVEL_2', `Recomendación: ${sutura}`);
    } else {
      $('#resultadoCascada').hide();
    }
  });

  // Modal Oferta Flash 30s con validación del Carrito + Cliente
  $('#btnModal').off('click').on('click', function () {
    if (!APP_STATE.carrito.length) {
      mostrarToast('⚠️ Agrega al menos un producto al carrito antes de confirmar.');
      return;
    }
    const okNom = validarNombreUnificado($('#cotNombre'), $('#msgCotNombre'), true);
    const okCel = validarCelularUnificado($('#cotCelular'), $('#msgCotCelular'), true);
    const okFec = validarFechaRangoMesUnificado($('#cotDia'), $('#cotMes'), $('#cotAnio'), $('#msgCotFecha'), true);
    if (!okNom || !okCel || !okFec) {
      mostrarToast('⚠️ Completa correctamente Nombre, Celular (8 dígitos) y Fecha (rango 1 mes).');
      return;
    }

    const resumenItems = APP_STATE.carrito.map(x => `${x.cantidad}x ${x.nombre}`).join(' + ');
    const totalCajas = APP_STATE.carrito.reduce((s, x) => s + x.cantidad, 0);
    const totalBob = APP_STATE.carrito.reduce((s, x) => s + x.cantidad * x.precio, 0);

    $('#modalProdNombre').text(resumenItems);
    $('#modalCantidad').text(totalCajas);
    $('#modalMonto').text(`${totalBob} BOB`);
    iniciarTemporizadorModal();
    $('#modalCotizacion').fadeIn(200).css('display', 'flex');
  });

  $('#cancelModalBtn').off('click').on('click', function () {
    detenerTemporizador();
    $('#modalCotizacion').fadeOut(200);
  });

  $('#confirmOrderBtn').off('click').on('click', function () {
    detenerTemporizador();
    $('#modalCotizacion').fadeOut(200);
    const cliente = $('#cotNombre').val().trim();
    const cel = $('#cotCelular').val().trim();
    const fechaStr = `${String($('#cotDia').val()).padStart(2, '0')}/${String($('#cotMes').val()).padStart(2, '0')}/${$('#cotAnio').val()}`;
    const prod = $('#modalProdNombre').text();
    const monto = $('#modalMonto').text();

    mostrarToast(`✅ Cotización confirmada y guardada en Supabase (${monto})`);
    logEvent('COMPRA_FLASH', `Confirmada: ${prod} (${monto})`);

    fetch(`${SUPABASE_URL}/rest/v1/reservas_quirofano`, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({
        cirujano: `${cliente} (Cel: ${cel})`,
        sala: `${prod} • Entrega: ${fechaStr} • Total: ${monto}`
      })
    })
      .then(() => {
        cargarReservasQuirofanoSupabase();
        $('#btnSubTabHistorialCot').trigger('click');
      })
      .catch(() => {});
  });

  // Validación en tiempo real en Reserva de Quirófano y Pedido Hospitalario
  $('#clienteNombre').off('input').on('input', () => validarNombreUnificado($('#clienteNombre'), $('#msgQuirofanoNombre'), false));
  $('#clienteCelular').off('input').on('input', () => validarCelularUnificado($('#clienteCelular'), $('#msgQuirofanoCelular'), false));
  $('#qDia, #qMes, #qAnio').off('input').on('input', () => validarFechaRangoMesUnificado($('#qDia'), $('#qMes'), $('#qAnio'), $('#msgQuirofanoFecha'), false));

  $('#doctorNombre').off('input').on('input', () => validarNombreUnificado($('#doctorNombre'), $('#msgNombreDoc'), false));
  $('#doctorCelular').off('input').on('input', () => validarCelularUnificado($('#doctorCelular'), $('#msgCelularDoc'), false));
  $('#dia, #mes, #anio').off('input').on('input', () => validarFechaRangoMesUnificado($('#dia'), $('#mes'), $('#anio'), $('#msgFechaDoc'), false));

  // Reserva de Quirófano Anti-XSS (.text()) + CRUD Supabase
  $('#formReserva').off('submit').on('submit', function (e) {
    e.preventDefault();
    const okNom = validarNombreUnificado($('#clienteNombre'), $('#msgQuirofanoNombre'), true);
    const okCel = validarCelularUnificado($('#clienteCelular'), $('#msgQuirofanoCelular'), true);
    const okFec = validarFechaRangoMesUnificado($('#qDia'), $('#qMes'), $('#qAnio'), $('#msgQuirofanoFecha'), true);
    if (!okNom || !okCel || !okFec) {
      mostrarToast('⚠️ Corrige los campos marcados en rojo antes de registrar.');
      return;
    }

    const nombre = $('#clienteNombre').val().trim();
    const celular = $('#clienteCelular').val().trim();
    const fechaStr = `${String($('#qDia').val()).padStart(2, '0')}/${String($('#qMes').val()).padStart(2, '0')}/${$('#qAnio').val()}`;
    const sala = `${$('#salaSelect').val()} • Fecha: ${fechaStr} • Cel: ${celular}`;

    this.reset();
    $('#msgQuirofanoNombre, #msgQuirofanoCelular, #msgQuirofanoFecha').addClass('oculto');
    $('#clienteNombre, #clienteCelular, #qDia, #qMes, #qAnio').removeClass('input-valido input-invalido');
    mostrarToast('🛡️ Reserva registrada de forma segura en Supabase.');
    logEvent('RESERVA_ANTI_XSS', `Turno seguro: ${nombre} → ${sala}`);

    fetch(`${SUPABASE_URL}/rest/v1/reservas_quirofano`, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({ cirujano: nombre, sala: sala })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        logEvent('SUPABASE_INSERT', `Reserva de ${nombre} guardada en Postgres`);
        cargarReservasQuirofanoSupabase();
      })
      .catch(() => logEvent('SUPABASE_OFFLINE', 'Reserva guardada localmente'));
  });

  $('#listaReservas').off('click', '.btn-eliminar-quirofano').on('click', '.btn-eliminar-quirofano', function () {
    const $li = $(this).closest('.item-reserva');
    const id = $li.attr('data-id');
    if (id) {
      fetch(`${SUPABASE_URL}/rest/v1/reservas_quirofano?id=eq.${id}`, {
        method: 'DELETE',
        headers: SUPABASE_HEADERS
      })
        .then(() => {
          logEvent('SUPABASE_DELETE', `Reserva #${id} eliminada de reservas_quirofano`);
          mostrarToast('🗑️ Reserva eliminada de Supabase.');
        })
        .catch(() => {});
    }
    $li.fadeOut(150, function () { $(this).remove(); });
  });

  $('#btnRefrescarQuirofanoSupa').off('click').on('click', function () {
    cargarReservasQuirofanoSupabase();
    mostrarToast('🔄 Datos sincronizados desde Supabase.');
  });

  // Cola Quirúrgica Táctil (>= 44px + truncado seguro + .text())
  $('#btnPedirSutura').off('click').on('click', function () {
    const txt = $('#inputSutura').val().trim();
    if (!txt) return;

    const $fila = $('<div>').addClass('fila-sutura');
    const $tit = $('<span>').addClass('titulo-truncado').text(txt);
    const $acc = $('<div>').addClass('cola-actions');
    $acc.append(
      $('<button>').attr({ type: 'button', title: 'Despachar' }).addClass('btn-tactil btn-despachar').text('✓'),
      $('<button>').attr({ type: 'button', title: 'Eliminar' }).addClass('btn-tactil btn-quitar').text('✕')
    );
    $fila.append($tit, $acc);
    $('#listaSuturas').prepend($fila);
    $('#inputSutura').val('');
    mostrarToast('📋 Insumo añadido a la cola.');
    logEvent('COLA_AGREGAR', txt);
  });

  $('#listaSuturas').off('click', '.btn-despachar').on('click', '.btn-despachar', function () {
    const $fila = $(this).closest('.fila-sutura');
    const nombre = $fila.find('.titulo-truncado').text();
    $fila.fadeOut(200, function () { $(this).remove(); });
    mostrarToast(`🚀 Despachado: ${nombre}`);
    logEvent('COLA_DESPACHO', nombre);
  });

  $('#listaSuturas').off('click', '.btn-quitar').on('click', '.btn-quitar', function () {
    const $fila = $(this).closest('.fila-sutura');
    $fila.fadeOut(200, function () { $(this).remove(); });
    mostrarToast('🗑️ Retirado de la cola.');
  });

  // Limpiar Bitácora
  $('#btnLimpiarLog').off('click').on('click', function () {
    $('#logOutput').empty().append($('<div>').addClass('log-item').text('[Sistema] Bitácora reiniciada.'));
  });

  // Formulario de Contacto Validado (Nombre, Celular 8 dígitos y Fecha rango 1 mes + Supabase)
  $('#contactForm').off('submit').on('submit', function (e) {
    e.preventDefault();
    const okNom = validarNombreUnificado($('#doctorNombre'), $('#msgNombreDoc'), true);
    const okCel = validarCelularUnificado($('#doctorCelular'), $('#msgCelularDoc'), true);
    const okFec = validarFechaRangoMesUnificado($('#dia'), $('#mes'), $('#anio'), $('#msgFechaDoc'), true);
    if (!okNom || !okCel || !okFec) {
      mostrarToast('⚠️ Corrige los campos marcados en rojo antes de enviar.');
      return;
    }

    const doc = $('#doctorNombre').val().trim();
    const cel = $('#doctorCelular').val().trim();
    const fechaStr = `${String($('#dia').val()).padStart(2, '0')}/${String($('#mes').val()).padStart(2, '0')}/${$('#anio').val()}`;
    const esp = $('#especialidadSelect').val();

    const $box = $('#alertaBox').empty();
    const $alert = $('<div>').addClass('msg-exito');
    $alert.append(
      document.createTextNode('✅ Solicitud enviada con éxito para '),
      $('<strong>').text(doc),
      document.createTextNode(` (${esp}) • Fecha: ${fechaStr} • Cel: ${cel}.`)
    );
    $box.append($alert);
    this.reset();
    $('#msgNombreDoc, #msgCelularDoc, #msgFechaDoc').addClass('oculto');
    $('#doctorNombre, #doctorCelular, #dia, #mes, #anio').removeClass('input-valido input-invalido');
    logEvent('CONTACTO_SUBMIT', `Solicitud de ${doc} (${esp}) — Fecha: ${fechaStr} — Cel: ${cel}`);

    fetch(`${SUPABASE_URL}/rest/v1/reservas_quirofano`, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({ cirujano: doc, sala: `Pedido ${esp} • Fecha: ${fechaStr} • Cel: ${cel}` })
    })
      .then(() => cargarReservasQuirofanoSupabase())
      .catch(() => {});
  });
});

// ==============================================================================
// 5. TEMPORIZADOR MODAL 30s, BITÁCORA SEGURA Y TOAST
// ==============================================================================
function iniciarTemporizadorModal() {
  detenerTemporizador();
  APP_STATE.segundosRestantes = 30;
  actualizarTextoTimer();

  APP_STATE.temporizadorModal = setInterval(() => {
    APP_STATE.segundosRestantes--;
    actualizarTextoTimer();
    if (APP_STATE.segundosRestantes <= 0) {
      detenerTemporizador();
      $('#modalCotizacion').fadeOut(250);
      mostrarToast('⚠️ Tarifa Flash Expirada (30s).');
      logEvent('TARIFA_EXPIRADA', 'El temporizador de 30s concluyó sin confirmación');
    }
  }, 1000);
}

function detenerTemporizador() {
  if (APP_STATE.temporizadorModal) {
    clearInterval(APP_STATE.temporizadorModal);
    APP_STATE.temporizadorModal = null;
  }
}

function actualizarTextoTimer() {
  const s = APP_STATE.segundosRestantes;
  $('#temporizadorVisual').text(`00:${s < 10 ? '0' + s : s}s`);
}

function logEvent(tipo, mensaje) {
  const $log = $('#logOutput');
  if (!$log.length) return;
  const hora = new Date().toLocaleTimeString();
  const $row = $('<div>').addClass('log-item');
  $row.append(
    $('<strong>').text(`[${hora}] ${tipo}: `),
    document.createTextNode(mensaje)
  );
  $log.prepend($row);
}

function mostrarToast(mensaje) {
  const $t = $('#toastAlert');
  $t.text(mensaje);
  $t.stop(true, true).slideDown(250).delay(3000).fadeOut(350);
}


