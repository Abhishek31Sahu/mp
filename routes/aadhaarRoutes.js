import express from "express";
import { authenticateAadhaar } from "../utils/uidaiClient.js";
import { verifyAuthorization } from "../middelwares/auth.js";
const router = express.Router();

// Aadhaar Authentication
router.post("/auth", verifyAuthorization, async (req, res) => {
  try {
    const { uid } = req.body;
    const response = await authenticateAadhaar(uid);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

export default router;
