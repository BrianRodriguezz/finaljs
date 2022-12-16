const lista = document.querySelector("#productos")
const verCarrito = document.querySelector("#imgCarrito")
const modal = document.querySelector("#modalContainer")
let btnCerrarSesion = document.querySelector("#cerrarSesion button")
let clima_div = document.getElementById("clima-div");

let carrito = JSON.parse(localStorage.getItem("carrito")) || []

fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
        data.forEach((producto) => {
            const contenido = document.createElement("div")
            contenido.className = "cards"
            contenido.innerHTML = `
        <h3>${producto.producto}</h3>
        <img src="${producto.img}"></img>
        <p>${producto.descripcion}</p>
        <p class="precio">$${producto.precio}</p>
        `
            lista.append(contenido)

            //Creo el boton de comprar
            let comprar = document.createElement("button")
            comprar.innerText = "comprar"
            comprar.className = "comprar"
            contenido.append(comprar)

            //Evento para crear el carrito de compras
            comprar.addEventListener("click", () => {

                //Busco a travez del metodo some el producto repetido por su Id
                const repetido = carrito.some((productoRepetido) => productoRepetido.id === producto.id)

                //Si Repetido da True voy a recorrer el carrito y le sumo la cantidad
                if (repetido === true) {
                    carrito.map((prod) => {
                        if (prod.id === producto.id) {
                            prod.cantidad++
                        }
                    })
                } else {
                    carrito.push({
                        id: producto.id,
                        producto: producto.producto,
                        img: producto.img,
                        precio: producto.precio,
                        cantidad: producto.cantidad
                    })
                }
                console.log(carrito)
                guardarCarrito()
            })
        });
    })

//Modal del carrito de compras
const pintarCarrito = () => {
    modalContainer.innerHTML = ""
    modalContainer.style.display = "flex"
    const modal = document.createElement("div")
    modal.className = "modalHeader"
    modal.innerHTML = `
    <h1 class= "modalTitulo">Carrito de ${nombre}</h1>
    `
    modalContainer.append(modal)

    const modalButton = document.createElement("h1")
    modalButton.innerHTML = "x"
    modalButton.className = "modalHeaderButton"

    modalButton.addEventListener("click", () => {
        modalContainer.style.display = "none"
    })
    modal.append(modalButton)

    //Contenido que aparece en el Carrito
    carrito.forEach((producto) => {
        let carritoContent = document.createElement("div")
        carritoContent.className = "modalContenido"
        carritoContent.innerHTML = `
        <h3>${producto.producto}</h3>
        <img src="${producto.img}"></img>
        <p class="precio">$${producto.precio}</p>
        <span class="restar"> ➖ </span>
        <p>Cantidad: ${producto.cantidad}</p>
        <span class="sumar"> ➕ </span>
        <p>Total: ${producto.cantidad * producto.precio}
        <span class="eliminarProducto"> ❌ </span>
        `
        modalContainer.append(carritoContent)

        //Evento para Restar Productos
        let restar = carritoContent.querySelector(".restar")
        restar.addEventListener("click", () => {
            if (producto.cantidad !== 0) {
                producto.cantidad--
            }
            guardarCarrito()
            pintarCarrito()
        })

        //Evento para Sumar Productos
        let sumar = carritoContent.querySelector(".sumar")
        sumar.addEventListener("click", () => {
            producto.cantidad++
            guardarCarrito()
            pintarCarrito()
        })

        //Evento para Eliminar Productos
        let eliminar = carritoContent.querySelector(".eliminarProducto")
        eliminar.addEventListener("click", () => {
            eliminarProductoCarrito(producto.id)
        })
    })

    //Consigo el total de la compra a traves del metodo reduce
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0)
    const totalCompra = document.createElement("div")
    totalCompra.className = "total"
    totalCompra.innerHTML = `
    Total a pagar: $${total}
    `
    modalContainer.append(totalCompra)

    //Boton para Finalizar la Compra
    const finalizarCompra = document.createElement("button")
    finalizarCompra.className = "finalizar"
    finalizarCompra.innerHTML = `
    Finalizar Compra
    `
    modalContainer.append(finalizarCompra)
    finalizarCompra.addEventListener("click", realizarCompra)
}

verCarrito.addEventListener("click", pintarCarrito)

const realizarCompra = () => {
    if (carrito != "") {
        Swal.fire(
            'Compra Realizada con Éxito',
            `Muchas gracias ${nombre} por su compra`,
            'success'
        )
        localStorage.removeItem("carrito")
    } else {
        Swal.fire(
            'Error en la compra!',
            'Debe tener productos en el Carrito',
            'error'
        )
    }
}

const eliminarProductoCarrito = (id) => {
    //Capturo el Id que deseo Eliminar
    const buscarId = carrito.find((element) => element.id === id)
    //Filtro los productos del carrito, me retorna todos los elementos que no tenga el Id seleccionado
    carrito = carrito.filter((carritoId) => {
        return carritoId !== buscarId
    })
    guardarCarrito()
    pintarCarrito()
}

const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

// Traigo los valores que lleve al local
const traerUsuarioPagina = localStorage.getItem("datos")

// El nuevo array que traigo con los datos que se guardaron
const usuarioCorrecto = JSON.parse(localStorage.getItem("datos"))
//console.log(usuarioCorrecto)

//Desestructuracion del objeto que traigo
const {nombre} = usuarioCorrecto

//Evento para volver al inicio de pagina
btnCerrarSesion.addEventListener("click",()=> {
    localStorage.removeItem("datos")
    localStorage.removeItem("carrito")
    location.href = "index.html"
})

//Fetch y clima
const url = "https://api.openweathermap.org/data/2.5/weather?q=Buenos Aires&lang=es&units=metric&appid=a9e10258cf0e599a2cc1fdf9eaf61083"
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.main > "24"){
            clima_div.style.backgroundColor = "orange";
            clima_div.innerHTML = `<h1> Dia caluroso 🌡 </h1>`;
        } 
        else{
            clima_div.style.backgroundColor = "blue";
            clima_div.innerHTML=  `<h1> Dia fresco ❄ </h1>`;
        }
    });