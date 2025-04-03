import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

export const isMentorOrAdmin = (req, res, next) => {
  if (req.user.role !== "mentor" && req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Mentor or Admin role required.",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admin role required.",
    });
  }
  next();
};
