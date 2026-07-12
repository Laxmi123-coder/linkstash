import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import linkRoutes from "./routes/links.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "LinkStash API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});