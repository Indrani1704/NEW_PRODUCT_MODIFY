const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      statusCode: 401,
      message: "Authorization header missing"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Access token missing"
    });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {

    if (err) {
      return res.status(403).json({
        statusCode: 403,
        message: "Invalid or expired token"
      });
    }

    req.user = decoded;

    next();
  });

};