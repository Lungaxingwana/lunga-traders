import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import imagesRoutes from "./routes/image.route.js";
import userRoutes from "./routes/users.route.js";
import productRoutes from "./routes/products.route.js";
import invoiceRoutes from "./routes/invoice.route.js";
import cookieParser from 'cookie-parser';
import { app, server } from './libs/socket.js';
import { connectAndRun } from './libs/db.js';
dotenv.config();

const PORT = process.env.PORT;

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use("/api/images", imagesRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use(morgan('dev'));

// Start server and connect to DB
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectAndRun();
});
