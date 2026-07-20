import express from "express";

import authMiddleware from "../middleware/auth.js";
import { generateGeminiAssist, verifyGeminiKey } from "../controllers/geminiController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/verify", verifyGeminiKey);
router.post("/assist", generateGeminiAssist);

export default router;