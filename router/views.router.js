import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./data/products.json");

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts(); // 🔹 Asegurarse de obtener productos
        res.render("realTimeProducts", { products }); // 🔹 Ahora se envían a la vista
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default viewsRouter;
