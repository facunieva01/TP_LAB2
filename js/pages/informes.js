let Dict = { // diccionario de opciones currency-filter a nombres en LocalStorage
    'Dólar Oficial': 'Oficial',
    'Dólar Blue': 'Blue',
    'Dólar Bolsa (MEP)': 'Bolsa',
    'Dólar Contado con Liqui (CCL)': 'Contado con liquidación',
    'Dólar Tarjeta': 'Tarjeta',
    'Dólar Mayorista': 'Mayorista',
    'Dólar Cripto': 'Cripto',
    'Euro': 'Euro',
    'Real Brasileño': 'Real Brasileño',
    'Peso Chileno': 'Peso Chileno',
    'Peso Uruguayo': 'Peso Uruguayo'
};
let grafica = null;
const store = JSON.parse(localStorage.getItem('cotizacionesFavoritas')) || [];
let fech = store.map(o => o.date.split(',')[0]);
  let fechas = [...new Set(fech)]; // etiquetas eje horizontal de grafica
  const savedQuotes = quotesByCurrency(); // cotizaciones de LocalStorage agrupadas por moneda
const filtro = document.getElementById('currency-filter');
const tbody = document.getElementById('tabla-informe');
  const colors = ["blue","red","yellow","green","orange","black","purple","pink","cyan","lightred"] // colores de linea para grafica
  
function quotesByCurrency() {
    const datos = {};
    
    for (const o of store) {
    if (!datos[o.moneda]) {
        datos[o.moneda] = {
        nombre: o.moneda,
        serie: []
        };
    }
    
    datos[o.moneda].serie.push({
        date: o.date,
        compra: o.compra,
        venta: o.venta
    });
    
    datos[o.moneda].serie.sort(
        (a,b) => new Date(b.date) - new Date(a.date)
    )
    }

    return datos;
}

document.addEventListener('DOMContentLoaded', displaySavedQuotes);

function displaySavedQuotes() {
    tbody.innerHTML = '';

    for (const i in savedQuotes) {
    const row = document.createElement('tr');
    const currencyCell = document.createElement('td');
    currencyCell.innerHTML = savedQuotes[i].nombre;
    row.appendChild(currencyCell);
    tbody.appendChild(row);

    for (const q of savedQuotes[i].serie) {
        const row = document.createElement('tr');
        const currencyCell = document.createElement('td');
        currencyCell.innerHTML = '';
        row.appendChild(currencyCell);
        const dateCell = document.createElement('td');
        dateCell.textContent = q.date;
        row.appendChild(dateCell);
        const buyCell = document.createElement('td');
        buyCell.textContent = q.compra;
        row.appendChild(buyCell);
        const sellCell = document.createElement('td');
        sellCell.textContent = q.venta;
        row.appendChild(sellCell);
        tbody.appendChild(row);
    }
    }

    graficarTodo();
}

function graficarTodo() {
  console.log(savedQuotes)
    let datosGraf = [];
    let color_index = 0;
    

    for (const i in savedQuotes) {
    const valores = [];
    for (f of fechas) {
        let d_i = savedQuotes[i].serie.map(s => s.date.split(',')[0]);
        if (d_i.includes(f)) {
        let j = d_i.indexOf(f);
        valores.push(savedQuotes[i].serie[j].compra);
        } else {
        valores.push(null);
        }
    }
    const linea = {
        label: savedQuotes[i].nombre,
        data: valores,
        borderColor: colors[color_index],
        backgroundColor: colors[color_index],
        borderWidth: 3,
        fill: false
      }
      color_index++;
      datosGraf.push(linea);
    }
  
    
    if (grafica) {
      grafica.destroy();
    }
    
    const ctx = document.getElementById("miGrafica").getContext("2d");
    grafica = new Chart(ctx, {
      type: "line",
      data: {
        labels: fechas,
        datasets: datosGraf
      }
    })
  }
  
  filtro.addEventListener('change', (e) => {
    const seleccion = e.target.value;
  
    if (seleccion === 'TODAS') {
      displaySavedQuotes();
    } else {
      const opcion_dict = Dict[seleccion];
      const sel = savedQuotes[opcion_dict];
      
      if (!sel) {
        tbody.innerHTML='<p>No hay cotizaciones guardadas para la opción seleccionada</p>';
      } else {
        // tabular solo cotizacion elegida
        tbody.innerHTML = '';
        const row_h = document.createElement('tr');
        const currencyCell_h = document.createElement('td');
        currencyCell_h.innerHTML = sel.nombre;
        row_h.appendChild(currencyCell_h);
        tbody.appendChild(row_h);
  
        for (const q of sel.serie) {
          const row = document.createElement('tr');
          const currencyCell = document.createElement('td');
          currencyCell.innerHTML = '';
          row.appendChild(currencyCell);
          const dateCell = document.createElement('td');
          dateCell.textContent = q.date;
          row.appendChild(dateCell);
          const buyCell = document.createElement('td');
          buyCell.textContent = q.compra;
          row.appendChild(buyCell);
          const sellCell = document.createElement('td');
          sellCell.textContent = q.venta;
          row.appendChild(sellCell);
          tbody.appendChild(row);
        }
  
        // graficar solo cotización elegida
        const valores_compra = [];
        const valores_venta = [];
        let datosGraf = [];
  
        for (f of fechas) {
          let d_i = sel.serie.map(s => s.date.split(',')[0]);
          if (d_i.includes(f)) {
            let j = d_i.indexOf(f);
            valores_compra.push(sel.serie[j].compra);
            valores_venta.push(sel.serie[j].venta);
          } else {
            valores_compra.push(null);
            valores_venta.push(null);
          }
        }
  
        const lineaCompra = {
          label: "Compra",
          data: valores_compra,
          borderColor: "red",
          backgroundColor: "red",
          borderWidth: 3,
          fill: false
        }
  
        datosGraf.push(lineaCompra);
        
        const lineaVenta = {
          label: "Venta",
          data: valores_venta,
          borderColor: "blue",
          backgroundColor: "blue",
          borderWidth: 3,
          fill: false
        }
  
        datosGraf.push(lineaVenta);
  
        if (grafica) {
          grafica.destroy();
        }
        
        const ctx = document.getElementById("miGrafica").getContext("2d");
        grafica = new Chart(ctx, {
          type: "line",
          data: {
            labels: fechas,
            datasets: datosGraf
          }
        })
      }
    }
  });

  