import express from "express";
const router = express.Router();
import multer from "multer";
import { storage } from "../services/cloudConfig.js";
const upload = multer({ storage });
import { verifyAuthorization } from "../middelwares/auth.js";
import {
  showProperty,
  applySale,
  availableForSale,
} from "../controller/property.js";

router.post("/own", verifyAuthorization, showProperty);
router.put("/sell", verifyAuthorization, upload.single("image1"), applySale);
router.post("/find", availableForSale);

export default router;
