import express from "express";
import { getProduct, getAllProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { protectRoute } from "../middlewares/user.middleware.js";
import { multiUploadProduct } from "../libs/db.js";

const router = express.Router();

router.get("/all-products", getAllProducts);

router.get("/get-product/:_id", protectRoute, getProduct);

router.post("/create-product", protectRoute, multiUploadProduct, createProduct);

router.put("/update-product/:_id", protectRoute, multiUploadProduct, updateProduct);

router.delete("/delete-product/:_id", protectRoute, deleteProduct);

export default router;
