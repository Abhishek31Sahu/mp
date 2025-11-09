import express from "express";
const router = express.Router();
import { finalizeTransfer } from "../controller/propertyController.js";
import { buyerRequest, sellerRespond } from "../controller/createInterest.js";
import { verifyAuthorization } from "../middelwares/auth.js";

router.post("/", verifyAuthorization, buyerRequest);
router.put("/:id/respond", verifyAuthorization, sellerRespond);
router.post("/:id/transfer", verifyAuthorization, finalizeTransfer);

export default router;
