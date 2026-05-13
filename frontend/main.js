// ==========================================
// VARIABLES GLOBALES Y ESTADO
// ==========================================
let carrito = JSON.parse(localStorage.getItem("miCarrito")) || [];
let listaCompletaProductos = []; 
let listaFiltrada = []; // <-- ¡AGREGAR ESTA LÍNEA!
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
        listaFiltrada = [...listaCompletaProductos];
        
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

    // MAGIA: Ahora usamos la listaFiltrada, no la completa
    const productosPagina = listaFiltrada.slice(inicio, fin);

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
    // Calculamos el total de páginas basados en lo que buscó el usuario
    const totalPaginas = Math.ceil(listaFiltrada.length / productosPorPagina);
    const nuevaPagina = paginaActual + direccion;
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        mostrarPagina(nuevaPagina);
        window.scrollTo({ top: 150, behavior: 'smooth' }); 
    }
}

function actualizarBotonesPaginacion() {
    const totalPaginas = Math.ceil(listaFiltrada.length / productosPorPagina);
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
    if (!inputBuscador) return;

    inputBuscador.oninput = function() {
        let textoBusqueda = this.value.toLowerCase().trim();
        
        // Filtramos la data real (el array)
        listaFiltrada = listaCompletaProductos.filter(p => 
            p.nombre.toLowerCase().includes(textoBusqueda)
        );
        
        // Volvemos a la página 1 para mostrar resultados
        mostrarPagina(1);
    };
}

function inicializarFiltros() {
    let botonesFiltro = document.querySelectorAll('.categories-pills .pill');

    botonesFiltro.forEach(boton => {
        boton.onclick = function() {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            let seleccionada = this.innerText.trim().toLowerCase();

            // Filtramos la data real según la categoría
            if (seleccionada === 'todos') {
                listaFiltrada = [...listaCompletaProductos];
            } else {
                listaFiltrada = listaCompletaProductos.filter(p => 
                    p.categoria.toLowerCase().includes(seleccionada) || 
                    seleccionada.includes(p.categoria.toLowerCase())
                );
            }
            
            // Volvemos a la página 1 para mostrar resultados
            mostrarPagina(1);
        };
    });
}

function inicializarOrdenamiento() {
    let select = document.getElementById('ordenar-productos');
    if (!select) return;

    select.onchange = function() {
        // Ordenamos los datos reales según precio
        if (this.value === 'menor-mayor') {
            listaFiltrada.sort((a, b) => a.precio - b.precio);
        } else if (this.value === 'mayor-menor') {
            listaFiltrada.sort((a, b) => b.precio - a.precio);
        }
        
        // Refrescamos la vista
        mostrarPagina(1);
    };
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
function toggleChat() {
    const chat = document.getElementById('chat-window');
    chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
}
// Función para abrir/cerrar chat
function toggleChat() {
    const chat = document.getElementById('chat-window');
    chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
}

// Escuchar la tecla Enter
document.getElementById('chat-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const content = document.getElementById('chat-content');
    const message = input.value.trim().toLowerCase();

    if (message === "") return;

    // Mostrar mensaje del usuario
    content.innerHTML += `<p style="background: #10b981; color: black; padding: 8px; border-radius: 8px; align-self: flex-end; max-width: 80%;">${input.value}</p>`;
    input.value = "";

    // Respuesta del Bot (Simulada con un pequeño retraso)
    setTimeout(() => {
        let response = "Lo siento, no entiendo tu pregunta. ¿Podrías intentar de otra forma? O puedes contactarnos por WhatsApp.";

        // --- LÓGICA DE PREGUNTAS ---
        if (message.includes("envio") || message.includes("envió") || message.includes("costo")) {
            response = "Hacemos envíos a todo el país. ¡En Mendoza entregamos en 24hs! Si tu compra supera los $50.000, el envío es GRATIS.";
        } 
        else if (message.includes("proteina") || message.includes("suplemento") || message.includes("recomendar")) {
            response = "¡Claro! Si buscas ganar masa, te recomiendo la **Whey Protein de ENA**. Si eres vegano, tenemos la opción de **Swanson**. ¿Buscas algo específico?";
        } 
        else if (message.includes("pago") || message.includes("tarjeta") || message.includes("pagar")) {
            response = "Aceptamos tarjetas de crédito, débito y transferencia (Mercado pago)). ¡Tenemos cuotas sin interés en productos seleccionados!";
        } 
        else if (message.includes("horario") || message.includes("abierto")) {
            response = "Nuestra tienda online funciona las 24hs. La atención al cliente es de Lunes a Viernes de 09:00 a 18:00.";
        } 
        else if (message.includes("creatina")) {
            response = "Actualmente tenemos stock de Creatina Star y ENA. Son las más puras del mercado para mejorar tu potencia.";
        }
        else if (message.includes("hola") || message.includes("buenos dias")) {
            response = "¡Hola! Bienvenido a NeoSuplex. ¿En qué te puedo asesorar hoy?";
        }

        content.innerHTML += `<p style="background: #222; color: #eee; padding: 8px; border-radius: 8px; align-self: flex-start; max-width: 80%;">${response}</p>`;
        
        // Auto-scroll al final
        content.scrollTop = content.scrollHeight;
    }, 600);
}
/* =========================================
   LÓGICA DEL PROCESO DE COMPRA (CHECKOUT)
   ========================================= */

// Función para pasar al Paso 2 (Identificación)
function irPaso2() {
    // Validar que el carrito no esté vacío (usamos tu variable global 'carrito')
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. ¡Agrega algún suplemento primero!");
        return;
    }

    // Ocultar paso 1 y mostrar paso 2
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'block';
    window.scrollTo(0, 0); // Sube la pantalla al inicio
}

// Función para pasar al Paso 3 (Pago)
function irPaso3() {
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'block';
    window.scrollTo(0, 0);
}

// Función Final (Simulación de compra exitosa)
function finalizarCompra() {
    const btn = document.getElementById('btn-finalizar');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btn.disabled = true;

    // Buscamos qué opción eligió el usuario
    const rolSeleccionado = document.querySelector('input[name="rol"]:checked').value;

    setTimeout(() => {
        let mensajeExito = "¡Compra realizada con éxito! Recibirás un mail con el detalle de tu pedido.";
        
        // Si eligió ser Cliente, le damos la buena noticia de los puntos
        if (rolSeleccionado === 'cliente') {
            mensajeExito += "\n\n🌟 ¡Genial! Sumaste 500 puntos NeoSuplex con esta compra para usar en tu próximo descuento.";
        }

        alert(mensajeExito);
        
        // Limpiamos tu carrito correcto del almacenamiento local
        localStorage.removeItem('miCarrito');
        
        // Redirigimos al inicio
        window.location.href = 'index.html';
    }, 2000);
}
// ==========================================
// INICIO AUTOMÁTICO
// ==========================================
actualizarContador();
mostrarCarrito();
obtenerProductosDesdeBackend();