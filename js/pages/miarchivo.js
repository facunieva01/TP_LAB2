function displaySavedQuotes() {
    const savedQuotes = getSavedQuotes();

    const tbody = document.getElementById('saved-quotes-tbody');
    if (!tbody) {
        console.error('Elemento tbody no encontrado');
        return;
    }
    tbody.innerHTML = '';

    savedQuotes.forEach(quote => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = quote.date;
        row.appendChild(dateCell);

        const currencyCell = document.createElement('td');
        currencyCell.innerHTML = quote.moneda.split(', ').join('<br>');
        row.appendChild(currencyCell);

        const buyCell = document.createElement('td');
        buyCell.innerHTML = quote.compra.split(', ').join('<br>');
        row.appendChild(buyCell);

        const sellCell = document.createElement('td');
        sellCell.innerHTML = quote.venta.split(', ').join('<br>');
        row.appendChild(sellCell);

        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '🗑️';
        deleteButton.addEventListener('click', () => removeQuote(quote.date));
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        tbody.appendChild(row);
    });
}

function getSavedQuotes() {
    return JSON.parse(localStorage.getItem('cotizacionesFavoritas')) || [];
}


function removeQuote(date) {
    let savedQuotes = getSavedQuotes();
    savedQuotes = savedQuotes.filter(quote => quote.date !== date);
    localStorage.setItem('cotizacionesFavoritas', JSON.stringify(savedQuotes));
    displaySavedQuotes();
}

function printReport() {
    const reportContent = document.querySelector('.mi-archivo-container').innerHTML;

    
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Cotizacion Hoy</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(reportContent);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}


document.addEventListener('DOMContentLoaded', displaySavedQuotes);
