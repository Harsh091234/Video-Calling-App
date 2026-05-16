import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotnenv from "dotenv";
import { connectDB } from "./config/db";

import demoRoutes from "./modules/demo/demo.route.js"
dotnenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors(),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use("/api/demo", demoRoutes)
// test route
// app.get("/", (_req: Request, res: Response) => {
//   res.status(200).json({
//     message: "Server is running",
//   });
// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
