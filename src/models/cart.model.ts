import { models, model, Schema } from "mongoose";

const cartSchema = new Schema({
    product_id: {type: String, required: true},
    quantity: {type: Number, required: true},
    user_id: {type:String, required: true},

},{timestamps:true});

const Cart = models.Cart || model('Cart', cartSchema);

export default Cart;