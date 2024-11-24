import { Product } from "../models/product.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import {
  uploadOnCLoudinary,
  deleteFromCloudinary,
} from "../utility/cloudinary.js";
import CategoryTypes from "../utility/CategoryTypes.js";
import { isValidObjectId } from "mongoose";

const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = "30",
    sortType = "desc",
    sortBy = "createdAt",
    query,
    category,
  } = req.query;

  if (!page || !limit) {
    throw new ApiError(400, "Missing limit and page");
  }

  let filter = {};

  if (query) {
    const searchTerms = query.trim().split(" ");
    filter.$or = searchTerms.map((term) => ({
      $or: [
        { name: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ],
    }));
  }

  if (category) {
    const categoryString = Array.isArray(category)
      ? category.join(",")
      : category;

    if (categoryString === "All") {
      filter.category = { $in: CategoryTypes };
    } else {
      filter.category = {
        $in: categoryString.split(",").map((cat) => cat.trim()),
      };
    }
  }

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ [sortBy]: sortType });

  const totalProducts = await Product.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
      },
      "Products retrieved successfully"
    )
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Provide product id to get the details");
  }

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product id format");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

const addAProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const imageLocalUrl = req.file?.path;

  console.log("Body : ", req.body);

  if (!name || !description || !price || !stock || !category) {
    throw new ApiError(400, "Provide all the details to create the product");
  }

  const imageUrl = await uploadOnCLoudinary(imageLocalUrl);

  if (!imageUrl) {
    throw new ApiError(500, "Error while uploading image");
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    stock: Number(stock),
    category,
    image: imageUrl.url,
  });

  if (!product) {
    throw new ApiError(500, "Error while creating the product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, stock, category } = req.body;

  console.log("Body : ", req.body);

  if (!productId) {
    throw new ApiError(400, "Provide product id to change product details");
  }

  if (!name || !description || !price || !stock || !category) {
    throw new ApiError(400, "Provide all the details to update the product");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product details updated successfully"
      )
    );
});

const updateProductImage = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const imageLocalUrl = req.file?.path;

  if (!productId) {
    throw new ApiError(400, "Provide product id to change the product image");
  }

  const product = await Product.findById(productId);

  await deleteFromCloudinary(product.image);
  const newImageUrl = await uploadOnCLoudinary(imageLocalUrl);

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { image: newImageUrl.url },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct, "Product image updated successfully")
    );
});

const removeAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Provide product id to change the product image");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  await deleteFromCloudinary(product.image);

  await Product.findByIdAndDelete(product._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product removed successfully"));
});

export {
  getAllProducts,
  getProductById,
  addAProduct,
  updateProductDetails,
  updateProductImage,
  removeAProduct,
};
