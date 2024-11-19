import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userDetail: {
    name: { type: String, required: true, trim: true },
    phoneNo: { type: String, required: true, trim: true },
    alternatePhoneNo: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    cityTownVillage: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ["UPI", "COD"],
    default: "COD",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Order = mongoose.model("Order", orderSchema);
