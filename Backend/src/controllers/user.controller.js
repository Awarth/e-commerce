import { User } from "../models/user.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user;

  console.log("User ID from request:", userId);

  if (!userId) {
    throw new ApiError(400, "User ID is required to fetch user details");
  }

  const user = await User.findById(userId).select(
    "-password -refreshToken -accessToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const createAUser = asyncHandler(async (req, res) => {
  const { name, password, email, role = "customer" } = req.body;

  if (!name || !password || !email) {
    throw new ApiError(404, "Provide all the details");
  }

  const userExist = await User.findOne({
    email,
  });

  if (userExist) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    password,
    email,
    role,
  });

  const userWithoutPassword = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userWithoutPassword) {
    throw new ApiError(500, "Error while creating a new user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, userWithoutPassword, "User registered successfully")
    );
});

const loginAUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(404, "email and password required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    throw new ApiError(400, "User id is required to logout");
  }

  await User.findByIdAndUpdate(userId, { refreshToken: null });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized user");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user?._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    console.log("Error refreshing token : ", error);
    throw new ApiError(401, "Invalid refresh token");
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!(oldPassword || newPassword)) {
    throw new ApiError(400, "Provide both the passwords");
  }

  const user = await User.findById(req.user?._id);

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(404, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(req.body);

  if (!userId) {
    throw new ApiError(404, "Provide user id to delete the account");
  }

  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(404, "User does not exists");
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
  createAUser,
  loginAUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  deleteUser,
  getCurrentUser,
};
