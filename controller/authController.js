import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }

    const userInfo = new User({ username, email, password });
    console.log(userInfo);
    const salt = await bcrypt.genSalt(10);
    userInfo.password = await bcrypt.hash(password, salt);

    console.log(userInfo);

    await userInfo.save();
    const jwtToken = jwt.sign(
      { email: email, _id: userInfo._id },
      "abhi123@user",
      { expiresIn: "24h" }
    );
    console.log(jwtToken);
    res.status(200).json({
      message: "Signup successfully",
      success: true,
      jwtToken,
      email,
      name: username,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const errorMsg = "you input  email or password wrong";
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({
        message: errorMsg,
        success: false,
      });
    }
    console.log(email);
    const isPassEqual = await bcrypt.compare(password, user.password);

    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      "abhi123@user",
      { expiresIn: "24h" }
    );
    console.log(jwtToken);
    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.username,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server why",
      success: false,
    });
  }
};
