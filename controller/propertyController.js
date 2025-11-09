import TransactionRequest from "../models/TransactionRequest.js";
import LandProperty from "../models/landProperty.js";
import BlockchainTx from "../models/Blockchaintxn.js";
import crypto from "crypto";

// ✅ Finalize property transfer after acceptance
export const finalizeTransfer = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { registrar } = req.body; // who’s authorizing (Registrar/Admin)

    const request = await TransactionRequest.findOne({ requestId });
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (request.status !== "ACCEPTED") {
      return res
        .status(400)
        .json({ success: false, message: "Request not accepted yet" });
    }

    const land = await LandProperty.findOne({ landId: request.landId });
    if (!land)
      return res
        .status(404)
        .json({ success: false, message: "Land not found" });

    // ---- Blockchain-like transfer starts ----
    const previousTx = await BlockchainTx.findOne({
      landId: request.landId,
    }).sort({ timestamp: -1 });
    const txId = crypto.randomBytes(6).toString("hex");
    const timestamp = new Date();

    const txData = {
      txId,
      landId: request.landId,
      fromAadhaar: land.owner,
      toAadhaar: request.buyerAadhaar,
      action: "TRANSFERRED",
      by: registrar || "System_Registrar",
      timestamp,
      previousTx: previousTx ? previousTx.txId : null,
    };

    txData.hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(txData))
      .digest("hex");

    const blockchainRecord = new BlockchainTx(txData);
    await blockchainRecord.save();

    // Update property details
    land.previousOwners.push({
      owner: land.owner,
      from: land.registrationDate,
      to: timestamp,
    });

    land.history.push({
      txId,
      action: "TRANSFERRED",
      by: registrar || "System_Registrar",
      timestamp,
    });

    land.owner = request.buyerAadhaar;
    land.ownerName = request.buyerName;
    land.lastUpdated = timestamp;
    await land.save();

    // Update transaction request status
    request.status = "TRANSFERRED";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Ownership transferred and recorded on blockchain (Mongo)",
      data: {
        landId: request.landId,
        newOwner: { aadhaar: request.buyerAadhaar, name: request.buyerName },
        txId,
        hash: txData.hash,
      },
    });
  } catch (err) {
    console.error("Error finalizing transfer:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
