import mongoose from "mongoose";

const schema = mongoose.Schema;

const listingSchema = new schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    filename: { type: String },
    url: { type: String },
  },
  landId: { type: String, required: true, unique: true },
  showInterest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: { type: Date, default: Date.now() },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
