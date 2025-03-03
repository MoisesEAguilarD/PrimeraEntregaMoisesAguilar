import mongoose from "mongoose";
import CartModel from "../models/CartModel.js";

class CartManager {
    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(id) {
        return await CartModel.findById(id).populate("products.product").lean();
    }

    async addProductToCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return cart;
    }

    async updateCart(cartId, products) {
        return await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return null;
        }

        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        return await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
    }
}

export default CartManager;
