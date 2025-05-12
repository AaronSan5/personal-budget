// Variables globales
let movimientos = []; // Array para guardar los movimientos
let totalIngresos = 0;
let totalEgresos = 0;
let saldoActual = 0;

// HU2: Función constructora base Movimiento (prototipo padre)
function Movimiento(monto, descripcion) {
    // Validaciones básicas comunes
    if (isNaN(monto) || monto <= 0) {
        alert("Error: El monto debe ser un número mayor que cero.");
        return null;
    }
    
    if (!descripcion || descripcion.trim() === "") {
        alert("Error: La descripción no puede estar vacía.");
        return null;
    }
    
    // Propiedades comunes a todos los movimientos
    this.monto = parseFloat(monto);
    this.descripcion = descripcion.trim();
    this.fecha = new Date(); // Registramos la fecha de creación
}

// Métodos comunes en el prototipo de Movimiento
Movimiento.prototype.validar = function() {
    // Método base de validación que todas las subclases deben tener
    // Cada subclase lo extenderá según necesite
    return this.monto > 0 && this.descripcion.trim() !== "";
};

Movimiento.prototype.obtenerFechaFormateada = function() {
    return this.fecha.toLocaleDateString();
};

// Método render básico que será heredado (o sobreescrito si es necesario)
Movimiento.prototype.render = function() {
    // Crear el elemento para mostrar el movimiento
    const movimientoItem = document.createElement('div');
    movimientoItem.className = 'movimiento-item';
    
    // Añadir el contenido básico (las subclases pueden personalizar esto)
    movimientoItem.innerHTML = `
        <strong>${this.descripcion}</strong>
        <span class="movimiento-monto">$${this.monto.toFixed(2)}</span>
        <small>Fecha: ${this.obtenerFechaFormateada()}</small>
    `;
    
    return movimientoItem;
};

// HU2: Constructor de Ingreso que hereda de Movimiento
function Ingreso(monto, descripcion) {
    // Llamamos al constructor padre con los parámetros
    Movimiento.call(this, monto, descripcion);
    
    // Propiedad específica de Ingreso
    this.tipo = "ingreso";
}

// Establecer la herencia prototipal
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

// Sobreescribir o extender métodos para Ingreso
Ingreso.prototype.validar = function() {
    // Primero llamamos a la validación del padre
    if (!Movimiento.prototype.validar.call(this)) {
        return false;
    }
    
    // Validaciones específicas para ingresos
    // (Podríamos agregar validaciones adicionales aquí)
    return true;
};

// Sobreescribir el método render para Ingresos
Ingreso.prototype.render = function() {
    const elementoIngreso = document.createElement('div');
    elementoIngreso.className = 'movimiento-item ingreso';
    
    elementoIngreso.innerHTML = `
        <h3>${this.descripcion}</h3>
        <span class="movimiento-monto ingreso">+$${this.monto.toFixed(2)}</span>
        <p>Fecha: ${this.obtenerFechaFormateada()}</p>
    `;
    
    return elementoIngreso;
};

// HU2: Constructor de Egreso que hereda de Movimiento
function Egreso(monto, descripcion) {
    // Llamamos al constructor padre con los parámetros
    Movimiento.call(this, monto, descripcion);
    
    // Propiedad específica de Egreso
    this.tipo = "egreso";
}

// Establecer la herencia prototipal
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

// Sobreescribir o extender métodos para Egreso
Egreso.prototype.validar = function() {
    // Primero llamamos a la validación del padre
    if (!Movimiento.prototype.validar.call(this)) {
        return false;
    }
    
    // Validaciones específicas para egresos
    // (Podríamos agregar validaciones adicionales aquí)
    return true;
};

// Sobreescribir el método render para Egresos
Egreso.prototype.render = function() {
    const elementoEgreso = document.createElement('div');
    elementoEgreso.className = 'movimiento-item egreso';
    
    elementoEgreso.innerHTML = `
        <h3>${this.descripcion}</h3>
        <span class="movimiento-monto egreso">-$${this.monto.toFixed(2)}</span>
        <p>Fecha: ${this.obtenerFechaFormateada()}</p>
    `;
    
    return elementoEgreso;
};

// HU3: Método para recalcular totales y actualizar UI
Movimiento.prototype.recalcularTotales = function() {
    totalIngresos = 0;
    totalEgresos = 0;
    
    // Recorrer todos los movimientos y actualizar totales
    for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].tipo === "ingreso") {
            totalIngresos += movimientos[i].monto;
        } else if (movimientos[i].tipo === "egreso") {
            totalEgresos += movimientos[i].monto;
        }
    }
    
    // Calcular saldo actual
    saldoActual = totalIngresos - totalEgresos;
    
    // Actualizar la UI con los nuevos totales
    document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('total-egresos').textContent = `$${totalEgresos.toFixed(2)}`;
    document.getElementById('saldo-actual').textContent = `$${saldoActual.toFixed(2)}`;
    
    // Cambiar el color del saldo según sea positivo o negativo
    const saldoElement = document.getElementById('saldo-actual');
    if (saldoActual >= 0) {
        saldoElement.style.color = "#27ae60"; // Verde para saldo positivo
    } else {
        saldoElement.style.color = "#e74c3c"; // Rojo para saldo negativo
    }
};

// Función para registrar un nuevo movimiento
function registrarMovimiento() {
    // Obtener valores del formulario
    const tipo = document.getElementById('tipo').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const descripcion = document.getElementById('descripcion').value;
    
    let nuevoMovimiento;
    
    // Crear la instancia adecuada según el tipo
    if (tipo === "ingreso") {
        nuevoMovimiento = new Ingreso(monto, descripcion);
    } else {
        nuevoMovimiento = new Egreso(monto, descripcion);
    }
    
    // Verificar si la creación fue exitosa
    if (!nuevoMovimiento) {
        return; // La validación falló en el constructor
    }
    
    // Verificar la validación específica del tipo
    if (!nuevoMovimiento.validar()) {
        alert("El movimiento no pasó la validación específica.");
        return;
    }
    
    // Agregar el movimiento al array
    movimientos.push(nuevoMovimiento);
    
    // Renderizar el movimiento en la UI
    mostrarMovimientoEnUI(nuevoMovimiento);
    
    // Recalcular totales
    nuevoMovimiento.recalcularTotales();
    
    // Limpiar el formulario
    document.getElementById('monto').value = "";
    document.getElementById('descripcion').value = "";
    
    // Habilitar los botones de funciones ahora que hay datos
    document.getElementById('btnListarNombres').disabled = false;
    document.getElementById('btnFiltrarEgresos').disabled = false;
    document.getElementById('btnBuscarMovimiento').disabled = false;
    
    // Eliminar mensaje de "no hay movimientos" si existe
    const mensajeVacio = document.querySelector('.mensaje-vacio');
    if (mensajeVacio) {
        mensajeVacio.remove();
    }
    
    // Mostrar mensaje de éxito
    alert("Movimiento registrado correctamente.");
}

// Función para mostrar un movimiento en la UI
function mostrarMovimientoEnUI(movimiento) {
    const listaMovimientos = document.getElementById('listaMovimientos');
    
    // Añadir el elemento renderizado al principio de la lista (más reciente arriba)
    const elementoMovimiento = movimiento.render();
    
    if (listaMovimientos.firstChild) {
        listaMovimientos.insertBefore(elementoMovimiento, listaMovimientos.firstChild);
    } else {
        listaMovimientos.appendChild(elementoMovimiento);
    }
}

// Función para listar descripciones usando map()
function listarDescripciones() {
    // Verificar que haya movimientos
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados.");
        return [];
    }
    
    // Usar map() para obtener solo las descripciones
    const descripciones = movimientos.map(function(movimiento) {
        return movimiento.descripcion;
    });
    
    // Mostrar resultado en consola
    console.log("Descripciones de movimientos registrados:");
    console.log(descripciones);
    
    // Mostrar resultado en la interfaz
    const resultadoDiv = document.getElementById('resultadoOperaciones');
    resultadoDiv.innerHTML = "<h3>Descripciones de movimientos registrados:</h3>";
    resultadoDiv.innerHTML += "<p>[" + descripciones.join(", ") + "]</p>";
    
    return descripciones;
}

// Función para filtrar egresos mayores a $100 usando filter()
function filtrarEgresosMayores100() {
    // Verificar que haya movimientos
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados.");
        return [];
    }
    
    // Usar filter() para obtener solo los egresos > $100
    const egresosMayores = movimientos.filter(function(movimiento) {
        return movimiento.tipo === "egreso" && movimiento.monto > 100;
    });
    
    // Mostrar resultado en consola
    console.log("Egresos mayores a $100:");
    console.log(egresosMayores);
    
    // Mostrar resultado en la interfaz
    const resultadoDiv = document.getElementById('resultadoOperaciones');
    resultadoDiv.innerHTML = "<h3>Egresos mayores a $100:</h3>";
    
    if (egresosMayores.length === 0) {
        resultadoDiv.innerHTML += "<p>No se encontraron egresos mayores a $100.</p>";
    } else {
        let listaHTML = "<ul>";
        for (let i = 0; i < egresosMayores.length; i++) {
            listaHTML += `<li>${egresosMayores[i].descripcion} - $${egresosMayores[i].monto.toFixed(2)}</li>`;
        }
        listaHTML += "</ul>";
        resultadoDiv.innerHTML += listaHTML;
    }
    
    return egresosMayores;
}

// Función para buscar movimiento por descripción usando find()
function buscarMovimientoPorDescripcion() {
    // Verificar que haya movimientos
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados.");
        return null;
    }
    
    // Pedir al usuario la descripción a buscar
    const descripcionBuscada = prompt("Ingrese la descripción del movimiento a buscar:");
    
    if (!descripcionBuscada) {
        return null; // El usuario canceló o no ingresó nada
    }
    
    // Usar find() para localizar un movimiento por su descripción
    const movimientoEncontrado = movimientos.find(function(movimiento) {
        return movimiento.descripcion.toLowerCase().includes(descripcionBuscada.toLowerCase());
    });
    
    // Mostrar resultado en consola
    console.log("Buscar movimiento por descripción: '" + descripcionBuscada + "'");
    
    // Mostrar resultado en la interfaz
    const resultadoDiv = document.getElementById('resultadoOperaciones');
    resultadoDiv.innerHTML = "<h3>Búsqueda por descripción: '" + descripcionBuscada + "'</h3>";
    
    if (movimientoEncontrado) {
        console.log("Resultado encontrado:");
        console.log(movimientoEncontrado);
        
        resultadoDiv.innerHTML += "<p>Resultado encontrado:</p>";
        resultadoDiv.innerHTML += "<ul>";
        resultadoDiv.innerHTML += "<li>Descripción: " + movimientoEncontrado.descripcion + "</li>";
        resultadoDiv.innerHTML += "<li>Tipo: " + movimientoEncontrado.tipo + "</li>";
        resultadoDiv.innerHTML += "<li>Monto: $" + movimientoEncontrado.monto.toFixed(2) + "</li>";
        resultadoDiv.innerHTML += "<li>Fecha: " + movimientoEncontrado.obtenerFechaFormateada() + "</li>";
        resultadoDiv.innerHTML += "</ul>";
    } else {
        console.log("No se encontró ningún movimiento con la descripción: " + descripcionBuscada);
        resultadoDiv.innerHTML += "<p>No se encontró ningún movimiento con esa descripción.</p>";
    }
    
    return movimientoEncontrado;
}

// Configuración inicial de la página
function inicializar() {
    // Desactivar botones hasta que haya movimientos
    document.getElementById('btnListarNombres').disabled = true;
    document.getElementById('btnFiltrarEgresos').disabled = true;
    document.getElementById('btnBuscarMovimiento').disabled = true;
    
    // Configurar eventos de botones
    document.getElementById('btnRegistrar').addEventListener('click', registrarMovimiento);
    document.getElementById('btnListarNombres').addEventListener('click', listarDescripciones);
    document.getElementById('btnFiltrarEgresos').addEventListener('click', filtrarEgresosMayores100);
    document.getElementById('btnBuscarMovimiento').addEventListener('click', buscarMovimientoPorDescripcion);
    
    // Inicializar totales en 0
    document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('total-egresos').textContent = `$${totalEgresos.toFixed(2)}`;
    document.getElementById('saldo-actual').textContent = `$${saldoActual.toFixed(2)}`;
}

// Ejecutar la inicialización cuando se carga la página
window.onload = inicializar;