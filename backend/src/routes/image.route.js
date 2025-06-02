import express from "express";
import { uploadImage, getImage, updateImage, deleteImage, getAllImages } from "../controllers/image.controller.js";
import { upload } from "../libs/db.js";

const router = express.Router();

router.get("/get-all-images/", getAllImages);
router.get("/get-image/:_id", getImage);
router.post('/upload-image', upload.single('file'), uploadImage);
router.delete("/delete-image/:_id", deleteImage);
router.patch("/update-image/:_id", upload.single('file'), updateImage);

export default router;
