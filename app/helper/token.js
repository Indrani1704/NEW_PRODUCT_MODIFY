
import jwt from "jsonwebtoken";

export const accessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

export const refreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
