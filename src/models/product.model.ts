import { models, model, Schema } from "mongoose";

const productSchema = new Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    category: { type: String, required: true },
    sub_category: { type: String, required: true },
    user_id: { type: String, required: true },
    purchace_quantity: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    description: { type: String, required: true },
    original_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    ratio_review: { type: Number },
    number_of_reviews_done: { type: Number },
    tags: { type: String },
    buying: {type:Boolean, require:true},
    image_src: {type: String},
    images_src: [{ type: String }],
}, { timestamps: true });

const Product = models.Product || model('Product', productSchema);

export default Product;
