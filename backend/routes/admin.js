
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { verifyToken, verifyAdmin } from "../middleware/authJwt.js";

const router = express.Router();

// =========================
// ADMIN REGISTER
// =========================
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body; // Add role

  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === 'staff' ? 'staff' : 'admin'; // Default to admin if not specified or invalid

    db.query(
      "INSERT INTO admin (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, userRole],
      (err, result) => {
        if (err) {
          console.error("Register error:", err);
          return res
            .status(500)
            .json({ message: "User already exists or DB error" });
        }

        res.json({ message: "Admin/Staff registered successfully" });
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
        { id: admin.id, username: admin.username, role: admin.role },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login success",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        },
      });
    }
  );
});

// Apply verifyToken to all subsequent routes
router.use(verifyToken);

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

    // Today's registrations
    const [[{ todayRegistrations }]] = await conn.query(
      "SELECT COUNT(*) AS todayRegistrations FROM register WHERE DATE(Regdate) = CURDATE()"
    );

    // This week registrations
    const [[{ weeklyRegistrations }]] = await conn.query(
      "SELECT COUNT(*) AS weeklyRegistrations FROM register WHERE Regdate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
    );

    // This month registrations
    const [[{ monthlyRegistrations }]] = await conn.query(
      "SELECT COUNT(*) AS monthlyRegistrations FROM register WHERE MONTH(Regdate) = MONTH(CURDATE()) AND YEAR(Regdate) = YEAR(CURDATE())"
    );

    // Active users (logged in within 7 days)
    const [[{ activeUsers }]] = await conn.query(
      "SELECT COUNT(*) AS activeUsers FROM register WHERE Lastlogin >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
    );

    res.json({
      success: true,
      data: {
        maleCount,
        femaleCount,
        totalCount,
        todayRegistrations,
        weeklyRegistrations,
        monthlyRegistrations,
        activeUsers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Recent members for dashboard
router.get("/recent-members", (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const sql = `
    SELECT 
      MatriID,
      Name,
      Gender,
      ConfirmEmail AS Email,
      Regdate,
      Status,
      Photo1,
      Photo1Approve
    FROM register
    WHERE visibility NOT LIKE 'hidden'
      AND Status <> 'Banned'
    ORDER BY Regdate DESC
    LIMIT 10
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    const members = rows.map((u) => {
      const photo =
        u.Photo1 && u.Photo1Approve?.toLowerCase() === "yes"
          ? `${BASE}/gallery/${u.Photo1}`
          : `${BASE}/gallery/nophoto.jpg`;

      return { ...u, PhotoURL: photo };
    });

    res.json({ success: true, members });
  });
});

// All members with pagination
router.get("/all-members", (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const gender = req.query.gender || "";

  let whereClause = "WHERE visibility NOT LIKE 'hidden' AND Status <> 'Banned'";
  const params = [];

  // Staff restriction: only show basic users
  if (req.userRole === 'staff') {
    whereClause += " AND (Plan IS NULL OR Plan = 'basic')";
  }

  if (gender) {
    whereClause += " AND Gender = ?";
    params.push(gender);
  }

  if (search) {
    whereClause += " AND (Name LIKE ? OR MatriID LIKE ? OR ConfirmEmail LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSQL = `SELECT COUNT(*) AS total FROM register ${whereClause}`;

  const dataSQL = `
    SELECT 
      MatriID,
      Name,
      Gender,
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
    ${whereClause}
    ORDER BY Regdate IS NULL, Regdate DESC
    LIMIT ?, ?
  `;

  db.query(countSQL, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const total = countResult[0].total;

    db.query(dataSQL, [...params, offset, limit], (err2, rows) => {
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

// Female members with pagination
router.get("/female-members", (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  let whereClause = "WHERE Gender = 'Female' AND visibility NOT LIKE 'hidden' AND Status <> 'Banned'";
  const params = [];

  // Staff restriction
  if (req.userRole === 'staff') {
    whereClause += " AND (Plan IS NULL OR Plan = 'basic')";
  }

  if (search) {
    whereClause += " AND (Name LIKE ? OR MatriID LIKE ? OR ConfirmEmail LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSQL = `SELECT COUNT(*) AS total FROM register ${whereClause}`;

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
    ${whereClause}
    ORDER BY Regdate IS NULL, Regdate DESC
    LIMIT ?, ?
  `;

  db.query(countSQL, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const total = countResult[0].total;

    db.query(dataSQL, [...params, offset, limit], (err2, rows) => {
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
  const search = req.query.search || "";

  let whereClause = "WHERE Gender = 'Male' AND visibility NOT LIKE 'hidden' AND Status <> 'Banned'";
  const params = [];

  // Staff restriction
  if (req.userRole === 'staff') {
    whereClause += " AND (Plan IS NULL OR Plan = 'basic')";
  }

  if (search) {
    whereClause += " AND (Name LIKE ? OR MatriID LIKE ? OR ConfirmEmail LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSQL = `SELECT COUNT(*) AS total FROM register ${whereClause}`;

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
    ${whereClause}
    ORDER BY Regdate IS NULL, Regdate DESC
    LIMIT ?, ?
  `;

  db.query(countSQL, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const total = countResult[0].total;

    db.query(dataSQL, [...params, offset, limit], (err2, rows) => {
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

// New members (Pending status)
router.get("/new-members", (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  let whereClause = "WHERE Status = 'Pending'";
  const params = [];

  // Staff restriction
  if (req.userRole === 'staff') {
    whereClause += " AND (Plan IS NULL OR Plan = 'basic')";
  }

  if (search) {
    whereClause += " AND (Name LIKE ? OR MatriID LIKE ? OR ConfirmEmail LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSQL = `SELECT COUNT(*) AS total FROM register ${whereClause}`;

  const dataSQL = `
    SELECT 
      MatriID,
      Name,
      Gender,
      ConfirmEmail AS Email,
      Mobile,
      DOB,
      TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
      Regdate,
      Status,
      Lastlogin,
      Photo1,
      Photo1Approve,
      Plan
    FROM register
    ${whereClause}
    ORDER BY Regdate DESC
    LIMIT ?, ?
  `;

  db.query(countSQL, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const total = countResult[0].total;

    db.query(dataSQL, [...params, offset, limit], (err2, rows) => {
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

// =========================
// UPDATE MEMBER DATA
// =========================
router.put("/member/:matriId", async (req, res) => {
  const { matriId } = req.params;
  const updateData = req.body;

  try {
    // Build dynamic update query
    const allowedFields = [
      'Name', 'DOB', 'TOB', 'POB', 'Gender', 'Education', 'Occupation',
      'company_name', 'Annualincome', 'Height', 'Weight', 'Complexion',
      'Caste', 'Subcaste', 'Fathername', 'Fathersoccupation', 'Mothersname',
      'Mothersoccupation', 'Address', 'City', 'State', 'Mobile', 'ConfirmEmail',
      'Star', 'Moonsign', 'Raghu', 'Keethu', 'Sevai', 'noofbrothers', 'noofsisters',
      'family_wealth', 'Status', 'BloodGroup', 'workinglocation', 'occu_details',
      'Lagnam', 'Suddham', 'DasaBalance', 'OtherNotes', 'PartnerExpectations',
      // Rasi grid (g1-g12)
      'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12',
      // Navamsam grid (a1-a12)
      'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12'
    ];

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    values.push(matriId);

    const sql = `UPDATE register SET ${updates.join(', ')} WHERE MatriID = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ success: false, message: "Database error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      res.json({ success: true, message: "Member updated successfully" });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =========================
// UPDATE MEMBER BIODATA (Full biodata including horoscope grids)
// =========================
router.put("/biodata/:matriId", async (req, res) => {
  const { matriId } = req.params;
  const updateData = req.body;

  try {
    // All allowed fields for biodata including horoscope grids
    const allowedFields = [
      // Personal Info
      'Name', 'DOB', 'TOB', 'POB', 'Gender', 'BloodGroup',
      // Education & Career
      'Education', 'Occupation', 'company_name', 'Annualincome', 'workinglocation', 'occu_details',
      // Physical
      'Height', 'Weight', 'Complexion',
      // Family
      'Caste', 'Subcaste', 'Fathername', 'Fathersoccupation', 'Mothersname', 'Mothersoccupation',
      'noofbrothers', 'noofsisters', 'family_wealth',
      // Contact
      'Address', 'City', 'State', 'Mobile', 'ConfirmEmail',
      // Horoscope basic
      'Star', 'Moonsign', 'Lagnam', 'Suddham', 'Raghu', 'Keethu', 'Sevai', 'DasaBalance',
      // Rasi grid (g1-g12)
      'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12',
      // Navamsam grid (a1-a12)
      'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12',
      // Other
      'PartnerExpectations', 'OtherNotes', 'Status'
    ];

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        // Handle array values (for horoscope grids)
        if (Array.isArray(value)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    values.push(matriId);

    const sql = `UPDATE register SET ${updates.join(', ')} WHERE MatriID = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Biodata update error:", err);
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      res.json({ success: true, message: "Biodata updated successfully" });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =========================
// DELETE MEMBER
// =========================
router.delete("/member/:matriId", verifyAdmin, (req, res) => {
  const { matriId } = req.params;

  const sql = `DELETE FROM register WHERE MatriID = ?`;

  db.query(sql, [matriId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, message: "Member deleted successfully" });
  });
});

// =========================
// BAN/UNBAN MEMBER
// =========================
router.put("/member/:matriId/status", (req, res) => {
  const { matriId } = req.params;
  const { status } = req.body; // 'Active', 'Banned', 'Pending'

  const sql = `UPDATE register SET Status = ? WHERE MatriID = ?`;

  db.query(sql, [status, matriId], (err, result) => {
    if (err) {
      console.error("Status update error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, message: `Member status updated to ${status}` });
  });
});

// =========================
// HIDE/SHOW MEMBER
// =========================
router.put("/member/:matriId/visibility", (req, res) => {
  const { matriId } = req.params;
  const { visibility } = req.body; // 'visible', 'hidden'

  const sql = `UPDATE register SET visibility = ? WHERE MatriID = ?`;

  db.query(sql, [visibility, matriId], (err, result) => {
    if (err) {
      console.error("Visibility update error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, message: `Member visibility updated to ${visibility}` });
  });
});

// =========================
// MASTER DATA MANAGEMENT
// =========================

// ---- RELIGION CRUD ----

// Get all religions
router.get("/master/religions", (req, res) => {
  db.query("SELECT ID, Religion FROM religion ORDER BY Religion", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add new religion
router.post("/master/religions", (req, res) => {
  const { religion } = req.body;
  if (!religion || !religion.trim()) {
    return res.status(400).json({ success: false, message: "Religion name is required" });
  }

  db.query("INSERT INTO religion (Religion) VALUES (?)", [religion.trim()], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: "Religion already exists" });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: "Religion added successfully", id: result.insertId });
  });
});

// Update religion
router.put("/master/religions/:id", (req, res) => {
  const { id } = req.params;
  const { religion } = req.body;

  if (!religion || !religion.trim()) {
    return res.status(400).json({ success: false, message: "Religion name is required" });
  }

  db.query("UPDATE religion SET Religion = ? WHERE ID = ?", [religion.trim(), id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Religion not found" });
    }
    res.json({ success: true, message: "Religion updated successfully" });
  });
});

// Delete religion
router.delete("/master/religions/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM religion WHERE ID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Religion not found" });
    }
    res.json({ success: true, message: "Religion deleted successfully" });
  });
});

// ---- CASTE CRUD ----

// Get all castes (optionally filter by religion)
router.get("/master/castes", (req, res) => {
  const { religion } = req.query;
  let sql = "SELECT ID, Religion, Caste FROM caste";
  const params = [];

  if (religion) {
    sql += " WHERE Religion = ?";
    params.push(religion);
  }
  sql += " ORDER BY Religion, Caste";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add new caste
router.post("/master/castes", (req, res) => {
  const { religion, caste } = req.body;

  if (!religion || !caste || !caste.trim()) {
    return res.status(400).json({ success: false, message: "Religion and Caste are required" });
  }

  db.query(
    "INSERT INTO caste (Religion, Caste) VALUES (?, ?)",
    [religion, caste.trim()],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: "Caste already exists for this religion" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, message: "Caste added successfully", id: result.insertId });
    }
  );
});

// Update caste
router.put("/master/castes/:id", (req, res) => {
  const { id } = req.params;
  const { religion, caste } = req.body;

  if (!caste || !caste.trim()) {
    return res.status(400).json({ success: false, message: "Caste name is required" });
  }

  let sql = "UPDATE caste SET Caste = ?";
  const params = [caste.trim()];

  if (religion) {
    sql += ", Religion = ?";
    params.push(religion);
  }

  sql += " WHERE ID = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Caste not found" });
    }
    res.json({ success: true, message: "Caste updated successfully" });
  });
});

// Delete caste
router.delete("/master/castes/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM caste WHERE ID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Caste not found" });
    }
    res.json({ success: true, message: "Caste deleted successfully" });
  });
});

// ---- SUBCASTE CRUD ----

// Get all subcastes (optionally filter by caste ID)
router.get("/master/subcastes", (req, res) => {
  const { casteId } = req.query;
  let sql = `
    SELECT s.ID, s.CasteID, s.Subcaste, c.Caste, c.Religion
    FROM subcaste s
    LEFT JOIN caste c ON s.CasteID = c.ID
  `;
  const params = [];

  if (casteId) {
    sql += " WHERE s.CasteID = ?";
    params.push(casteId);
  }
  sql += " ORDER BY c.Religion, c.Caste, s.Subcaste";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add new subcaste
router.post("/master/subcastes", (req, res) => {
  const { casteId, subcaste } = req.body;

  if (!casteId || !subcaste || !subcaste.trim()) {
    return res.status(400).json({ success: false, message: "Caste ID and Subcaste name are required" });
  }

  db.query(
    "INSERT INTO subcaste (CasteID, Subcaste) VALUES (?, ?)",
    [casteId, subcaste.trim()],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: "Subcaste already exists for this caste" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, message: "Subcaste added successfully", id: result.insertId });
    }
  );
});

// Update subcaste
router.put("/master/subcastes/:id", (req, res) => {
  const { id } = req.params;
  const { casteId, subcaste } = req.body;

  if (!subcaste || !subcaste.trim()) {
    return res.status(400).json({ success: false, message: "Subcaste name is required" });
  }

  let sql = "UPDATE subcaste SET Subcaste = ?";
  const params = [subcaste.trim()];

  if (casteId) {
    sql += ", CasteID = ?";
    params.push(casteId);
  }

  sql += " WHERE ID = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Subcaste not found" });
    }
    res.json({ success: true, message: "Subcaste updated successfully" });
  });
});

// Delete subcaste
router.delete("/master/subcastes/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM subcaste WHERE ID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Subcaste not found" });
    }
    res.json({ success: true, message: "Subcaste deleted successfully" });
  });
});

// =========================
// LOCATION MASTER DATA (Country, State, City/District)
// =========================

// ---- COUNTRY CRUD ----

// Get all countries
router.get("/master/countries", (req, res) => {
  db.query("SELECT id, country FROM e_country ORDER BY country", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add new country
router.post("/master/countries", (req, res) => {
  const { country } = req.body;
  if (!country || !country.trim()) {
    return res.status(400).json({ success: false, message: "Country name is required" });
  }

  db.query("INSERT INTO e_country (country) VALUES (?)", [country.trim()], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: "Country already exists" });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: "Country added successfully", id: result.insertId });
  });
});

// Update country
router.put("/master/countries/:id", (req, res) => {
  const { id } = req.params;
  const { country } = req.body;

  if (!country || !country.trim()) {
    return res.status(400).json({ success: false, message: "Country name is required" });
  }

  db.query("UPDATE e_country SET country = ? WHERE id = ?", [country.trim(), id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, message: "Country updated successfully" });
  });
});

// Delete country
router.delete("/master/countries/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM e_country WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, message: "Country deleted successfully" });
  });
});

// ---- STATE CRUD ----

// Get all states (optionally filter by country)
router.get("/master/states", (req, res) => {
  const { country } = req.query;
  let sql = `
    SELECT s.id, s.cid, s.state, c.country 
    FROM e_state s
    LEFT JOIN e_country c ON TRIM(LOWER(s.cid)) = TRIM(LOWER(c.country))
  `;
  const params = [];

  if (country) {
    sql += " WHERE TRIM(LOWER(s.cid)) = TRIM(LOWER(?))";
    params.push(country);
  }
  sql += " ORDER BY s.state";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add new state
router.post("/master/states", (req, res) => {
  const { country, state } = req.body;

  if (!country || !state || !state.trim()) {
    return res.status(400).json({ success: false, message: "Country and State are required" });
  }

  db.query(
    "INSERT INTO e_state (cid, state) VALUES (?, ?)",
    [country, state.trim()],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: "State already exists" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, message: "State added successfully", id: result.insertId });
    }
  );
});

// Update state
router.put("/master/states/:id", (req, res) => {
  const { id } = req.params;
  const { country, state } = req.body;

  if (!state || !state.trim()) {
    return res.status(400).json({ success: false, message: "State name is required" });
  }

  let sql = "UPDATE e_state SET state = ?";
  const params = [state.trim()];

  if (country) {
    sql += ", cid = ?";
    params.push(country);
  }

  sql += " WHERE id = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "State not found" });
    }
    res.json({ success: true, message: "State updated successfully" });
  });
});

// Delete state
router.delete("/master/states/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM e_state WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "State not found" });
    }
    res.json({ success: true, message: "State deleted successfully" });
  });
});

// ---- CITY/DISTRICT CRUD ----

// Get all cities/districts (optionally filter by state)
router.get("/master/cities", (req, res) => {
  const { state } = req.query;
  let sql = `
    SELECT d.id, d.sid2, d.dist, d.status, s.state
    FROM e_dist d
    LEFT JOIN e_state s ON TRIM(LOWER(d.sid2)) = TRIM(LOWER(s.state))
  `;
  const params = [];

  if (state) {
    sql += " WHERE TRIM(LOWER(d.sid2)) = TRIM(LOWER(?))";
    params.push(state);
  }
  sql += " ORDER BY d.dist";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add new city/district
router.post("/master/cities", (req, res) => {
  const { state, city, status = 1 } = req.body;

  if (!state || !city || !city.trim()) {
    return res.status(400).json({ success: false, message: "State and City are required" });
  }

  db.query(
    "INSERT INTO e_dist (sid2, dist, status) VALUES (?, ?, ?)",
    [state, city.trim(), status],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: "City already exists" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, message: "City added successfully", id: result.insertId });
    }
  );
});

// Update city/district
router.put("/master/cities/:id", (req, res) => {
  const { id } = req.params;
  const { state, city, status } = req.body;

  if (!city || !city.trim()) {
    return res.status(400).json({ success: false, message: "City name is required" });
  }

  let sql = "UPDATE e_dist SET dist = ?";
  const params = [city.trim()];

  if (state) {
    sql += ", sid2 = ?";
    params.push(state);
  }

  if (status !== undefined) {
    sql += ", status = ?";
    params.push(status);
  }

  sql += " WHERE id = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    res.json({ success: true, message: "City updated successfully" });
  });
});

// Delete city/district
router.delete("/master/cities/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM e_dist WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    res.json({ success: true, message: "City deleted successfully" });
  });
});



// router.post("/featured-profile", (req, res) => {
//   const { matriId } = req.body;

//   if (!matriId) {
//     return res.status(400).json({ error: "MatriID required" });
//   }

//   // 1️⃣ Check MatriID exists
//   const checkSql = "SELECT MatriID FROM register WHERE MatriID = ? LIMIT 1";

//   db.query(checkSql, [matriId], (err, rows) => {
//     if (err) return res.status(500).json(err);

//     if (rows.length === 0) {
//       return res.status(404).json({
//         error: "MatriID not found in register table",
//       });
//     }

//     // 2️⃣ Insert into featured_profiles
//     const insertSql =
//       "INSERT IGNORE INTO featured_profiles (MatriID) VALUES (?)";

//     db.query(insertSql, [matriId], (err2) => {
//       if (err2) return res.status(500).json(err2);

//       return res.json({
//         success: true,
//         message: "Featured profile added successfully",
//       });
//     });
//   });
// });


// router.get("/featured-profiles", (req, res) => {
//   const BASE = process.env.API_BASE_URL || "http://localhost:5000";

//   const sql = `
//     SELECT r.MatriID, r.Name, r.Age, r.Occupation,
//            CASE
//              WHEN r.Photo1 IS NOT NULL AND r.Photo1Approve = 'Yes'
//              THEN CONCAT(?, '/gallery/', r.Photo1)
//              ELSE CONCAT(?, '/gallery/nophoto.jpg')
//            END AS PhotoURL
//     FROM featured_profiles f
//     JOIN register r ON r.MatriID = f.MatriID
//     ORDER BY f.created_at DESC
//     LIMIT 4
//   `;

//   db.query(sql, [BASE, BASE], (err, rows) => {
//     if (err) return res.status(500).json(err);
//     return res.json({ success: true, profiles: rows });
//   });
// });


/* GET */
router.get("/featured-profiles", (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";

  const sql = `
    SELECT f.id, r.MatriID, r.Name, r.Age, r.Occupation,
      CASE
        WHEN r.Photo1 IS NOT NULL AND r.Photo1Approve='Yes'
        THEN CONCAT(?, '/gallery/', r.Photo1)
        ELSE CONCAT(?, '/gallery/nophoto.jpg')
      END AS PhotoURL
    FROM featured_profiles f
    JOIN register r ON r.MatriID = f.MatriID
    ORDER BY f.created_at DESC
  `;

  db.query(sql, [BASE, BASE], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json({ profiles: rows });
  });
});

/* POST */
router.post("/featured-profiles", (req, res) => {
  const { matriId } = req.body;

  const checkSql = `SELECT MatriID FROM register WHERE MatriID=? LIMIT 1`;
  db.query(checkSql, [matriId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length)
      return res.status(404).json({ error: "MatriID not found" });

    db.query(
      "INSERT INTO featured_profiles (MatriID) VALUES (?)",
      [matriId],
      (err2) => {
        if (err2)
          return res
            .status(400)
            .json({ error: "Already featured" });

        res.json({ success: true });
      }
    );
  });
});

/* PUT */
router.put("/featured-profiles/:id", (req, res) => {
  const { matriId } = req.body;

  const checkSql = `SELECT MatriID FROM register WHERE MatriID=? LIMIT 1`;
  db.query(checkSql, [matriId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length)
      return res.status(404).json({ error: "MatriID not found" });

    db.query(
      "UPDATE featured_profiles SET MatriID=? WHERE id=?",
      [matriId, req.params.id],
      (err2) => {
        if (err2) return res.status(500).json(err2);
        res.json({ success: true });
      }
    );
  });
});

/* DELETE */
router.delete("/featured-profiles/:id", verifyAdmin, (req, res) => {
  db.query(
    "DELETE FROM featured_profiles WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// =========================
// STAFF/ADMIN MANAGEMENT
// =========================

// Get all admin/staff users
router.get("/users", verifyAdmin, (req, res) => {
  db.query("SELECT id, username, role, created_at FROM admin ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, users: results });
  });
});

// Create new admin/staff user
router.post("/users", verifyAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username and password are required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === 'staff' ? 'staff' : 'admin';

    db.query(
      "INSERT INTO admin (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, userRole],
      (err, result) => {
        if (err) {
          console.error("Create user error:", err);
          if (err.code === 'ER_DUP_ENTRY') {
             return res.status(400).json({ success: false, message: "Username already exists" });
          }
          return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, message: "User created successfully" });
      }
    );
  } catch (err) {
    console.error("Create user server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete admin/staff user
router.delete("/users/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting yourself (req.userId comes from verifyToken)
  if (parseInt(id) === req.userId) {
      return res.status(400).json({ success: false, message: "Cannot delete yourself" });
  }

  db.query("DELETE FROM admin WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  });
});


// =========================
// PREMIUM MEMBERS
// =========================
router.get("/premium-members", verifyAdmin, (req, res) => {
  const BASE = process.env.API_BASE_URL || "http://localhost:5000";
  
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  let whereClause = "WHERE Plan = 'premium' AND visibility NOT LIKE 'hidden' AND Status <> 'Banned'";
  const params = [];

  if (search) {
    whereClause += " AND (Name LIKE ? OR MatriID LIKE ? OR ConfirmEmail LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSQL = `SELECT COUNT(*) AS total FROM register ${whereClause}`;

  const dataSQL = `
    SELECT 
      MatriID,
      Name,
      Gender,
      ConfirmEmail AS Email,
      Mobile,
      DOB,
      TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age,
      Regdate,
      Status,
      Lastlogin,
      Photo1,
      Photo1Approve,
      Plan
    FROM register
    ${whereClause}
    ORDER BY Regdate DESC
    LIMIT ?, ?
  `;

  db.query(countSQL, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const total = countResult[0].total;

    db.query(dataSQL, [...params, offset, limit], (err2, rows) => {
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

export default router;
