import mongoose from "mongoose";
import ProductModel from "../models/ProductModel.js"; // Asegúrate de tener este modelo en Mongoose

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query }) {
        try {
            // Convertir a valores numéricos
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            // Filtro dinámico para buscar por categoría o disponibilidad
            let filter = {};
            if (query) {
                if (query === "available") filter.stock = { $gt: 0 }; // Productos en stock
                else filter.category = query; // Filtrar por categoría
            }

            // Opciones de paginación
            const options = {
                limit,
                page,
                sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}, // Ordenar por precio
                lean: true, // Devuelve objetos simples en lugar de documentos Mongoose
            };

            // Obtener productos con paginación
            const products = await ProductModel.paginate(filter, options);

            return {
                status: "success",
                payload: products.docs, // Lista de productos
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.error("Error en getProducts:", error);
            return { status: "error", message: "Error al obtener productos" };
        }
    }

    async getById(id) {
        try {
            const product = await ProductModel.findById(id).lean();
            return product || null;
        } catch (error) {
            console.error("Error en getById:", error);
            return null;
        }
    }

    async addProduct(product) {
        try {
            const newProduct = await ProductModel.create(product);
            return newProduct;
        } catch (error) {
            console.error("Error en addProduct:", error);
            return null;
        }
    }

    async update(id, updates) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, { new: true }).lean();
            return updatedProduct || null;
        } catch (error) {
            console.error("Error en update:", error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await ProductModel.findByIdAndDelete(id);
            return result ? true : false;
        } catch (error) {
            console.error("Error en deleteProduct:", error);
            return false;
        }
    }
}

export default ProductManager;
