const mongoose = require("mongoose");
const Customer = require("../models/Customer"); // Make sure this is correct
const { multer, uploadFileToGCS } = require("../utils/uploadHelper");

const profileImageUpload = multer.single("profilePicture");

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Main function to store customer details
const storeUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email } = req.body;
    let profilePicture = req.body.profilePicture;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // Required fields validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName and email are required",
      });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Fetch customer by ID
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Upload profile picture if provided
    if (req.file) {
      profilePicture = await uploadFileToGCS(req.file);
    }

    // Prepare update fields
    const updateFields = {
      firstName,
      lastName,
      email,
    };

    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
    }

    // Update customer in DB
    const updatedCustomer = await Customer.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Customer details updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in storing customer details",
      error: error.message,
    });
  }
};

const registrationToken = async (req, res) => {
  try {
    const { userId } = req.params;
    const { registrationToken } = req.body;

    if (!registrationToken) {
      return res.status(400).json({
        success: false,
        message: "Registration token is required"
      });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      userId,
      { registrationToken },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Registration token updated successfully",
      Customer: updatedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Facing error to update registration token",
      error: error.message });
  }
};



//logout

const logout = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.registrationToken) {
      return res.status(200).json({ success: true, message: 'The registration token has already been cleared' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { registrationToken: "" },
      { new: true }
    );

    return res.status(200).json({success: true, message: "Logout successful", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred during logout", error: error.message });
  }
};

module.exports = {
  storeUserDetails,
  registrationToken,
  logout,
  profileImageUpload
};