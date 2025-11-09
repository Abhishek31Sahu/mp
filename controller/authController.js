// authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

// ------------------ SIGNUP ------------------
export const signUp = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      aadhaarNumber,
      password,
      role, // optional
      kycStatus, // optional
      verifiedPhone, // optional
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please login.",
        success: false,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phone,
      aadhaarNumber,
      passwordHash: hashedPassword,
      role: role || "user",
      kycStatus: kycStatus || "pending",
      verifiedPhone: verifiedPhone || "pending",
    });

    await newUser.save();

    // Generate JWT
    const jwtToken = jwt.sign(
      { email: newUser.email, _id: newUser._id },
      "abhi123@user",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Signup successful",
      success: true,
      jwtToken,
      email: newUser.email,
      name: newUser.fullName,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ------------------ SIGNIN ------------------
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include passwordHash
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Generate JWT including role
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      "abhi123@user",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email: user.email,
      name: user.fullName,
      role: user.role, // return role in login response
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
