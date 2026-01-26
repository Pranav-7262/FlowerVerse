import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT;

import authRoutes from "./routes/auth.routes.js";
import flowerRoutes from "./routes/flower.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

// console.log(process.env.PORT);
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.status(200).send({ message: "HELLO !!" });
});

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/flowers", flowerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`App is running on ${PORT}`);
    }),
  )
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
