// Productos disponibles
const PRODUCTOS = {
    general: { nombre: 'ENTRADA GENERAL', detalle: 'Acceso 1 día · todas las actividades', precio: 40000 },
    vip:     { nombre: 'PASE VIP',         detalle: 'Acceso preferencial · fila rápida · póster', precio: 54000 },
    abono:   { nombre: 'ABONO 3 DÍAS',     detalle: 'Acceso 3 días · póster exclusivo', precio: 102000 }
};

// Leer y guardar carrito en localStorage
function leerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || {};
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Formatear precio en pesos argentinos
function formatearPrecio(n) {
    return '$' + n.toLocaleString('es-AR');
}

// Agregar item desde la URL (?agregar=general)
function procesarURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('agregar');
    if (id && PRODUCTOS[id]) {
        const carrito = leerCarrito();
        carrito[id] = (carrito[id] || 0) + 1;
        guardarCarrito(carrito);
        // Limpiar el ?agregar= de la URL sin recargar
        window.history.replaceState({}, '', 'carrito.html');
    }
}

// Sumar uno
function sumar(id) {
    const carrito = leerCarrito();
    carrito[id] = (carrito[id] || 0) + 1;
    guardarCarrito(carrito);
    renderizar();
}

// Restar uno (si llega a 0 elimina)
function restar(id) {
    const carrito = leerCarrito();
    if (carrito[id] > 1) {
        carrito[id]--;
    } else {
        delete carrito[id];
    }
    guardarCarrito(carrito);
    renderizar();
}

// Eliminar entrada completa
function eliminar(id) {
    const carrito = leerCarrito();
    delete carrito[id];
    guardarCarrito(carrito);
    renderizar();
}

// Dibujar el carrito en pantalla
function renderizar() {
    const carrito = leerCarrito();
    const ids = Object.keys(carrito);
    const contenedor = document.getElementById('cart-container');
    const resumen = document.getElementById('summary-box');

    // Carrito vacío
    if (ids.length === 0) {
        contenedor.innerHTML = '<div class="carrito-vacio"><p>Tu carrito está vacío.</p><a href="entradas.html" class="btn-outline-acc" style="margin-top:16px;">VER ENTRADAS</a></div>';
        resumen.innerHTML = '';
        return;
    }

    // Items
    let htmlItems = '';
    ids.forEach(id => {
        const prod = PRODUCTOS[id];
        const cantidad = carrito[id];
        const subtotal = prod.precio * cantidad;
        htmlItems += `
            <div class="cart-item">
                <div class="cart-item-name">
                    ${prod.nombre}
                    <span>${prod.detalle}</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="restar('${id}')">−</button>
                    <span class="qty-num">${cantidad}</span>
                    <button class="qty-btn" onclick="sumar('${id}')">+</button>
                </div>
                <div class="cart-item-price">${formatearPrecio(subtotal)}</div>
                <button class="remove-btn" onclick="eliminar('${id}')" title="Eliminar">🗑</button>
            </div>`;
    });
    contenedor.innerHTML = htmlItems;

    // Resumen
    let total = 0;
    let htmlFilas = '';
    ids.forEach(id => {
        const prod = PRODUCTOS[id];
        const sub = prod.precio * carrito[id];
        total += sub;
        htmlFilas += `
            <div class="summary-row">
                <span>${prod.nombre} × ${carrito[id]}</span>
                <span>${formatearPrecio(sub)}</span>
            </div>`;
    });
    resumen.innerHTML = `
        ${htmlFilas}
        <div class="summary-total">
            <span>TOTAL</span>
            <span>${formatearPrecio(total)}</span>
        </div>`;
}

// Arrancar
procesarURL();
renderizar();