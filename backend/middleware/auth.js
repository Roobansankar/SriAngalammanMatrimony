// middleware/auth.js
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user object to req.user
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization header provided",
      });
    }

    // Support both "Bearer <token>" and just "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Get user from database
    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT id, MatriID, ConfirmEmail, Name, Mobile FROM register WHERE id = ? LIMIT 1",
      [decoded.userId || decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = {
      id: rows[0].id,
      matriId: rows[0].MatriID,
      email: rows[0].ConfirmEmail,
      name: rows[0].Name,
      mobile: rows[0].Mobile,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

/**
 * Optional authentication middleware
 * If token is provided, attaches user to req.user
 * If no token, continues without user
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const conn = db.promise();
      const [rows] = await conn.query(
        "SELECT id, MatriID, ConfirmEmail, Name, Mobile FROM register WHERE id = ? LIMIT 1",
        [decoded.userId || decoded.id]
      );

      if (rows.length) {
        req.user = {
          id: rows[0].id,
          matriId: rows[0].MatriID,
          email: rows[0].ConfirmEmail,
          name: rows[0].Name,
          mobile: rows[0].Mobile,
        };
      }
    } catch (err) {
      // Token invalid or expired, continue without user
    }

    next();
  } catch (err) {
    console.error("Optional auth middleware error:", err);
    next();
  }
};

/**
 * Generate JWT token for a user
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      matriId: user.MatriID,
      email: user.ConfirmEmail,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default auth;
