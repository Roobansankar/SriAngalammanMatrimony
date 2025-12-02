import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// =========================
// ADMIN REGISTER
// =========================
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO admin (username, password) VALUES (?, ?)",
      [username, hashed],
      (err, result) => {
        if (err) {
          console.error("Register error:", err);
          return res
            .status(500)
            .json({ message: "User already exists or DB error" });
        }

        res.json({ message: "Admin registered successfully" });
      }
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// ADMIN LOGIN
// =========================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "DB error" });
      }

      if (results.length === 0)
        return res.status(401).json({ message: "Invalid username" });

      const admin = results[0];

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login success",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      });
    }
  );
});




router.get("/dashboard-stats", async (req, res) => {
  try {
    const conn = db.promise();

    // Male Count
    const [[{ maleCount }]] = await conn.query(
      "SELECT COUNT(*) AS maleCount FROM register WHERE Gender = 'Male'"
    );

    // Female Count
    const [[{ femaleCount }]] = await conn.query(
      "SELECT COUNT(*) AS femaleCount FROM register WHERE Gender = 'Female'"
    );

    // Total Members
    const totalCount = maleCount + femaleCount;

    res.json({
      success: true,
      data: {
        maleCount,
        femaleCount,
        totalCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


export default router;
