import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Existing login function
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid credentials"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid credentials"));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json(new ApiResponse(200, { token }, "Login successful"));
});

// New register function
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Username already exists"));
  }

  // Create new user
  const user = await User.create({
    username,
    password, // Password will be hashed automatically by pre-save hook
  });

  // Generate JWT token for immediate login
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { user: { username: user.username }, token }, "Admin user created successfully"));
});

export { login, register }; // Updated export