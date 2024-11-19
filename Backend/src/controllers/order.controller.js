import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const createAOrder = asyncHandler(async (req, res) => {
  const {
    userDetail,
    products,
    totalAmount,
    paymentMode = "COD",
    paymentStatus = "unpaid",
  } = req.body;
  const userId = req.user._id;

  if (!products || products.length === 0) {
    throw new ApiError(400, "No products provided in order");
  }

  const orders = [];

  for (const item of products) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, `Product with Id ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock from ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();

    const order = await Order.create({
      user: userId,
      userDetail,
      product: item.product,
      quantity: item.quantity,
      totalAmount,
      paymentMode,
      status: "pending",
      paymentStatus,
    });

    orders.push(order);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, orders, "Order placed successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = req.user.role === "admin";

  const filter = isAdmin ? {} : { user: req.user._id };

  try {
    const orders = await Order.find(filter)
      .populate("product", "name price")
      .populate("user", "name email");

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getUserOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("product", "name quantity image")
    .sort({ createdAt: -1 });

  if (orders.length === 0 || !orders) {
    return res.status(200).json(new ApiResponse(200, null, "No orders found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const order = await Order.findById(orderId)
    .populate("product", "name price image")
    .populate("user", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!isAdmin && order.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to view this order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const status = req.body.status;
  const role = req.user.role;

  if (role !== "admin") {
    throw new ApiError(403, "Only admin can update order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!["pending", "completed", "failed"].includes(status)) {
    throw new ApiError(404, "Invalid status value");
  }

  order.status = status;
  if (status === "completed") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const role = req.user.role;

  const order = await Order.findById(orderId);

  if (role !== "admin" && order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to cancel this order");
  }

  const product = await Product.findById(order.product);

  if (product) {
    product.stock += order.quantity;
    await product.save();
  }

  order.status = "failed";
  order.paymentStatus = "unpaid";
  await order.save();

  return res
    .status(200)
    .json(new ApiError(200, order, "Order canceled successfully"));
});

export {
  createAOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrder,
};
