import mongoose from "mongoose";

const blockchainTxSchema = new mongoose.Schema({
  txId: { type: String, required: true, unique: true },
  landId: { type: String, required: true },
  fromAadhaar: { type: String },
  toAadhaar: { type: String },
  action: {
    type: String,
    enum: ["CREATED", "TRANSFERRED", "UPDATED"],
    required: true,
  },
  by: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  previousTx: { type: String }, // hash/ID of the previous block
  hash: { type: String }, // optional computed hash for immutability
});

export default mongoose.model("BlockchainTx", blockchainTxSchema);
