const urls = {
    'DOLAR OFICIAL': 'https://dolarapi.com/v1/dolares/oficial',
    'DOLAR BLUE': 'https://dolarapi.com/v1/dolares/blue',
    'DOLAR MEP': 'https://dolarapi.com/v1/dolares/bolsa',
    'DOLAR CCL': 'https://dolarapi.com/v1/dolares/contadoconliqui',
    'DOLAR TARJETA': 'https://dolarapi.com/v1/dolares/tarjeta',
    'DOLAR CRIPTO': 'https://dolarapi.com/v1/dolares/cripto',
    'EURO': 'https://dolarapi.com/v1/cotizaciones/eur', /* dolar api esta mal */
    'REAL BRASILEÑO': 'https://dolarapi.com/v1/cotizaciones/brl',
    'PESO CHILENO': 'https://dolarapi.com/v1/cotizaciones/clp',
    'PESO URUGUAYO': 'https://dolarapi.com/v1/cotizaciones/uyu'
};

async function obtenerCotizaciones(moneda = 'TODAS LAS MONEDAS') {
    try {
        ocultarMensajeError();
        let data = [];

        if (moneda === 'TODAS LAS MONEDAS') {
            const requests = Object.values(urls).map(url => 
                fetch(url).then(response => {
                    if (!response.ok) {
                        throw new Error(`Error al obtener datos de ${url}: ${response.statusText}`);
                    }
                    return response.json();
                })
            );
            data = await Promise.all(requests);
        } else {
            const response = await fetch(urls[moneda]);
            if (!response.ok) {
                throw new Error(`Error en la consulta a la API para ${moneda}: ${response.statusText}`);
            }
            data = [await response.json()];
        }
        mostrarCotizaciones(data);
    } catch (error) {
        console.error(error);
        mostrarMensajeError(error.message);
    }
}

function mostrarCotizaciones(data) {
    const contenedor = document.querySelector('.currency-board');
    const fechaActualizacion = new Date().toLocaleString();
    contenedor.innerHTML = ''; 
    document.querySelector('.currency-displayer p').innerText = `Datos actualizados: ${fechaActualizacion}`;

    const monedaFavorita = localStorage.getItem('monedaFavorita');

    data.forEach(cotizacion => {
        const div = document.createElement('div');
        div.className = 'currency-row';
        if (cotizacion.nombre === monedaFavorita) {
            div.classList.add('favorita');
        }
        div.innerHTML = `
            <div class="tipo-moneda">${cotizacion.nombre}</div>
            <div class="precio-compra">${cotizacion.compra}</div>
            <div class="precio-venta">${cotizacion.venta}</div>
            <div class="moneda-favorita" onclick="marcarComoFavorita('${cotizacion.nombre}', '${cotizacion.compra}', '${cotizacion.venta}')">⭐</div>
        `;
        contenedor.appendChild(div);
    });
}

function mostrarMensajeError(mensaje) {
    const contenedor = document.querySelector('.currency-board');
    const div = document.createElement('div');
    div.className = 'error';
    div.innerText = mensaje;
    contenedor.appendChild(div);
}

function ocultarMensajeError() {
    const contenedor = document.querySelector('.currency-board');
    const errorDiv = contenedor.querySelector('.error');
    if (errorDiv) {
        contenedor.removeChild(errorDiv);
    }
}

document.getElementById('monetary-selector').addEventListener('change', function () {
    const monedaSeleccionada = this.value;
    obtenerCotizaciones(monedaSeleccionada);
});

setInterval(() => {
    const monedaSeleccionada = document.getElementById('monetary-selector').value;
    obtenerCotizaciones(monedaSeleccionada);
}, 300000);

obtenerCotizaciones();


function marcarComoFavorita(moneda, compra, venta) {
    localStorage.setItem('monedaFavorita', moneda);
    guardarCotizacionFavorita(moneda, compra, venta);
    obtenerCotizaciones();
}


function guardarCotizacionFavorita(moneda, compra, venta) {
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizacionesFavoritas')) || [];
    const cotizacionActual = { date: new Date().toLocaleString(), moneda: moneda, compra: compra, venta: venta };

    cotizacionesGuardadas.push(cotizacionActual);
    localStorage.setItem('cotizacionesFavoritas', JSON.stringify(cotizacionesGuardadas));
}
