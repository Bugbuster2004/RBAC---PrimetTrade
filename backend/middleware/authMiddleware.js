const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  // Read token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed or expired" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "User role not authorized to access this route" });
    }
    next();
  };
};
