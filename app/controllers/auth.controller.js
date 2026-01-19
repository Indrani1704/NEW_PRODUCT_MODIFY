const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");


exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "user",
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};


const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });





exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  if (user.role === "admin") {
    const refreshToken = generateRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken });
  }

  res.json({ accessToken });
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    res.json({ accessToken });
  });
};
