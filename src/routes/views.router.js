import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager(); // 🔹 Ya no necesita ruta de archivo

// 🔹 Página principal con paginación y filtros
viewsRouter.get("/", async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query); // ✅ Usa query params
        res.render("home", { products: result.payload }); // ✅ Enviar solo la lista de productos
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 🔹 Página de productos en tiempo real con WebSockets
viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query);
        res.render("realTimeProducts", { products: result.payload });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default viewsRouter;
