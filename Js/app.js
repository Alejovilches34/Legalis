const cartIcon = document.getElementById("cart_icon");
const modal = document.getElementById("cart-modal");
const closeButton = document.getElementsByClassName("close")[0];

// Abrir el carrito
cartIcon.addEventListener("click", function() {
  modal.style.display = "block";
});

// Cerrar el carrito
closeButton.addEventListener("click", function() {
  modal.style.display = "none";
});

// Cerrar el carrito cuando se hace clic fuera 
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

const getProductos = async() => {
    try {
        const res = await fetch('/libros.json');
        const data = await res.json();
        
        renderizarProductos(data);
        filtrosCategorias(data);
        
    } catch (error) {
        console.log(error);
    }
} 

const $carrito = document.querySelector('#contador');
document.addEventListener('DOMContentLoaded', cargaInicial);

function cargaInicial() {

    obtenerCarritoDelLocalStorage();
    getProductos();
    renderizarCarrito();
}


let CARRITO = [];

const renderizarProductos = (PRODUCTOS) => {

    const $tarjetas = document.querySelector('.tarjetas');
    $tarjetas.innerHTML = '';

    PRODUCTOS.forEach(producto => {

        // Crea div
        const $div = document.createElement('div');
        $div.classList.add('tarjeta');

        // Crea img
        const $img = document.createElement('img');
        $img.src = producto.imagen;
        $img.classList.add('card_img')

        // Crea titulo
        const $h3 = document.createElement('h4');
        $h3.textContent = producto.nombre;

        // Crea boton cont
        const $div2 = document.createElement('div');
        $div2.classList.add('button-container');

        // Crea precio
        const $p = document.createElement('p');
        $p.textContent = "$" + producto.precio;
        $p.classList.add('card_price')

        // Crea boton de agregar
        const $button = document.createElement('button');
        $button.textContent = 'Agregar al carrito';

        // Agregar titulo div
        $div.appendChild($h3);

        // Agregar img al div
        $div.appendChild($img);

        // Agregar precio al div2
        $div2.appendChild($p);

        // Agregar boton al div2
        $div2.appendChild($button);

        // Agregar el div2 al div
        $div.appendChild($div2);

        // Agregar el div al contenedor
        $tarjetas.appendChild($div);

        // Boton
        $button.addEventListener('click', () => {
            console.log('Agregar al carrito');
            agregarAlCarrito(producto);
        });
    });
}


const agregarAlCarrito = (producto) => {
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = CARRITO.find(item => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;      
    } else {
        CARRITO.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    const totalCantidad = CARRITO.reduce((total, item) => total + item.cantidad, 0);
    $carrito.textContent = totalCantidad;

    toastify("Producto agregado al carrito", "success");

    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}


const renderizarCarrito = () => {
    // Seleccionar el contenedor del carrito
    const $contenedorCarrito = document.querySelector('.contenedor_compras');
    $contenedorCarrito.innerHTML = '';

    CARRITO.forEach(producto => {
        const $div = document.createElement('div');
        $div.classList.add('tbody');

        const $div2 = document.createElement('div');
        $div2.classList.add('columna_1');

        const $img = document.createElement('img');
        $img.classList.add('img_cart');
        $img.src = producto.imagen;

        $div2.appendChild($img);
        $div.appendChild($div2);

        const $div3 = document.createElement('div');
        $div3.classList.add('columna_2');
        $div3.textContent = producto.nombre;

        $div.appendChild($div3);

        const $div4 = document.createElement('div');
        $div4.classList.add('columna_3');

        const $input = document.createElement('input');
        $input.type = 'number';
        $input.value = producto.cantidad;

        $div4.appendChild($input);

        $div.appendChild($div4);

        const $div5 = document.createElement('div');
        $div5.classList.add('columna_4');
        $div5.textContent = `$ ${producto.precio * producto.cantidad}`;

        $div.appendChild($div5);

        const $div6 = document.createElement('div');
        $div6.classList.add('columna_5');

        const $button = document.createElement('button');
        $button.classList.add('btn_cart')
        $button.textContent = 'X';

        $div6.appendChild($button);

        $div.appendChild($div6);

        $contenedorCarrito.appendChild($div);

        $button.addEventListener('click', () => {
            eliminarProducto(producto.id);
            const totalCantidad = CARRITO.reduce((total, item) => total + item.cantidad, 0);
            $carrito.textContent = totalCantidad;

        });

        $input.addEventListener('change', () => {
            console.log('Cambiar cantidad');
            cambiarCantidad(producto.id, +($input.value));
            totalIndividual(producto.id, producto.precio, +($input.value));
    
            const totalCantidad = CARRITO.reduce((total, item) => total + item.cantidad, 0);
            $carrito.textContent = totalCantidad;
            toastify("Cantidad cambiada", "success");
            
        });
    });
}


const totalIndividual = (id, precio, cantidad) => {
    const producto = CARRITO.find(producto => producto.id === id);

    // Verificar si la cantidad es mayor a 0
    if (cantidad > 0) {
        // Si la cantidad es mayor a 0, calcular el total
        producto.total = precio * cantidad;
    } else {
        // Si la cantidad es menor o igual a 0, eliminar el producto
        eliminarProducto(id);
    }

    renderizarCarrito();

    guardarCarritoEnLocalStorage();

}

const eliminarProducto = (id) => {
    // Filtrar el carrito para que no tenga el producto con el id que le pasamos
    CARRITO = CARRITO.filter(producto => producto.id !== id);

    toastify("Producto eliminado del carrito", "error")
    renderizarCarrito();
    guardarCarritoEnLocalStorage();

    const totalCantidad = CARRITO.reduce((total, item) => total + item.cantidad, 0);
    $carrito.textContent = totalCantidad;
}

// Creacion de la funcion que se encargue de eliminar un producto 
// del carrito pero de manera individual
const eliminarProductoIndividual = (id) => {
    const producto = CARRITO.find(producto => producto.id === id);

    // Verificar si la cantidad es mayor a 1
    if (producto.cantidad > 1) {
        // Si la cantidad es mayor a 1, solo disminuimos la cantidad
        producto.cantidad--;
    } else {
        // Si la cantidad es igual a 1, eliminamos el producto
        eliminarProducto(id);
    }

    renderizarCarrito();

    guardarCarritoEnLocalStorage();
}

const cambiarCantidad = (id, cantidad) => {
    // Buscar el producto en el carrito
    const producto = CARRITO.find(producto => producto.id === id);

    // Cambiar la cantidad del producto
    producto.cantidad = cantidad;

    // Renderizar el carrito
    renderizarCarrito();
    // guardar el carrito en el local storage
    guardarCarritoEnLocalStorage();
}

const guardarCarritoEnLocalStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(CARRITO));
}

const obtenerCarritoDelLocalStorage = () => {
    if (localStorage.getItem('carrito')) {
        CARRITO = JSON.parse(localStorage.getItem('carrito'));
    }else {
        CARRITO = [];
    }
}



function toastify(mensaje) {
    Toastify({
        text: mensaje,
        duration: 2000,
        newWindow: true,
        gravity: "top", 
        position: "right",
        stopOnFocus: true, 
        style: {
            fontfamily: 'Bitter',
            padding: '6px 20px',
            borderRadius: '30px',
            border: "1.5px solid trasnparent",
            background: '#2b6fec',
            color: '#fff',
            margin: '100px 0 0 660px',
        },
        onclick: function () {}
    }).showToast();
}

