import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },

    price: { type: Number, default: 0.0 },
    purchasingPrice: { type: Number, default: 0.0 },
    countInStock: { type: Number, default: 0 },

    images: { type: [], required: true, default: [] },
    features: { type: [], required: true, default: [] },
    rating: { type: Number, required: false, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

// delete old model if exists

if (mongoose.models && mongoose.models["products"])
  delete mongoose.models["products"];

export default mongoose.model("products", productSchema);
