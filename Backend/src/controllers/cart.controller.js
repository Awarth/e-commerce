import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const addItemToCart = asyncHandler(async (req, res) => {
  let { productId, quantity } = req.body;
  const userId = req.user._id;

  quantity = Number(quantity);

  if (!productId) {
    throw new ApiError(404, "Provide product id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      products: [{ product: product._id, quantity }],
    });
    await cart.save();
  } else {
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      if (cart.products[productIndex].quantity + quantity <= product.stock) {
        cart.products[productIndex].quantity += quantity;
      }
    } else {
      cart.products.push({ product: product._id, quantity });
    }
    await cart.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  if (!productId) {
    throw new ApiError(404, "Provide product id");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.products = cart.products.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  let { productId, quantity } = req.body;
  const userId = req.user._id;

  quantity = Number(quantity);

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const productIndex = cart.products.findIndex(
    (item) => item.product.toString() === productId
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity <= 0) {
    cart.products.splice(productIndex, 1);
  } else {
    cart.products[productIndex].quantity = quantity;
  }

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const getCartDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product",
    "name price stock image category"
  );

  if (!cart) {
    return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Cart.findOneAndDelete({ user: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Cart cleared successfully"));
});

export {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  getCartDetails,
  clearCart,
};
