import mongoose from "mongoose";

const previousOwnerSchema = new mongoose.Schema({
  owner: { type: String, required: true }, // Aadhaar or user ref
  from: { type: Date, required: true },
  to: { type: Date, required: true },
});

const historySchema = new mongoose.Schema({
  txId: { type: String, required: true }, // blockchain transaction ID
  action: {
    type: String,
    enum: ["CREATED", "TRANSFERRED", "UPDATED", "SOLD"],
    required: true,
  },
  by: { type: String, required: true }, // registrar or user ID
  timestamp: { type: Date, default: Date.now },
});

const boundarySchema = new mongoose.Schema({
  north: { type: String },
  south: { type: String },
  east: { type: String },
  west: { type: String },
});

const landPropertySchema = new mongoose.Schema(
  {
    landId: { type: String, unique: true, required: true },
    titleNumber: { type: String, required: true },
    landType: {
      type: String,
      enum: ["Residential", "Commercial", "Agricultural", "Industrial"],
      required: true,
    },
    ownershipType: {
      type: String,
      enum: ["Freehold", "Leasehold"],
      required: true,
    },

    owner: { type: String, required: true }, // Aadhaar or user ref
    ownerName: { type: String, required: true },

    area: { type: Number, required: true },
    unit: {
      type: String,
      enum: ["sq.ft", "sq.m", "acre", "hectare"],
      default: "sq.ft",
    },

    surveyNumber: { type: String },
    mutationNumber: { type: String },

    location: { type: String, required: true },
    coordinates: { type: String }, // could also be { lat, lng } if you prefer object

    boundary: boundarySchema,

    marketValue: { type: Number, required: true },

    registrationDate: { type: Date, default: Date.now },
    legalStatus: {
      type: String,
      enum: ["REGISTERED", "PENDING", "DISPUTED"],
      default: "REGISTERED",
    },
    currentStatus: {
      type: String,
      enum: ["owned", "for_sale", "sold"],
      default: "owned",
    },

    docHash: { type: String, required: true },

    previousOwners: [previousOwnerSchema],
    history: [historySchema],

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("LandProperty", landPropertySchema);
