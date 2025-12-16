// import express from "express";
// import db from "../config/db.js";

// const router = express.Router();

// // GET /api/auth/searchByMatriID?matriid=PSM10089
// router.get("/searchByMatriID", async (req, res) => {
//   try {
//     const { matriid } = req.query;
//     if (!matriid || String(matriid).trim() === "") {
//       return res
//         .status(400)
//         .json({ success: false, message: "matriid required" });
//     }

//     const conn = db.promise();
//     const [rows] = await conn.query(
//       `
//         SELECT *
//         FROM register
//         WHERE MatriID = ? OR matid = ?
//         LIMIT 1
//       `,
//       [matriid.trim(), matriid.trim()]
//     );

//     if (!rows.length) {
//       return res.json({ success: false, message: "No profile found" });
//     }

//     const user = rows[0];

//     // Extract PhotoMain (binary)
//     const { ConfirmPassword, ParentPassword, PhotoMain, ...safeUser } = user;

//     // Convert to Base64 URL
//     safeUser.PhotoURL = PhotoMain
//       ? `data:image/jpeg;base64,${PhotoMain.toString("base64")}`
//       : null;

//     return res.json({ success: true, user: safeUser });
//   } catch (err) {
//     console.error("searchByMatriID error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

// export default router;

// routes/searchByMatriID.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
const GALLERY_PATH = "/gallery/";
const FALLBACK = "nophoto.jpg";

function makePhotoUrl(photoFilename, photoApprove) {
  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";
  const file = hasPhoto ? photoFilename : FALLBACK;
  return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
}

// GET /api/auth/searchByMatriID?matriid=PSM10089
// router.get("/searchByMatriID", async (req, res) => {
//   try {
//     const { matriid } = req.query;
//     if (!matriid || String(matriid).trim() === "") {
//       return res
//         .status(400)
//         .json({ success: false, message: "matriid required" });
//     }

//     const conn = db.promise();
//     const [rows] = await conn.query(
//       `
//         SELECT *
//         FROM register
//         WHERE MatriID = ? OR matid = ?
//         LIMIT 1
//       `,
//       [matriid.trim(), matriid.trim()]
//     );

//     if (!rows.length) {
//       return res.json({ success: false, message: "No profile found" });
//     }

//     const user = rows[0];

//     // Remove sensitive fields and binary PhotoMain if present
//     const { ConfirmPassword, ParentPassword, PhotoMain, ...safeUser } = user;

//     // Build gallery URL using Photo1 + Photo1Approve (same as auth.js)
//     safeUser.PhotoURL = makePhotoUrl(user.Photo1, user.Photo1Approve);

//     return res.json({ success: true, user: safeUser });
//   } catch (err) {
//     console.error("searchByMatriID error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

// router.get("/searchByMatriID", async (req, res) => {
//   try {
//     const { matriid } = req.query;
//     if (!matriid || String(matriid).trim() === "") {
//       return res
//         .status(400)
//         .json({ success: false, message: "matriid required" });
//     }

//     const conn = db.promise();

//     // ⭐ Added TIMESTAMPDIFF(YEAR...) AS Age (same as /user API)
//     const [rows] = await conn.query(
//       `
//         SELECT *,
//           TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age
//         FROM register
//         WHERE MatriID = ? OR matid = ?
//         LIMIT 1
//       `,
//       [matriid.trim(), matriid.trim()]
//     );

//     if (!rows.length) {
//       return res.json({ success: false, message: "No profile found" });
//     }

//     const user = rows[0];

//     // ⭐ Remove sensitive fields
//     const { ConfirmPassword, ParentPassword, PhotoMain, ...safeUser } = user;

//     // ⭐ Build Photo URL exactly like /user route
//     safeUser.PhotoURL = makePhotoUrl(user.Photo1, user.Photo1Approve);

//     return res.json({ success: true, user: safeUser });
//   } catch (err) {
//     console.error("searchByMatriID error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });


router.get("/searchByMatriID", async (req, res) => {
  try {
    const { matriid, loggedPlan } = req.query;

    if (!matriid || String(matriid).trim() === "") {
      return res.status(400).json({ success: false });
    }

    const conn = db.promise();

    let sql = `
      SELECT *,
        TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age
      FROM register
      WHERE (MatriID = ? OR matid = ?)
    `;

    const params = [matriid.trim(), matriid.trim()];

    // 🔒 HARD BLOCK PREMIUM FOR BASIC USERS
    if ((loggedPlan || "").toLowerCase() === "basic") {
      sql += ` AND TRIM(LOWER(plan)) = 'basic' `;
    }

    sql += ` LIMIT 1`;

    const [rows] = await conn.query(sql, params);

    if (!rows.length) {
      return res.json({ success: false });
    }

    const user = rows[0];

    const { ConfirmPassword, ParentPassword, PhotoMain, ...safeUser } = user;
    safeUser.PhotoURL = makePhotoUrl(
      user.Photo1,
      user.Photo1Approve
    );

    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("searchByMatriID error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
