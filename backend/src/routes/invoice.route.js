import express from "express";
import { getAllInvoices, getUserInvoices, addInvoice, updateInvoice, deleteInvoice } from "../controllers/invoice.controller.js";
import { protectRoute } from "../middlewares/user.middleware.js";
import { multiUploadInvoice } from "../libs/db.js";

const router = express.Router();

router.get("/get-all-invoices", protectRoute, getAllInvoices);
router.get("/get-user-invoices/:_id", protectRoute, getUserInvoices);

router.post("/add-invoice/:_id", protectRoute, multiUploadInvoice, addInvoice);

router.put("/update-invoice/:_id", protectRoute, multiUploadInvoice, updateInvoice);

router.delete("/delete-invoice/:_id/:cart_id", protectRoute, deleteInvoice);

export default router;