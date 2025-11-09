import mongoose from "mongoose";

const transactionRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  landId: String,
  buyerAadhaar: String,
  buyerName: String,
  sellerAadhaar: String,
  offerAmount: Number,
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "TRANSFERRED"],
    default: "PENDING",
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("TransactionRequest", transactionRequestSchema);
