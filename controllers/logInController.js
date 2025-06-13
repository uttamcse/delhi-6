const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/Customer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

 // Send OTP
const createAccount = async (req, res) => {
  try {
    const { email,password } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "email and password is required" 
      });
    }

    // Check if user already exists, based on mobileNumber
    let customer = await Customer.findOne({ email });

    if (!customer) {
      customer = new User({
        mobileNumber,
        password,
      });

      await customer.save();
    } else {
      customer.password = password;
      await customer.save();
    }

    // Create a new object excluding sensitive fields
    const responseUser = {
      _id: customer._id,
      otp: customer.password,

    };

    return res.status(200).json({
      success: true,
      message: "account created successfully",
      customer: responseUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating account",
      error: error.message,
    });
  }
};

 // Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "email and password are required" 
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email" });
    }
    const customer = await Customer.findById(email);
    const userWithBalance = {
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      profilePicture: customer.profilePicture,
      registrationToken: customer.registrationToken,
   
    };

    if (!customer || customer.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Clear OTP after successful verification
    customer.password = undefined;

    await customer.save({ validateBeforeSave: false });

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      customer: userWithBalance,
      accessToken,
      refreshToken
    });
  } catch (error) {
  return res.status(500).json({
      success: false,
      message: "Error in verifying OTP",
      error: error.message,
    });
  }
};

function generateAccessToken(customer) {
  const payload = {
    id: customer._id,
    time: Date()
  };

  const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME };

  return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return {
      success: false,
      message:"error in verifying access token",
      error: error.message };
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No access token"
    });
  }

  const result = verifyAccessToken(token);

  if (!result.success) {
    return res.status(403).json({
      success: false,
      message: "Failed to verify access token",
      error: result.error });
  }

  req.customer = result.data;
  next();
}

// Generate a new refresh token
function generateRefreshToken(customer) {
  const payload = {
    id: customer._id,
    time: Date()
  };

  const secret = process.env.REFRESH_TOKEN_SECRET;;
  const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME };

  return jwt.sign(payload, secret, options);
}

// Verify a refresh token
function verifyRefreshToken(token) {
  const secret = process.env.REFRESH_TOKEN_SECRET;;

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {

    return res.status(504).json({
      success: false,
      message:"error in verifying access token",
      error: error.message });
  }
}

// Refresh an access token using a valid refresh token
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is missing" });
  }

  const result = verifyRefreshToken(refreshToken);

  if (!result.success) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: result.error });
  }

  const customer = {
    _id: result.data.id,
  };

  const newAccessToken = generateAccessToken(customer);
  return res.status(200).json({
    success: true,
    message: "Access token has been refreshed successfully",
    accessToken: newAccessToken
  });
};
module.exports={createAccount, verifyOtp, refreshAccessToken };