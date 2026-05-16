import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotnenv from "dotenv";
import { connectDB } from "./config/db";

import demoRoutes from "./modules/demo/demo.route";
import { app, server } from "./socket/socket";
dotnenv.config();


const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/demo", demoRoutes);

// test route
// app.get("/", (_req: Request, res: Response) => {
//   res.status(200).json({
//     message: "Server is running",
//   });
// });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
