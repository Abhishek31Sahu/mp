import TransactionRequest from "../models/TransactionRequest";
import Property from "../models/landProperty";

export const sellerRespond = async (req, res) => {
  try {
    const { action } = req.body; // "ACCEPTED" or "REJECTED"
    const reqId = req.params.id;

    const request = await TransactionRequest.findOne({ requestId: reqId });
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "PENDING")
      return res.status(400).json({ message: "Request already processed" });

    if (action === "ACCEPTED") {
      request.status = "ACCEPTED";
    } else if (action === "REJECTED") {
      request.status = "REJECTED";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await request.save();
    res.json({ message: `Request ${action.toLowerCase()}`, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating request" });
  }
};

export const buyerRequest = async (req, res) => {
  try {
    const { landId, buyerAadhaar, buyerName, offerAmount } = req.body;

    const land = await Property.findOne({ landId });
    if (!land) return res.status(404).json({ message: "Land not found" });

    const requestId = "REQ-" + crypto.randomBytes(4).toString("hex");
    const newReq = new TransactionRequest({
      requestId,
      landId,
      buyerAadhaar,
      buyerName,
      sellerAadhaar: land.owner,
      offerAmount,
    });

    await newReq.save();
    res.status(201).json({ message: "Request sent successfully", requestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request" });
  }
};
