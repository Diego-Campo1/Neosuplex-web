// ==========================================
// VARIABLES GLOBALES Y ESTADO
// ==========================================
let carrito = JSON.parse(localStorage.getItem("miCarrito")) || [];
let listaCompletaProductos = []; 
let paginaActual = 1;
const productosPorPagina = 8; 

// ==========================================
// LÓGICA DEL CARRITO
// ==========================================
function agregarAlCarrito(nombreProducto, precioProducto, imagenProducto) {
    let nuevoProducto = { nombre: nombreProducto, precio: precioProducto, imagen: imagenProducto };
    carrito.push(nuevoProducto);
    localStorage.setItem("miCarrito", JSON.stringify(carrito));
    actualizarContador();
    alert(`¡${nombreProducto} se agregó al carrito!`);
}

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    localStorage.setItem("miCarrito", JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
}

function actualizarContador() {
    let contadores = document.getElementsByClassName("cart-count");
    for (let i = 0; i < contadores.length; i++) {
        contadores[i].innerText = carrito.length;
    }
}

function mostrarCarrito() {
    let contenedorCarrito = document.getElementById("lista-carrito");
    let contenedorTotal = document.getElementById("total-pagar");
    let btnFinalizar = document.getElementById("btn-finalizar"); 

    if (!contenedorCarrito) return; 

    contenedorCarrito.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p style='padding:20px; text-align:center; color: var(--color-text-dull);'>Tu carrito está vacío.</p>";
        if (contenedorTotal) contenedorTotal.innerText = "$0.00";
        if (btnFinalizar) btnFinalizar.innerHTML = `<i class="fas fa-lock"></i> Finalizar Compra ($0.00)`;
        return;
    }

    carrito.forEach((item, i) => {
        total += item.precio;
        contenedorCarrito.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div style="flex-grow: 1;">
                    <h4>${item.nombre}</h4>
                </div>
                <p class="cart-price">$${item.precio.toFixed(2)}</p>
                <button onclick="eliminarDelCarrito(${i})" class="btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    if (contenedorTotal) contenedorTotal.innerText = "$" + total.toFixed(2);
    if (btnFinalizar) btnFinalizar.innerHTML = `<i class="fas fa-lock"></i> Finalizar Compra ($${total.toFixed(2)})`;
}

// ==========================================
// CONEXIÓN CON API Y DIBUJO DE PRODUCTOS
// ==========================================
async function obtenerProductosDesdeBackend() {
    let gridProductos = document.querySelector('.product-grid');
    if (!gridProductos) return; 

    try {
        const respuesta = await fetch('http://localhost:8080/api/productos');
        listaCompletaProductos = await respuesta.json();
        
        // Detectamos si estamos en el Inicio o en el Catálogo por el div de paginación
        let controlesPaginacion = document.getElementById('controles-paginacion');
        
        if (!controlesPaginacion) {
            // LÓGICA INICIO: Solo destacados, máximo 4
            let destacados = listaCompletaProductos
                .filter(p => p.destacado === true)
                .slice(0, 4);
            dibujarTarjetas(destacados, gridProductos);
        } else {
            // LÓGICA CATÁLOGO: Paginación de a 8
            mostrarPagina(1); 
        }

        // Inicializamos componentes globales
        inicializarBuscador();
        inicializarFiltros();
        inicializarOrdenamiento();

    } catch (error) {
        console.error("Error al conectar con Java:", error);
        gridProductos.innerHTML = "<p style='text-align:center; width:100%; color:red;'>Error al cargar el catálogo.</p>";
    }
}

function dibujarTarjetas(arrayProductos, contenedor) {
    contenedor.innerHTML = '';
    arrayProductos.forEach(producto => {
        let precioFormateado = producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 });
        
        contenedor.innerHTML += `
            <div class="product-card">
                <span class="product-category">${producto.categoria}</span>
                <img src="${producto.imagenUrl}" alt="${producto.nombre}" class="product-image" 
                     onerror="this.src='Imagenes/default.png'"
                     style="cursor:pointer;"
                     onclick="abrirModalPorId(${producto.id})"> <div class="product-info">
                    <h3 class="product-name" style="cursor:pointer;" 
                        onclick="abrirModalPorId(${producto.id})"> ${producto.nombre}
                    </h3>
                    <div class="product-footer">
                        <span class="product-price">$${precioFormateado}</span>
                        <button class="btn-add-cart" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, '${producto.imagenUrl}')">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// ==========================================
// PAGINACIÓN
// ==========================================
function mostrarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = listaCompletaProductos.slice(inicio, fin);

    let gridProductos = document.querySelector('.product-grid');
    let mensajeSinStock = document.getElementById('mensaje-sin-stock');

    if (productosPagina.length === 0) {
        gridProductos.innerHTML = '';
        if (mensajeSinStock) mensajeSinStock.style.display = 'block';
    } else {
        if (mensajeSinStock) mensajeSinStock.style.display = 'none';
        dibujarTarjetas(productosPagina, gridProductos);
    }

    actualizarBotonesPaginacion();
}

function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(listaCompletaProductos.length / productosPorPagina);
    const nuevaPagina = paginaActual + direccion;
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        mostrarPagina(nuevaPagina);
        window.scrollTo({ top: 150, behavior: 'smooth' }); 
    }
}

function actualizarBotonesPaginacion() {
    const totalPaginas = Math.ceil(listaCompletaProductos.length / productosPorPagina);
    let infoPagina = document.getElementById('info-pagina');
    let btnAnterior = document.getElementById('btn-anterior');
    let btnSiguiente = document.getElementById('btn-siguiente');

    if (infoPagina) infoPagina.innerText = `Página ${paginaActual} de ${totalPaginas || 1}`;
    if (btnAnterior) btnAnterior.disabled = (paginaActual === 1);
    if (btnSiguiente) btnSiguiente.disabled = (paginaActual === totalPaginas || totalPaginas === 0);
}

// ==========================================
// BUSCADOR, FILTROS Y ORDEN
// ==========================================
function inicializarBuscador() {
    let inputBuscador = document.getElementById('buscador-productos');
    let cajaSugerencias = document.getElementById('caja-sugerencias');
    if (!inputBuscador) return;

    inputBuscador.oninput = function() {
        let textoBusqueda = this.value.toLowerCase().trim();
        let tarjetas = document.querySelectorAll('.product-card');
        
        tarjetas.forEach(t => {
            let nombre = t.querySelector('.product-name').innerText.toLowerCase();
            t.style.display = nombre.includes(textoBusqueda) ? 'flex' : 'none';
        });
    };
}

function inicializarFiltros() {
    let botonesFiltro = document.querySelectorAll('.categories-pills .pill');
    let tarjetas = document.querySelectorAll('.product-card');

    botonesFiltro.forEach(boton => {
        boton.onclick = function() {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Convertimos a minúsculas y quitamos espacios para comparar mejor
            let seleccionada = this.innerText.trim().toLowerCase();

            tarjetas.forEach(tarjeta => {
                let categoriaProducto = tarjeta.querySelector('.product-category').innerText.trim().toLowerCase();

                // Comparamos de forma flexible
                if (seleccionada === 'todos') {
                    tarjeta.style.display = 'flex';
                } else if (categoriaProducto.includes(seleccionada) || seleccionada.includes(categoriaProducto)) {
                    tarjeta.style.display = 'flex';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
            
            // Actualizar el contador de resultados
            actualizarTextoResultados();
        };
    });
}

function inicializarOrdenamiento() {
    let select = document.getElementById('ordenar-productos');
    let grid = document.querySelector('.product-grid');
    if (!select || !grid) return;

    select.onchange = function() {
        let tarjetas = Array.from(grid.querySelectorAll('.product-card'));
        if (this.value === 'menor-mayor') {
            tarjetas.sort((a, b) => extraerPrecio(a) - extraerPrecio(b));
        } else if (this.value === 'mayor-menor') {
            tarjetas.sort((a, b) => extraerPrecio(b) - extraerPrecio(a));
        }
        grid.innerHTML = '';
        tarjetas.forEach(t => grid.appendChild(t));
    };
}

function extraerPrecio(tarjeta) {
    let texto = tarjeta.querySelector('.product-price').innerText;
    return parseFloat(texto.replace('$', '').replace(/\./g, '').replace(',', '.'));
}

// ==========================================
// MODAL DE PRODUCTO
// ==========================================
function abrirModalPorId(idBuscado) {
    // Buscamos el producto en nuestra lista global 'listaCompletaProductos'
    const producto = listaCompletaProductos.find(p => p.id === idBuscado);
    
    if (!producto) return;

    // Rellenamos el Modal
    document.getElementById('modal-nombre').innerText = producto.nombre;
    document.getElementById('modal-precio').innerText = '$' + producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 });
    document.getElementById('modal-img').src = producto.imagenUrl;
    document.getElementById('modal-categoria').innerText = producto.categoria;
    document.getElementById('modal-desc').innerText = producto.descripcion || 'Sin descripción disponible.';

    let contenedorStock = document.getElementById('modal-stock-status');
    let botonAgregar = document.getElementById('modal-btn-add');

    if (producto.stock > 0) {
        contenedorStock.innerHTML = `<i class="fas fa-check-circle"></i> En Stock (${producto.stock} disponibles)`;
        contenedorStock.className = 'modal-stock-status stock-in';
        botonAgregar.disabled = false;
        botonAgregar.style.opacity = '1';
        botonAgregar.onclick = () => { 
            agregarAlCarrito(producto.nombre, producto.precio, producto.imagenUrl); 
            cerrarModal(); 
        };
    } else {
        contenedorStock.innerHTML = `<i class="fas fa-times-circle"></i> Agotado`;
        contenedorStock.className = 'modal-stock-status stock-out';
        botonAgregar.disabled = true;
        botonAgregar.style.opacity = '0.5';
    }

    document.getElementById('modal-producto').style.display = 'flex';
}

function cerrarModal() {
    const modal = document.getElementById('modal-producto');
    if (modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-producto');
    if (event.target === modal) {
        cerrarModal();
    }
}
// ==========================================
// INICIO AUTOMÁTICO
// ==========================================
actualizarContador();
mostrarCarrito();
obtenerProductosDesdeBackend();