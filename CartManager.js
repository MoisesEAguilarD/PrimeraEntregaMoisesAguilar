import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

class CartManager {
    constructor() {
        this.filePath = path.join(path.resolve(), 'data/carts.json');
    }

    async _readFile() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async _writeFile(data) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this._readFile();
        const newCart = { id: nanoid(), products: [] };
        carts.push(newCart);
        await this._writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this._readFile();
        return carts.find((c) => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this._readFile();
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex((p) => p.product === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this._writeFile(carts);
        return cart;
    }
}

export default CartManager;