const socket = io();

const formNewProduct = document.getElementById("formNewProduct");
const productsList = document.getElementById("productsList");

formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formNewProduct);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  socket.emit("newProduct", productData);
});

socket.on("productAdded", (newProduct) => {
    const productItem = document.createElement("li");
    productItem.id = `product-${newProduct.id}`;
    productItem.innerHTML = `
      ${newProduct.title} - ${newProduct.price} 
      <button onclick="deleteProduct('${newProduct.id}')">Eliminar</button>
    `;
    productsList.appendChild(productItem);
});

socket.on("productDeleted", (productId) => {
    const productItem = document.getElementById(`product-${productId}`);
    if (productItem) {
        productItem.remove();
    }
});

function deleteProduct(productId) {
    socket.emit("deleteProduct", productId);
}
