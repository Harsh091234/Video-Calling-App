import { Router } from "express";
import { sendName } from "./demo.controller.js";
const router: Router = Router();

router.post("/send", sendName);
export default router;
