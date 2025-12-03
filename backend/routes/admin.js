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

// router.get("/male-members", (req, res) => {
//   const BASE = process.env.API_BASE_URL || "http://localhost:5000";

//   const sql = `
//     SELECT
//       MatriID,
//       Name,
//       ConfirmEmail AS Email,
//       Mobile,
//       DOB,
//       TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
//       Regdate,
//       Status,
//       Lastlogin,
//       Photo1,
//       Photo1Approve
//     FROM register
//     WHERE Gender = 'Male'
//       AND visibility NOT LIKE 'hidden'
//       AND Status <> 'Banned'
//     ORDER BY Regdate IS NULL, Regdate DESC
//   `;

//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.log("ADMIN MALE MEMBERS SQL ERROR:", err);
//       return res.status(500).json({ error: err });
//     }

//     const results = rows.map((u) => {
//       const photo =
//         u.Photo1 && u.Photo1Approve?.toLowerCase() === "yes"
//           ? `${BASE}/gallery/${u.Photo1}`
//           : `${BASE}/gallery/nophoto.jpg`;

//       return { ...u, PhotoURL: photo };
//     });

//     res.json({ success: true, results });
//   });
// });

router.get("/male-members", (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const countSQL = `
    SELECT COUNT(*) AS total
    FROM register
    WHERE Gender = 'Male'
      AND visibility NOT LIKE 'hidden'
      AND Status <> 'Banned'
  `;

  const dataSQL = `
    SELECT 
      MatriID,
      Name,
      ConfirmEmail AS Email,
      Mobile,
      DOB,
      TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
      Regdate,
      Status,
      Lastlogin,
      Photo1,
      Photo1Approve
    FROM register
    WHERE Gender = 'Male'
      AND visibility NOT LIKE 'hidden'
      AND Status <> 'Banned'
    ORDER BY Regdate IS NULL, Regdate DESC
    LIMIT ?, ?
  `;

  db.query(countSQL, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const total = countResult[0].total;

    db.query(dataSQL, [offset, limit], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2 });

      const results = rows.map((u) => {
        const photo =
          u.Photo1 && u.Photo1Approve?.toLowerCase() === "yes"
            ? `${BASE}/gallery/${u.Photo1}`
            : `${BASE}/gallery/nophoto.jpg`;

        return { ...u, PhotoURL: photo };
      });

      res.json({
        success: true,
        total,
        page,
        per_page: limit,
        results,
      });
    });
  });
});

router.get("/profile/:matriId", (req, res) => {
  const { matriId } = req.params;

  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const sql = `
    SELECT *
    FROM register
    WHERE MatriID = ?
    LIMIT 1
  `;

  db.query(sql, [matriId], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    // make photo URL safe
    user.PhotoURL =
      user.Photo1 && user.Photo1Approve === "Yes"
        ? `${BASE}/gallery/${user.Photo1}`
        : `${BASE}/gallery/nophoto.jpg`;

    return res.json({ success: true, user });
  });
});

export default router;
