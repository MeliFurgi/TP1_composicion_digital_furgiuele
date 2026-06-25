const PRODUCTOS = {
    general: { nombre: 'ENTRADA GENERAL', precio: 40000 },
    vip:     { nombre: 'PASE VIP',         precio: 54000 },
    abono:   { nombre: 'ABONO 3 DÍAS',     precio: 102000 }
};

function leerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || {};
}

function formatearPrecio(n) {
    return '$' + n.toLocaleString('es-AR');
}

// Mostrar resumen del carrito arriba del formulario
function mostrarResumenMini() {
    const carrito = leerCarrito();
    const ids = Object.keys(carrito);
    const contenedor = document.getElementById('resumen-mini');

    if (ids.length === 0) {
        contenedor.innerHTML = '<p style="opacity:0.7">No hay entradas en el carrito.</p>';
        return;
    }

    let total = 0;
    let html = '';
    ids.forEach(id => {
        const prod = PRODUCTOS[id];
        const sub = prod.precio * carrito[id];
        total += sub;
        html += `<div class="resumen-mini-fila">
                    <span>${prod.nombre} × ${carrito[id]}</span>
                    <span>${formatearPrecio(sub)}</span>
                 </div>`;
    });
    html += `<div class="resumen-mini-total">
                <span>TOTAL</span>
                <span>${formatearPrecio(total)}</span>
             </div>`;
    contenedor.innerHTML = html;
}

// Formatear número de tarjeta con espacios
document.getElementById('tarjeta').addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = val.replace(/(.{4})/g, '$1 ').trim();
});

// Formatear vencimiento con barra
document.getElementById('vencimiento').addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
    this.value = val;
});

// Solo números en DNI y CVV
document.getElementById('dni').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
});
document.getElementById('cvv').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
});

// Confirmar pago
document.getElementById('formulario-pago').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email  = document.getElementById('email').value;
    const carrito = leerCarrito();
    const ids = Object.keys(carrito);

    // Armar resumen de éxito
    let total = 0;
    let htmlFilas = '';
    ids.forEach(id => {
        const prod = PRODUCTOS[id];
        const sub = prod.precio * carrito[id];
        total += sub;
        htmlFilas += `<div class="exito-resumen-fila">
                         <span>${prod.nombre} × ${carrito[id]}</span>
                         <span>${formatearPrecio(sub)}</span>
                      </div>`;
    });
    htmlFilas += `<div class="exito-resumen-total">
                     <span>TOTAL PAGADO</span>
                     <span>${formatearPrecio(total)}</span>
                  </div>`;

    // Mostrar datos en la pantalla de éxito
    document.getElementById('exito-nombre').textContent = nombre;
    document.getElementById('exito-email').textContent = email;
    document.getElementById('exito-resumen').innerHTML = htmlFilas;

    // Vaciar carrito
    localStorage.removeItem('carrito');

    // Ocultar formulario y mostrar éxito
    document.getElementById('seccion-pago').style.display = 'none';
    document.getElementById('seccion-exito').style.display = 'block';

    // Scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Iniciar
mostrarResumenMini();