import express from "express";
import { userData } from "../controller/userController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", verifyToken, userData);

export default router;