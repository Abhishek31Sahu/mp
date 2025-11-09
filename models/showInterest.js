import mongoose from "mongoose";
const schema = mongoose.Schema;

const reviewSchema = new schema({
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Interest", reviewSchema);
