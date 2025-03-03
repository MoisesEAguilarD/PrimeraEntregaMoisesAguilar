const socket = io();

const formNewProduct = document.getElementById("formNewProduct");
const productsList = document.getElementById("productsList");

// Enviar nuevo producto al servidor
formNewProduct.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(formNewProduct);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });

    socket.emit("newProduct", productData);
    formNewProduct.reset(); // Limpiar formulario después de enviar
});

// Escuchar actualización de productos desde el servidor
socket.on("updateProducts", (products) => {
    productsList.innerHTML = ""; // Limpiar lista antes de actualizar

    products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.id = `product-${product._id}`; // Mongo usa _id en lugar de id
        productItem.innerHTML = `
            ${product.title} - $${product.price} 
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
        productsList.appendChild(productItem);
    });
});

// Enviar solicitud para eliminar un producto
function deleteProduct(productId) {
    socket.emit("deleteProduct", productId);
}
