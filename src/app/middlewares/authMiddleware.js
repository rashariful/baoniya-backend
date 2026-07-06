import jwt from "jsonwebtoken";

import { User } from "../modules/user/user.model.js";

// middleware/verifyToken.js
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    

    // optional: attach user info to request
    req.user = await User.findById(decoded.id).select("-password");

    next(); // go to next middleware or controller
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const verifyRole = (...allowedRoles) => {
  // console.log(req.user)
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};
