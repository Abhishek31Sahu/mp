import express from "express";
const router = express.Router();
import { signIn, signUp } from "../controller/authController.js";
import { signupValidation } from "../middelwares/authValidation.js";
router.post("/register", signupValidation, signUp);
router.post("/login", signIn);

export default router;
