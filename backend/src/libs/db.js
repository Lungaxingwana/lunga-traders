import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import { MongoClient, GridFSBucket } from 'mongodb';
import fs from 'fs';
dotenv.config();

export const upload = multer({ storage: multer.memoryStorage() });

export const multiUploadLogin = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'email' },
  { name: 'password' }
]);

export const multiUploadUser = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'email' },
  { name: 'password' },
  { name: 'role' },
  { name: 'last_seen' },
  { name: 'first_name' },
  { name: 'last_name' },
  { name: 'gender' },
  { name: 'cell_number' },
  { name: 'address' },
  { name: 'profile_image_id' },
  { name: 'profile_picture' }
]);

export const multiUploadInvoice = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'user_id' },
  { name: 'cart[product_id]' },
  { name: 'cart[quantity]' },
  { name: 'cart[size]' },
  { name: 'cart[color]' },
  { name: 'total_amount' },
  { name: 'payment_status' },
  { name: 'payment_method' },
  { name: 'deposit[deposit_amount]' },
  { name: 'deposit[created_at]' },
  { name: 'delivery_method' },
  { name: 'delivery_address' },
  { name: 'createdAt' }
]);

export const multiUploadProduct = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'user_id' },
  { name: 'make' },
  { name: 'model' },
  { name: 'year' },
  { name: 'category' },
  { name: 'sub_category' },
  { name: 'tags' },
  { name: 'description' },
  { name: 'color' },
  { name: 'size' },
  { name: 'images_src' },
  { name: 'images_src_id' },
  { name: 'original_price' },
  { name: 'sale_price' },
  { name: 'purchase_quantity' },
  { name: 'stock_quantity' },
  { name: 'rate_review' },
  { name: 'comment' },
  { name: 'payment_status' },
]);

export let gridFSBucket; // Store GridFSBucket instance for reuse

export const connectAndRun = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected (mongoose)');

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('MongoDB connected (native)');

    const db = client.db();
    gridFSBucket = new GridFSBucket(db, { bucketName: 'images' });

    if (!gridFSBucket) {
      throw new Error('Failed to initialize GridFSBucket');
    }

    const filePath = './myFile';
    if (fs.existsSync(filePath)) {
      fs.createReadStream(filePath).pipe(
        gridFSBucket.openUploadStream('myFile', {
          chunkSizeBytes: 1048576,
          metadata: { field: 'myFile', value: 'myValue' },
        })
      );
    } else {
      console.warn(`File not found: ${filePath}. Skipping upload.`);
    }

    const cursor = gridFSBucket.find({});
    for await (const doc of cursor) {
      console.log(doc);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};