import express from "express";
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const cartManager = new CartManager();

// 🔹 Crear un nuevo carrito
router.post("/", async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

// 🔹 Obtener un carrito por ID con productos completos
router.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Cart not found" });
    res.json(cart);
});

// 🔹 Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ status: "error", message: "Cart not found" });
    res.json(updatedCart);
});

// 🔹 Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ status: "error", message: "Cart or Product not found" });
    res.json(updatedCart);
});

// 🔹 Actualizar un carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
    if (!updatedCart) return res.status(404).json({ status: "error", message: "Cart not found" });
    res.json(updatedCart);
});

// 🔹 Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!updatedCart) return res.status(404).json({ status: "error", message: "Cart or Product not found" });
    res.json(updatedCart);
});

// 🔹 Vaciar completamente un carrito
router.delete("/:cid", async (req, res) => {
    const success = await cartManager.clearCart(req.params.cid);
    if (!success) return res.status(404).json({ status: "error", message: "Cart not found" });
    res.status(204).send();
});

export default router;
