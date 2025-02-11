import express from 'express';
import productsRouter from '../router/products.js';
import cartsRouter from '../router/carts.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from "http";
import viewsRouter from '../router/views.router.js';
import ProductManager from '../ProductManager.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const PORT = 8080;
app.use(express.json());
app.use(express.static("public"));

//endpoints
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

//websockets
const productManager = new ProductManager("./data/products.json");
io.on("connection", (socket)=> {
    console.log("Nuevo Usuario Conectado");

    socket.on("newProduct", async(productData)=> {
        try {
            const newProduct = await productManager.addProduct(productData);
            io.emit("productAdded", newProduct);        
        } catch (error) {
            console.log("Error al añadir producto", error);
        }

    });

    socket.on("deleteProduct", async (productId)=> {
        try {
            await productManager.deleteProduct(productId);
            io.emit("productDeleted", productId);
        } catch (error) {
            console.log("Error al eliminar el Producto", error);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Iniciado en: http://localhost:${PORT}`);
});