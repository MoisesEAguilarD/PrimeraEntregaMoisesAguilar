import express from "express";
import productsRouter from "../routes/products.js";
import cartsRouter from "../routes/carts.js";
import viewsRouter from "../routes/views.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import ProductManager from "../dao/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;
const MONGO_URI = "mongodb://localhost:27017/ecommerce"; // 📌 Asegúrate de que esta URL es correcta

// 🔹 Conectar a MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("🟢 Conectado a MongoDB"))
    .catch((err) => console.error("🔴 Error en MongoDB:", err));

const productManager = new ProductManager();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("public"));

// 🔹 Endpoints API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// 🔹 WebSockets
io.on("connection", (socket) => {
    console.log("Nuevo Usuario Conectado");

    // Enviar lista de productos cuando un cliente se conecta
    productManager.getProducts({}).then((result) => {
        socket.emit("updateProducts", result.payload);
    });

    // Escuchar nuevos productos y emitir actualización
    socket.on("newProduct", async (productData) => {
        try {
            await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts({});
            io.emit("updateProducts", updatedProducts.payload);
        } catch (error) {
            console.log("Error al añadir producto", error);
        }
    });

    // Escuchar eliminación de productos y emitir actualización
    socket.on("deleteProduct", async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts({});
            io.emit("updateProducts", updatedProducts.payload);
        } catch (error) {
            console.log("Error al eliminar el Producto", error);
        }
    });
});

// 🔹 Iniciar Servidor
server.listen(PORT, () => {
    console.log(`🟢 Servidor Iniciado en: http://localhost:${PORT}`);
});
