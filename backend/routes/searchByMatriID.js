

// // routes/searchByMatriID.js
// import express from "express";
// import db from "../config/db.js";

// const router = express.Router();

// const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
// const GALLERY_PATH = "/gallery/";
// const FALLBACK = "nophoto.jpg";

// function makePhotoUrl(photoFilename, photoApprove) {
//   const hasPhoto =
//     photoFilename &&
//     photoFilename !== "no-photo.gif" &&
//     String(photoApprove).toLowerCase() === "yes";
//   const file = hasPhoto ? photoFilename : FALLBACK;
//   return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
// }


// router.get("/searchByMatriID", async (req, res) => {
//   try {
//     const { matriid, loggedPlan } = req.query;

//     if (!matriid || String(matriid).trim() === "") {
//       return res.status(400).json({ success: false });
//     }

//     const conn = db.promise();

//     let sql = `
//       SELECT *,
//         TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age
//       FROM register
//       WHERE (MatriID = ? OR matid = ?)
//     `;

//     const params = [matriid.trim(), matriid.trim()];

//     // ✅ CORRECT PLAN FILTER (FIXED COLUMN NAME)
//     if ((loggedPlan || "").toLowerCase() === "basic") {
//       sql += " AND TRIM(LOWER(Plan)) = 'basic' ";
//     } else if ((loggedPlan || "").toLowerCase() === "premium") {
//       sql += " AND TRIM(LOWER(Plan)) IN ('basic','premium') ";
//     }

//     sql += " LIMIT 1";

//     const [rows] = await conn.query(sql, params);

//     if (!rows.length) {
//       return res.json({ success: false });
//     }

//     const user = rows[0];
//     const { ConfirmPassword, ParentPassword, PhotoMain, ...safeUser } = user;

//     safeUser.PhotoURL = makePhotoUrl(
//       user.Photo1,
//       user.Photo1Approve
//     );

//     return res.json({ success: true, user: safeUser });
//   } catch (err) {
//     console.error("searchByMatriID error:", err);
//     return res.status(500).json({ success: false });
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

/* ---------------- HELPERS ---------------- */

function makePhotoUrl(photoFilename, photoApprove) {
  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  const file = hasPhoto ? photoFilename : FALLBACK;
  return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
}

function makeGalleryUrl(filename) {
  if (!filename) return null;
  return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(filename)}`;
}

/* ---------------- ROUTE ---------------- */

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

    /* PLAN FILTER */
    if ((loggedPlan || "").toLowerCase() === "basic") {
      sql += " AND TRIM(LOWER(Plan)) = 'basic' ";
    } else if ((loggedPlan || "").toLowerCase() === "premium") {
      sql += " AND TRIM(LOWER(Plan)) IN ('basic','premium') ";
    }

    sql += " LIMIT 1";

    const [rows] = await conn.query(sql, params);

    if (!rows.length) {
      return res.json({ success: false });
    }

    const user = rows[0];

    /* REMOVE SENSITIVE FIELDS */
    const {
      ConfirmPassword,
      ParentPassword,
      PhotoMain,
      ...safeUser
    } = user;

    /* MAIN PROFILE PHOTO */
    safeUser.PhotoURL = makePhotoUrl(
      user.Photo1,
      user.Photo1Approve
    );

    /* GALLERY PHOTOS (image1–image4) */
    safeUser.gallery = [
      makeGalleryUrl(user.image1),
      makeGalleryUrl(user.image2),
      makeGalleryUrl(user.image3),
      makeGalleryUrl(user.image4),
    ].filter(Boolean);

    return res.json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    console.error("searchByMatriID error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
