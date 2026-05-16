import { Router } from "express";
import { sendName } from "./demo.controller";
const router: Router = Router();

router.post("/send", sendName);

export default router;
