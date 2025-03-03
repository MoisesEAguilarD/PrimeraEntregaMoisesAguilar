import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getAll();
    res.json(products);
});


router.get('/:pid', async (req, res) => {
    const product = await productManager.getById(req.params.pid);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});


router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = await productManager.add({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
});


router.put('/:pid', async (req, res) => {
    const updates = req.body;
    const updatedProduct = await productManager.update(req.params.pid, updates);
    if (!updatedProduct) return res.status(404).send('Product not found');
    res.json(updatedProduct);
});



router.delete('/:pid', async (req, res) => {
    const success = await productManager.delete(req.params.pid);
    if (!success) return res.status(404).send('Product not found');
    res.status(204).send();
});

export default router;