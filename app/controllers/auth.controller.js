const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });


// REGISTER
exports.register = async (req, res) => {
  try {

    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "User already exists",
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user"
    });

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
      error: error.message
    });

  }
};



// LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "User not found",
        data: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid password",
        data: null
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      id: user._id
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
      error: error.message
    });

  }
};



// REFRESH ACCESS TOKEN
exports.refresh = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Refresh token required",
        data: null
      });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({
        statusCode: 403,
        success: false,
        message: "Invalid refresh token",
        data: null
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err) => {

        if (err) {
          return res.status(403).json({
            statusCode: 403,
            success: false,
            message: "Refresh token expired",
            data: null
          });
        }

        const accessToken = generateAccessToken({
          id: user._id,
          role: user.role
        });

        res.status(200).json({
          statusCode: 200,
          success: true,
          message: "New access token generated",
          data: {
            accessToken
          }
        });

      }
    );

  } catch (error) {

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
      error: error.message
    });

  }
};



// CHANGE ROLE
exports.changeRole = async (req, res) => {

  try {

    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Role updated successfully",
      data: {
        user
      }
    });

  } catch (error) {

    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
      error: error.message
    });

  }

};