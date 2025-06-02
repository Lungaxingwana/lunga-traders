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
import path from "path";
import fs from "fs"; // Add this import
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Auto-create dist folder if it doesn't exist
const distPath = path.join(__dirname, "../frontend/dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Auto-create index.html in dist if it doesn't exist
const indexHtmlPath = path.join(distPath, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  fs.writeFileSync(
    indexHtmlPath,
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome</title>
</head>
<body>
  <h1>It works!</h1>
  <p>This is a placeholder index.html file.</p>
</body>
</html>`
  );
}

app.use(cors({
    origin: ["http://localhost:5173"],
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start server and connect to DB
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectAndRun();
});
