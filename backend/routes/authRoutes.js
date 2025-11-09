import express from "express";
import { registerUser, loginUser, changePassword } from "../controller/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", changePassword);

export default router;