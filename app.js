// Variables globales
let movimientos = [];

// Función para registrar un nuevo movimiento
function registrarMovimiento() {
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipo').value;
    const monto = parseFloat(document.getElementById('monto').value);
    
    // Validación básica
    if (nombre.trim() === "" || monto <= 0) {
        alert("Error: El nombre no puede estar vacío y el monto debe ser mayor que cero.");
        return;
    }
    
    // Guardar el movimiento
    movimientos.push({ nombre, tipo, monto });
    
    // Limpiar el formulario
    document.getElementById('formulario').reset();
    
    // Actualizar el resumen
    mostrarResumen();
}

// Función para calcular el saldo total
function calcularTotalSaldo() {
    let saldo = 0;
    
    for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].tipo === "ingreso") {
            saldo += movimientos[i].monto;
        } else {
            saldo -= movimientos[i].monto;
        }
    }
    
    return saldo;
}

// Función para mostrar el resumen
function mostrarResumen() {
    const resumenDiv = document.getElementById('resumen');
    const totalMovimientos = movimientos.length;
    const saldoTotal = calcularTotalSaldo();
    
    // Calcular totales por tipo
    let totalIngresos = 0;
    let totalEgresos = 0;
    
    for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].tipo === "ingreso") {
            totalIngresos += movimientos[i].monto;
        } else {
            totalEgresos += movimientos[i].monto;
        }
    }
    
    // Construir el HTML del resumen
    let resumenHTML = `
        <h3>Resumen</h3>
        <p>Total de movimientos: ${totalMovimientos}</p>
        <p>Saldo total: $${saldoTotal.toFixed(2)}</p>
        <h4>Desglose por tipo:</h4>
    `;
    
    if (totalEgresos > 0) {
        resumenHTML += `<p>Egresos: $${totalEgresos.toFixed(2)}</p>`;
    }
    
    if (totalIngresos > 0) {
        resumenHTML += `<p>Ingresos: $${totalIngresos.toFixed(2)}</p>`;
    }
    
    resumenDiv.innerHTML = resumenHTML;
}