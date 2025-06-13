const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
require("dotenv").config();

// Create Account
const createAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let customer = await Customer.findOne({ email });

    if (!customer) {
      const hashedPassword = await bcrypt.hash(password, 10);

      customer = new Customer({
        email,
        password: hashedPassword,
      });

      await customer.save();
    } else {
      // Update password if user exists
      const hashedPassword = await bcrypt.hash(password, 10);
      customer.password = hashedPassword;
      await customer.save();
    }

    return res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating account",
      error: error.message,
    });
  }
};

// Login
const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      customer: {
        _id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        profilePicture: customer.profilePicture,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

// Access Token
function generateAccessToken(customer) {
  const payload = { id: customer._id, time: Date() };
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME || "1h",
  };
  return jwt.sign(payload, secret, options);
}

// Refresh Token
function generateRefreshToken(customer) {
  const payload = { id: customer._id, time: Date() };
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const options = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME || "7d",
  };
  return jwt.sign(payload, secret, options);
}

// Verify Access Token
function verifyAccessToken(token) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: "Invalid token", error: error.message };
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const result = verifyAccessToken(token);
  if (!result.success) {
    return res
      .status(403)
      .json({ success: false, message: result.message, error: result.error });
  }

  req.customer = result.data;
  next();
}

// Verify Refresh Token
function verifyRefreshToken(token) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return {
      success: false,
      message: "Invalid refresh token",
      error: error.message,
    };
  }
}

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "Refresh token is required" });
  }

  const result = verifyRefreshToken(refreshToken);
  if (!result.success) {
    return res
      .status(403)
      .json({ success: false, message: result.message, error: result.error });
  }

  const customer = { _id: result.data.id };
  const newAccessToken = generateAccessToken(customer);

  return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken: newAccessToken,
  });
};

module.exports = {
  createAccount,
  loginAccount,
  refreshAccessToken,
  authenticateToken,
};
