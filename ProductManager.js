import fs from 'fs'; 
import path from 'path';
import { nanoid } from 'nanoid';

class ProductManager {
    constructor() {
        this.filePath = path.join(path.resolve(), 'data/products.json');
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

    // GET "/"
    async getProducts() {
        return await this._readFile();
    }

    // GET "/:pid"
    async getById(id) {
        const products = await this._readFile();
        return products.find((p) => p.id === id);
    }

    // POST "/"
    async add(product) {
        const products = await this._readFile();
        const newProduct = { 
            id: nanoid(),  // ID unico con nanoid
            code: nanoid(), // Codigo de producto unico con nanoid
            ...product 
        };
        products.push(newProduct);
        await this._writeFile(products);
        return newProduct;
    }

    // PUT "/:pid"
    async update(id, updates) {
        const products = await this._readFile();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updates, id };
        await this._writeFile(products);
        return products[index];
    }

    // DELETE "/:pid"
    async delete(id) {
        const products = await this._readFile();
        const filteredProducts = products.filter((p) => p.id !== id);
        if (products.length === filteredProducts.length) return false;
        await this._writeFile(filteredProducts);
        return true;
    }
}

export default ProductManager;
