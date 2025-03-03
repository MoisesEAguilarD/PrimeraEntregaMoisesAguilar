import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
});

productSchema.plugin(mongoosePaginate); // Agregar paginación
const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
