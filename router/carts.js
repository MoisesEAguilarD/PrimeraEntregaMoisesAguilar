import express from 'express';
import CartManager from '../CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send('Cart not found');
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).send('Cart not found');
    res.json(updatedCart);
});

export default router;
