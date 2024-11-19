import mongoose, { Schema } from "mongoose";
import CategoryTypes from "../utility/CategoryTypes.js";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(CategoryTypes),
    required: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
