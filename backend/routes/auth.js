// routes/auth.js
import express from "express";
import path from "path";

import fs from "fs";
import multer from "multer";
import db from "../config/db.js";
import config from "../config/env.js";
import { generateToken } from "../middleware/auth.js";

// const upload = multer({ dest: "uploads/" });


// const storage1 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "kundli"); // ✅ DIRECTLY save in kundli
//   },
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".").pop().toLowerCase();
//     cb(null, `horoscope_${Date.now()}.${ext}`);
//   },
// });

// const upload = multer({ storage1 });


const storage1 = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "kundli"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `horoscope_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage1,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const router = express.Router();
const BASE_URL = config.baseUrl;
const GALLERY_PATH = "/gallery/";
const FALLBACK = "nophoto.jpg";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });

    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT * FROM register WHERE ConfirmEmail = ? LIMIT 1",
      [email.trim()]
    );

    if (!rows.length) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    // NOTE: this compares plaintext password — change to hashed comparison in prod
    if (String(user.ConfirmPassword) !== String(password)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Remove sensitive fields before sending
    const { ConfirmPassword, ParentPassword, ...safeUser } = user;

    // Optionally remove other internal fields you don't want to expose:
    delete safeUser.Password; // if exists
    // You might want to remove email verification tokens etc.

    const token = generateToken({
      id: user.ID,
      MatriID: user.MatriID,
      ConfirmEmail: user.ConfirmEmail,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("auth/login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// function makePhotoUrl1(photoFilename, photoApprove) {
//   const hasPhoto =
//     photoFilename &&
//     photoFilename !== "no-photo.jpg" &&
//     String(photoApprove).toLowerCase() === "yes";
//   const file = hasPhoto ? photoFilename : FALLBACK;
//   // ensure filename is encoded for URLs
//   return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
// }

function makePhotoUrl1(photoFilename, photoApprove) {
  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.jpg" &&
    String(photoApprove).toLowerCase() === "yes";

  if (!hasPhoto) {
    return null; // 🔥 important
  }

  return `${BASE_URL}/gallery/${encodeURIComponent(photoFilename)}`;
}


// ----------------------------------------------
// Helper: Build Photo URL
// ----------------------------------------------
// function makePhotoUrl(photoFilename, photoApprove) {
//   const FALLBACK = "no-photo.jpg";
//   const GALLERY_PATH = "/gallery/";

//   const hasPhoto =
//     photoFilename &&
//     photoFilename !== "no-photo.jpg" &&
//     String(photoApprove).toLowerCase() === "yes";

//   const file = hasPhoto ? photoFilename : FALLBACK;

//   return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
// }

function makePhotoUrl(photoFilename, photoApprove) {
  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.jpg" &&
    String(photoApprove).toLowerCase() === "yes";

  if (!hasPhoto) {
    return null; 
  }

  return `${BASE_URL}/gallery/${encodeURIComponent(photoFilename)}`;
}


router.get("/my-profile/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT * FROM register WHERE ConfirmEmail = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error("my-profile error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ----------------------------------------------
// ⭐ GET USER DETAILS
// GET /api/auth/user?email=...
// ----------------------------------------------
router.get("/user", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const conn = db.promise();

    // ⭐ Fetch User + Calculate Age
    const [rows] = await conn.query(
      `
      SELECT *,
        TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age
      FROM register
      WHERE ConfirmEmail = ?
      LIMIT 1
      `,
      [email.trim()]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    // ------------------------------------------
    // ⭐ Build Photo URL
    // ------------------------------------------
    const PhotoURL = makePhotoUrl(user.Photo1, user.Photo1Approve);

    // ------------------------------------------
    // ⭐ Build Horoscope URL (image/pdf)
    // FILE NAME: user.horosother
    // FOLDER: kundli/
    // ------------------------------------------


    let HoroscopeURL = null;

    if (user.horosother) {
      let fileName = user.horosother;

      // Auto-detect extension if missing
      if (!fileName.includes(".")) {
        // TRY JPG first
        if (fs.existsSync(`kundli/${fileName}.jpg`)) {
          fileName = fileName + ".jpg";
        }
        // TRY PNG
        else if (fs.existsSync(`kundli/${fileName}.png`)) {
          fileName = fileName + ".png";
        }
        // TRY PDF
        else if (fs.existsSync(`kundli/${fileName}.pdf`)) {
          fileName = fileName + ".pdf";
        }
      }

      HoroscopeURL = `${BASE_URL}/kundli/${encodeURIComponent(fileName)}`;
    }


    // ------------------------------------------
    // ⭐ Remove Sensitive Fields
    // ------------------------------------------
    const {
      ConfirmPassword,
      ParentPassword,
      Password,
      ...safeUser
    } = user;

    // Add URLs
    safeUser.PhotoURL = PhotoURL;
    safeUser.HoroscopeURL = HoroscopeURL;

    // Send Response
    return res.json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    console.error("auth/user error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ⭐ GET ALL PROFILES for Matching Page
router.get("/allProfiles", async (req, res) => {
  try {
    const conn = db.promise();

    const [rows] = await conn.query(
      `
      SELECT *,
        TIMESTAMPDIFF(YEAR, DATE(DOB), CURDATE()) AS Age
      FROM register
      WHERE Status = 'Active' AND visibility NOT LIKE 'hidden'
      ORDER BY id DESC
      `
    );

    // PROCESS EACH USER → attach PhotoURL
    const users = rows.map((u) => {
      const PhotoURL = makePhotoUrl1(u.Photo1, u.Photo1Approve);

      return {
        ...u,
        PhotoURL,
      };
    });

    return res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("allProfiles error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load profiles",
    });
  }
});

router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ exists: false });

    const conn = db.promise();

    // 🔥 Use the correct column name from your DB: ConfirmEmail
    const [rows] = await conn.query(
      "SELECT id FROM register WHERE TRIM(ConfirmEmail) = TRIM(?) LIMIT 1",
      [email]
    );

    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error("check-email error:", err);
    res.status(500).json({ exists: false });
  }
});

router.get("/check-mobile", async (req, res) => {
  try {
    const { mobile } = req.query;
    if (!mobile) return res.json({ exists: false });

    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT id FROM register WHERE mobile = ? LIMIT 1",
      [mobile]
    );

    res.json({ exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "gallery/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload1 = multer({ storage });

// router.put("/update/photo1", upload1.single("photo1"), async (req, res) => {
//   try {
//     const { ConfirmEmail } = req.body;

//     if (!ConfirmEmail) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email required" });
//     }

//     const fileName = req.file?.filename;

//     if (!fileName) {
//       return res.status(400).json({ success: false, message: "Image missing" });
//     }

//     const conn = db.promise();

//     // 🔹 Only update Photo1 – DO NOT change Photo1Approve
//     await conn.query(
//       `
//       UPDATE register SET 
//         Photo1 = ?,
//         Photo1Approve = "Yes"
//       WHERE ConfirmEmail = ?
//       `,
//       [fileName, ConfirmEmail]
//     );

//     return res.json({
//       success: true,
//       message: "Photo1 updated successfully",
//     });
//   } catch (err) {
//     console.error("update/photo1 error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.put("/update/about", async (req, res) => {
//   try {
//     const { email, aboutus } = req.body;

//     if (!email) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email is required" });
//     }

//     const conn = db.promise();

//     const [result] = await conn.query(
//       "UPDATE register SET aboutus = ? WHERE ConfirmEmail = ?",
//       [aboutus, email]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "About Me updated successfully",
//     });
//   } catch (err) {
//     console.error("update/about error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

router.put("/update/photo1", upload1.single("photo1"), async (req, res) => {
  try {
    const { ConfirmEmail, matriId } = req.body;

    // ❌ No identifier
    if (!ConfirmEmail && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    const fileName = req.file?.filename;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "Image missing",
      });
    }

    const conn = db.promise();

    let query = "";
    let value = "";

    /* -----------------------------
         🟢 USER UPDATE
      ----------------------------- */
    if (ConfirmEmail) {
      query = `
          UPDATE register SET 
            Photo1 = ?,
            Photo1Approve = "Yes"
          WHERE ConfirmEmail = ?
        `;
      value = ConfirmEmail;
    } else if (matriId) {

    /* -----------------------------
         🟣 ADMIN UPDATE
      ----------------------------- */
      query = `
          UPDATE register SET 
            Photo1 = ?,
            Photo1Approve = "Yes"
          WHERE MatriID = ?
        `;
      value = matriId;
    }

    await conn.query(query, [fileName, value]);

    return res.json({
      success: true,
      message: "Photo updated successfully",
    });
  } catch (err) {
    console.error("update/photo1 error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.put("/update/about", async (req, res) => {
  try {
    const { email, matriId, aboutus } = req.body;

    // ❌ No identifier sent
    if (!email && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID is required",
      });
    }

    const conn = db.promise();

    let query = "";
    let values = [];

    /* -----------------------------------
       🟢 USER UPDATE (by email)
    ----------------------------------- */
    if (email) {
      query = "UPDATE register SET aboutus = ? WHERE ConfirmEmail = ?";
      values = [aboutus, email];
    } else if (matriId) {

    /* -----------------------------------
       🟣 ADMIN UPDATE (by MatriID)
    ----------------------------------- */
      query = "UPDATE register SET aboutus = ? WHERE MatriID = ?";
      values = [aboutus, matriId];
    }

    const [result] = await conn.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "About Me updated successfully",
    });
  } catch (err) {
    console.error("update/about error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// router.put("/update/basic", async (req, res) => {
//   try {
//     const data = req.body;

//     const email = data.ConfirmEmail || data.email;
//     if (!email)
//       return res.status(400).json({ success: false, message: "Email missing" });

//     // WHITELIST: ONLY update allowed basic fields
//     const allowed = {
//       Name: data.Name,
//       // MatriID: data.MatriID,
//       Profilecreatedby: data.Profilecreatedby,
//       Gender: data.Gender,
//       DOB: data.DOB,
//       Maritalstatus: data.Maritalstatus,
//       Religion: data.Religion,
//       Caste: data.Caste,
//       Subcaste: data.Subcaste || data.sub_caste,
//       Mobile: data.Mobile,
//     };

//     // Build SQL
//     const fields = Object.keys(allowed);
//     const values = Object.values(allowed);

//     const setQuery = fields.map((f) => `${f} = ?`).join(", ");

//     const conn = db.promise();
//     const [result] = await conn.query(
//       `UPDATE register SET ${setQuery} WHERE ConfirmEmail = ?`,
//       [...values, email]
//     );

//     if (result.affectedRows === 0) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({ success: true, message: "Basic details updated" });
//   } catch (err) {
//     console.error("update/basic error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });




// --------------------------------------------------
// UPDATE HOROSCOPE
// --------------------------------------------------


router.put("/update/basic", async (req, res) => {
  try {
    const data = req.body;

    const email = data.ConfirmEmail || data.email;
    const matriId = data.MatriID || data.matriId;

    // ❌ No identifier
    if (!email && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    /* -----------------------------------------
       WHITELIST FIELDS (same as your code)
    ----------------------------------------- */
   const allowed = {
     Name: data.Name || "",
     Profilecreatedby: data.Profilecreatedby || "",
     Gender: data.Gender || "",
     DOB: data.DOB || "",
     Maritalstatus: data.Maritalstatus || "",
     Religion: data.Religion || "",
     Caste: data.Caste || "",
     Subcaste: data.Subcaste || data.sub_caste || "",
     Mobile: data.Mobile || "",
   };


    const fields = Object.keys(allowed);
    const values = Object.values(allowed);

    const setQuery = fields.map((f) => `${f} = ?`).join(", ");

    const conn = db.promise();

    /* -----------------------------------------
       🟢 USER UPDATE
    ----------------------------------------- */
    let whereQuery = "";
    let identifier = "";

    if (email) {
      whereQuery = "ConfirmEmail = ?";
      identifier = email;
    } else if (matriId) {

    /* -----------------------------------------
       🟣 ADMIN UPDATE
    ----------------------------------------- */
      whereQuery = "MatriID = ?";
      identifier = matriId;
    }

    const [result] = await conn.query(
      `UPDATE register SET ${setQuery} WHERE ${whereQuery}`,
      [...values, identifier],
    );

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Basic details updated",
    });
  } catch (err) {
    console.error("update/basic error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



/* ----------------------------------
   MULTER CONFIG
---------------------------------- */

/* ----------------------------------
   SAFE ARRAY PARSER
---------------------------------- */
// function safeToJSONArray(value) {
//   if (!value || value === "null" || value === "") {
//     return JSON.stringify([]);
//   }

//   try {
//     const parsed = JSON.parse(value);
//     if (Array.isArray(parsed)) {
//       return JSON.stringify(parsed);
//     }
//   } catch (e) {}

//   return JSON.stringify(
//     String(value)
//       .split(",")
//       .map((x) => x.trim())
//       .filter(Boolean)
//   );
// }

function safeToJSONArray(value) {
  if (!value || value === "null" || value === "") {
    return JSON.stringify([]);
  }

  // If already array
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed);
    }
  } catch (e) {}

  return JSON.stringify(
    String(value)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  );
}


/* ----------------------------------
   UPDATE HOROSCOPE
---------------------------------- */



// router.put(
//   "/update/horoscope",
//   upload.single("horoscope"),
//   async (req, res) => {
//     try {
//       const {
//         ConfirmEmail,
//         Moonsign,
//         Star,
//         Lagnam,
//         Gothram,
//          Shani,
//   ShaniPlace,
//         Manglik,
//         Horosmatch,
//         parigarasevai,
//         Sevai,
//         Raghu,
//         Keethu,
//         POB,
//         POC,
//         TOB,
//         Kuladeivam,
//         ThesaiPlanet,
//         ThesaiYears,
//         ThesaiMonths,
//         ThesaiDays,
//         Kootam,
//         Sutham,
//       } = req.body;

//       if (!ConfirmEmail) {
//         return res.status(400).json({
//           success: false,
//           message: "Email missing",
//         });
//       }

   

//       let uploadedFileName = null;

//       if (req.file) {
//         uploadedFileName = req.file.filename; // already in kundli
//       }

//       /* ----------------------------------
//          RASI + NAVAMSA
//       ---------------------------------- */
//       const rasi = {};
//       const navamsa = {};

//       for (let i = 1; i <= 12; i++) {
//         rasi[`g${i}`] = safeToJSONArray(req.body[`g${i}`]);
//         navamsa[`a${i}`] = safeToJSONArray(req.body[`a${i}`]);
//       }

//       /* ----------------------------------
//          SQL QUERY
//       ---------------------------------- */
//       const updateQuery = `
//         UPDATE register SET
//           Moonsign=?, Star=?,  Lagnam=?, Gothram=?, Shani=?,
//   ShaniPlace=?, Manglik=?,
//           Horosmatch=?, parigarasevai=?, Sevai=?, Raghu=?, Keethu=?,
//           POB=?, POC=?, TOB=?, Kuladeivam=?, Sutham=?,
//           ThesaiPlanet=?, ThesaiYears=?, ThesaiMonths=?, ThesaiDays=?, Kootam=?,
//           ${uploadedFileName ? "horosother=?," : ""}
//           g1=?, g2=?, g3=?, g4=?, g5=?, g6=?,
//           g7=?, g8=?, g9=?, g10=?, g11=?, g12=?,
//           a1=?, a2=?, a3=?, a4=?, a5=?, a6=?,
//           a7=?, a8=?, a9=?, a10=?, a11=?, a12=?
//         WHERE TRIM(ConfirmEmail) = TRIM(?) COLLATE utf8mb4_general_ci

//       `;

// const fixInt = (v) =>
//   v === "" || v === null || v === undefined ? 0 : Number(v);

//       /* ----------------------------------
//          PARAMS (ORDER MATTERS)
//       ---------------------------------- */
//      const params = [
//        Moonsign || "",
//        Star || "",
//        Lagnam || "",
//        Gothram || "",
//         Shani || "",
//   Shani ? ShaniPlace || "" : "",
//        Manglik || "",
//        Horosmatch || "",
//        fixInt(parigarasevai),
//        fixInt(Sevai),
//        fixInt(Raghu),
//        fixInt(Keethu),
//        POB || "",
//        POC || "",
//        TOB || "",
//        Kuladeivam || "",
//        Sutham || "",
//        ThesaiPlanet || "",
//        fixInt(ThesaiYears), // ✅ FIX
//        fixInt(ThesaiMonths), // ✅ FIX
//        fixInt(ThesaiDays), // ✅ FIX
//        Kootam || "",
//      ];


//       if (uploadedFileName) {
//         params.push(uploadedFileName);
//       }

//       params.push(
//         rasi.g1,
//         rasi.g2,
//         rasi.g3,
//         rasi.g4,
//         rasi.g5,
//         rasi.g6,
//         rasi.g7,
//         rasi.g8,
//         rasi.g9,
//         rasi.g10,
//         rasi.g11,
//         rasi.g12,
//         navamsa.a1,
//         navamsa.a2,
//         navamsa.a3,
//         navamsa.a4,
//         navamsa.a5,
//         navamsa.a6,
//         navamsa.a7,
//         navamsa.a8,
//         navamsa.a9,
//         navamsa.a10,
//         navamsa.a11,
//         navamsa.a12,
//         ConfirmEmail
//       );

//       /* ----------------------------------
//          EXECUTE
//       ---------------------------------- */
//       const conn = db.promise();
//       // await conn.query(updateQuery, params);
//       const [result] = await conn.query(updateQuery, params);

// if (result.affectedRows === 0) {
//   return res.status(400).json({
//     success: false,
//     message: "No record updated. Email mismatch.",
//   });
// }
// console.log("Uploaded horoscope filename:", uploadedFileName);
// console.log("Updating horoscope for:", ConfirmEmail);


//       return res.json({
//         success: true,
//         message: "Horoscope updated successfully",
//       });
//     } catch (err) {
//       console.error("update/horoscope error:", err);
//       return res.status(500).json({
//         success: false,
//         message: err.message || "Server error",
//       });
//     }
//   }
// );


router.put(
  "/update/horoscope",
  upload.single("horoscope"),
  async (req, res) => {
    try {
      const {
        ConfirmEmail,
        matriId, // 🆕 admin support
        Moonsign,
        Star,
        Lagnam,
        Gothram,
        Shani,
        ShaniPlace,
        Manglik,
        Horosmatch,
        parigarasevai,
        Sevai,
        Raghu,
        Keethu,
        POB,
        POC,
        TOB,
        Kuladeivam,
        ThesaiPlanet,
        ThesaiYears,
        ThesaiMonths,
        ThesaiDays,
        Kootam,
        Sutham,
      } = req.body;

      /* ------------------------------
         IDENTIFIER CHECK
      ------------------------------ */
      if (!ConfirmEmail && !matriId) {
        return res.status(400).json({
          success: false,
          message: "Email or MatriID required",
        });
      }

      let uploadedFileName = null;
      if (req.file) {
        uploadedFileName = req.file.filename;
      }

      /* ------------------------------
         RASI + NAVAMSA
      ------------------------------ */
      const rasi = {};
      const navamsa = {};

      for (let i = 1; i <= 12; i++) {
        rasi[`g${i}`] = safeToJSONArray(req.body[`g${i}`]);
        navamsa[`a${i}`] = safeToJSONArray(req.body[`a${i}`]);
      }

      const fixInt = (v) =>
        v === "" || v === null || v === undefined ? 0 : Number(v);

      /* ------------------------------
         SQL
      ------------------------------ */
      const updateQuery = `
        UPDATE register SET
          Moonsign=?, Star=?, Lagnam=?, Gothram=?, 
          Shani=?, ShaniPlace=?, Manglik=?,
          Horosmatch=?, parigarasevai=?, Sevai=?, Raghu=?, Keethu=?,
          POB=?, POC=?, TOB=?, Kuladeivam=?, Sutham=?,
          ThesaiPlanet=?, ThesaiYears=?, ThesaiMonths=?, ThesaiDays=?, Kootam=?,
          ${uploadedFileName ? "horosother=?," : ""}
          g1=?, g2=?, g3=?, g4=?, g5=?, g6=?,
          g7=?, g8=?, g9=?, g10=?, g11=?, g12=?,
          a1=?, a2=?, a3=?, a4=?, a5=?, a6=?,
          a7=?, a8=?, a9=?, a10=?, a11=?, a12=?
        WHERE ${ConfirmEmail ? "TRIM(ConfirmEmail)=TRIM(?)" : "MatriID=?"}
      `;

      const params = [
        Moonsign || "",
        Star || "",
        Lagnam || "",
        Gothram || "",
        Shani || "",
        Shani ? ShaniPlace || "" : "",
        Manglik || "",
        Horosmatch || "",
        fixInt(parigarasevai),
        fixInt(Sevai),
        fixInt(Raghu),
        fixInt(Keethu),
        POB || "",
        POC || "",
        TOB || "",
        Kuladeivam || "",
        Sutham || "",
        ThesaiPlanet || "",
        fixInt(ThesaiYears),
        fixInt(ThesaiMonths),
        fixInt(ThesaiDays),
        Kootam || "",
      ];

      if (uploadedFileName) {
        params.push(uploadedFileName);
      }

      params.push(
        rasi.g1,
        rasi.g2,
        rasi.g3,
        rasi.g4,
        rasi.g5,
        rasi.g6,
        rasi.g7,
        rasi.g8,
        rasi.g9,
        rasi.g10,
        rasi.g11,
        rasi.g12,
        navamsa.a1,
        navamsa.a2,
        navamsa.a3,
        navamsa.a4,
        navamsa.a5,
        navamsa.a6,
        navamsa.a7,
        navamsa.a8,
        navamsa.a9,
        navamsa.a10,
        navamsa.a11,
        navamsa.a12,
        ConfirmEmail || matriId, // 🆕 identifier
      );

      const conn = db.promise();
      const [result] = await conn.query(updateQuery, params);

      if (result.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "No record updated",
        });
      }

      return res.json({
        success: true,
        message: "Horoscope updated successfully",
      });
    } catch (err) {
      console.error("update/horoscope error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  },
);


// router.put("/update/contact", async (req, res) => {
//   try {
//     const {
//       ConfirmEmail,
//       Country,
//       State,
//       Dist,
//       City,
//       Pincode,
//       Residencystatus,
//       Address,
//       Phone,
//       Mobile,
//       Mobile2,
//       calling_time,
//       POC,
//     } = req.body;

//     if (!ConfirmEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const conn = db.promise();

//     await conn.query(
//       `
//       UPDATE register SET 
//         Country = ?, 
//         State = ?, 
//         Dist = ?, 
//         City = ?, 
//         Pincode = ?, 
//         Residencystatus = ?, 
//         Address = ?, 
//         Phone = ?, 
//         Mobile = ?, 
//         Mobile2 = ?, 
//         calling_time = ?, 
//         POC = ?
//       WHERE ConfirmEmail = ?
//     `,
//       [
//         Country,
//         State,
//         Dist,
//         City,
//         Pincode,
//         Residencystatus,
//         Address,
//         Phone,
//         Mobile,
//         Mobile2,
//         calling_time,
//         POC,
//         ConfirmEmail,
//       ]
//     );

//     return res.json({
//       success: true,
//       message: "Contact details updated successfully",
//     });
//   } catch (err) {
//     console.error("update/contact error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });


router.put("/update/contact", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      matriId, // 🆕 admin support
      Country,
      State,
      Dist,
      City,
      Pincode,
      Residencystatus,
      Address,
      Phone,
      Mobile,
      Mobile2,
      calling_time,
      POC,
    } = req.body;

    /* -----------------------------
       IDENTIFIER CHECK
    ----------------------------- */
    if (!ConfirmEmail && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    const conn = db.promise();

    /* -----------------------------
       WHERE CONDITION
    ----------------------------- */
    let whereQuery = "";
    let identifier = "";

    if (ConfirmEmail) {
      whereQuery = "ConfirmEmail = ?";
      identifier = ConfirmEmail;
    } else {
      whereQuery = "MatriID = ?";
      identifier = matriId;
    }

    /* -----------------------------
       UPDATE QUERY
    ----------------------------- */
    await conn.query(
      `
      UPDATE register SET 
        Country = ?, 
        State = ?, 
        Dist = ?, 
        City = ?, 
        Pincode = ?, 
        Residencystatus = ?, 
        Address = ?, 
        Phone = ?, 
        Mobile = ?, 
        Mobile2 = ?, 
        calling_time = ?, 
        POC = ?
      WHERE ${whereQuery}
    `,
      [
        Country || "",
        State || "",
        Dist || "",
        City || "",
        Pincode || "",
        Residencystatus || "",
        Address || "",
        Phone || "",
        Mobile || "",
        Mobile2 || "",
        calling_time || "",
        POC || "",
        identifier,
      ],
    );

    return res.json({
      success: true,
      message: "Contact details updated successfully",
    });
  } catch (err) {
    console.error("update/contact error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});




// router.put("/update/education", async (req, res) => {
//   try {
//     const {
//       ConfirmEmail,
//       Education,
//       EducationDetails,
//       Occupation,
//       occu_details,
//       Employedin,
//       Annualincome,
//       anyotherincome,
//       income_in,
//       working_hours,
//       workinglocation,
//       workin,
//     } = req.body;

//     if (!ConfirmEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Email missing",
//       });
//     }

//     const conn = db.promise();

//     await conn.query(
//       `
//       UPDATE register SET 
//         Education = ?, 
//         EducationDetails = ?, 
//         Occupation = ?, 
//         occu_details = ?, 
//         Employedin = ?, 
//         Annualincome = ?, 
//         anyotherincome = ?, 
//         income_in = ?, 
//         working_hours = ?, 
//         workinglocation = ?, 
//         workin = ?
//       WHERE ConfirmEmail = ?
//     `,
//       [
//         Education,
//         EducationDetails,
//         Occupation,
//         occu_details,
//         Employedin,
//         Annualincome,
//         anyotherincome,
//         income_in,
//         working_hours,
//         workinglocation,
//         workin,
//         ConfirmEmail,
//       ]
//     );

//     return res.json({
//       success: true,
//       message: "Education details updated successfully",
//     });
//   } catch (err) {
//     console.error("update/education error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// router.put("/update/education", async (req, res) => {
//   try {
//     const {
//       ConfirmEmail,
//       matriId, // 🆕 admin support
//       Education,
//       EducationDetails,
//       Occupation,
//       occu_details,
//       Employedin,
//       Annualincome,
//       anyotherincome,
//       income_in,
//       working_hours,
//       workinglocation,
//       workin,
//     } = req.body;

//     /* -----------------------------
//        IDENTIFIER CHECK
//     ----------------------------- */
//     if (!ConfirmEmail && !matriId) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or MatriID required",
//       });
//     }

//     const conn = db.promise();

//     /* -----------------------------
//        WHERE CONDITION
//     ----------------------------- */
//     let whereQuery = "";
//     let identifier = "";

//     if (ConfirmEmail) {
//       whereQuery = "ConfirmEmail = ?";
//       identifier = ConfirmEmail;
//     } else {
//       whereQuery = "MatriID = ?";
//       identifier = matriId;
//     }

//     /* -----------------------------
//        UPDATE QUERY
//     ----------------------------- */
//     await conn.query(
//       `
//       UPDATE register SET 
//         Education = ?, 
//         EducationDetails = ?, 
//         Occupation = ?, 
//         occu_details = ?, 
//         Employedin = ?, 
//         Annualincome = ?, 
//         anyotherincome = ?, 
//         income_in = ?, 
//         working_hours = ?, 
//         workinglocation = ?, 
//         workin = ?
//       WHERE ${whereQuery}
//       `,
//       [
//         Education || "",
//         EducationDetails || "",
//         Occupation || "",
//         occu_details || "",
//         Employedin || "",
//         Annualincome || "",
//         anyotherincome || "",
//         income_in || "",
//         working_hours || "",
//         workinglocation || "",
//         workin || "",
//         identifier,
//       ],
//     );

//     return res.json({
//       success: true,
//       message: "Education details updated successfully",
//     });
//   } catch (err) {
//     console.error("update/education error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });


router.put("/update/education", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      matriId,
      Education,
      EducationDetails,
      Occupation,
      occu_details, // coming from frontend
      Employedin,
      Annualincome,
      anyotherincome,
      income_in,
      working_hours,
      workinglocation,
      company_name,
    } = req.body;

    if (!ConfirmEmail && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    const conn = db.promise();

    let whereQuery = "";
    let identifier = "";

    if (ConfirmEmail) {
      whereQuery = "ConfirmEmail = ?";
      identifier = ConfirmEmail;
    } else {
      whereQuery = "MatriID = ?";
      identifier = matriId;
    }

    await conn.query(
      `
      UPDATE register SET 
        Education = ?, 
        EducationDetails = ?, 
        Occupation = ?, 
        OccupationDetails = ?,   -- ✅ FIXED COLUMN NAME
        Employedin = ?, 
        Annualincome = ?, 
        anyotherincome = ?, 
        income_in = ?, 
        working_hours = ?, 
        workinglocation = ?, 
        company_name = ?
      WHERE ${whereQuery}
      `,
      [
        Education || "",
        EducationDetails || "",
        Occupation || "",
        occu_details || "", // frontend value → DB column
        Employedin || "",
        Annualincome || "",
        anyotherincome || "",
        income_in || "",
        working_hours || "",
        workinglocation || "",
        company_name || "",
        identifier,
      ],
    );

    return res.json({
      success: true,
      message: "Education details updated successfully",
    });
  } catch (err) {
    console.error("update/education error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// router.put("/update/lifestyle", async (req, res) => {
//   try {
//     const {
//       ConfirmEmail,
//       Height,
//       HeightText,
//       Weight,
//       BloodGroup,
//       Complexion,
//       Bodytype,
//       Diet,
//       Smoke,
//       Drink,
//       spe_cases,
//       Hobbies,
//       Interests,
//       passport,
//       medicalhistory,
//       familymedicalhistory,
//       anyotherincome,
//     } = req.body;

//     if (!ConfirmEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const conn = db.promise();

//     await conn.query(
//       `
//       UPDATE register SET 
//         height = ?,
//         HeightText = ?, 
//         Weight = ?,
//         BloodGroup = ?,
//         Complexion = ?,
//         Bodytype = ?,
//         Diet = ?,
//         Smoke = ?,
//         Drink = ?,
//         spe_cases = ?,
//         Hobbies = ?,
//         Interests = ?,
//         passport = ?,
//         medicalhistory = ?,
//         familymedicalhistory = ?,
//         anyotherincome = ?
//       WHERE ConfirmEmail = ?
//       `,
//       [
//         Height,
//         HeightText,
//         Weight,
//         BloodGroup,
//         Complexion,
//         Bodytype,
//         Diet,
//         Smoke,
//         Drink,
//         spe_cases,
//         Hobbies,
//         Interests,
//         passport,
//         medicalhistory,
//         familymedicalhistory,
//         anyotherincome,
//         ConfirmEmail,
//       ]
//     );

//     res.json({
//       success: true,
//       message: "Lifestyle details updated",
//     });
//   } catch (err) {
//     console.error("update/lifestyle error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });


router.put("/update/lifestyle", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      matriId, // 🆕 Admin support

      Height,
      HeightText,
      Weight,
      BloodGroup,
      Complexion,
      Bodytype,
      Diet,
      Smoke,
      Drink,
      spe_cases,
      Hobbies,
      Interests,
      passport,
      medicalhistory,
      familymedicalhistory,
      anyotherincome,
    } = req.body;

    /* -----------------------------
       IDENTIFIER CHECK
    ----------------------------- */
    if (!ConfirmEmail && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    const conn = db.promise();

    /* -----------------------------
       WHERE CONDITION
    ----------------------------- */
    let whereQuery = "";
    let identifier = "";

    if (ConfirmEmail) {
      whereQuery = "ConfirmEmail = ?";
      identifier = ConfirmEmail;
    } else {
      whereQuery = "MatriID = ?";
      identifier = matriId;
    }

    /* -----------------------------
       UPDATE QUERY
    ----------------------------- */
    await conn.query(
      `
      UPDATE register SET 
        Height = ?,
        HeightText = ?, 
        Weight = ?,
        BloodGroup = ?,
        Complexion = ?,
        Bodytype = ?,
        Diet = ?,
        Smoke = ?,
        Drink = ?,
        spe_cases = ?,
        Hobbies = ?,
        Interests = ?,
        passport = ?,
        medicalhistory = ?,
        familymedicalhistory = ?,
        anyotherincome = ?
      WHERE ${whereQuery}
      `,
      [
        Height || "",
        HeightText || "",
        Weight || "",
        BloodGroup || "",
        Complexion || "",
        Bodytype || "",
        Diet || "",
        Smoke || "",
        Drink || "",
        spe_cases || "",
        Hobbies || "",
        Interests || "",
        passport || "",
        medicalhistory || "",
        familymedicalhistory || "",
        anyotherincome || "",
        identifier,
      ],
    );

    res.json({
      success: true,
      message: "Lifestyle details updated",
    });
  } catch (err) {
    console.error("update/lifestyle error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// router.put("/update/family", async (req, res) => {
//   try {
//     const {
//       ConfirmEmail,
//       Familyvalues,
//       FamilyType,
//       FamilyStatus,
//       noofbrothers,
//       noofsisters,
//       noyubrothers,
//       noyusisters,
//       Fathername,
//       Fathersoccupation,
//       FatherPoorvegam, // ✅ NEW
//       Mothersname,
//       Mothersoccupation,
//       MotherPoorvegam, // ✅ NEW
//       family_wealth,
//       mother_tounge,
//       familymedicalhistory,
//       FamilyDetails,
//     } = req.body;

//     // ✅ Validation
//     if (!ConfirmEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Email required",
//       });
//     }

//     const conn = db.promise();

//     // ✅ SQL Update
//     await conn.query(
//       `
//       UPDATE register SET
//         Familyvalues = ?,
//         FamilyType = ?,
//         FamilyStatus = ?,
//         noofbrothers = ?,
//         noofsisters = ?,
//         noyubrothers = ?,
//         noyusisters = ?,
//         Fathername = ?,
//         Fathersoccupation = ?,
//         FatherPoorvegam = ?,      -- ✅
//         Mothersname = ?,
//         Mothersoccupation = ?,
//         MotherPoorvegam = ?,      -- ✅
//         family_wealth = ?,
//         mother_tounge = ?,
//         familymedicalhistory = ?,
//         FamilyDetails = ?
//       WHERE ConfirmEmail = ?
//       `,
//       [
//         Familyvalues,
//         FamilyType,
//         FamilyStatus,
//         noofbrothers,
//         noofsisters,
//         noyubrothers,
//         noyusisters,
//         Fathername,
//         Fathersoccupation,
//         FatherPoorvegam, // ✅
//         Mothersname,
//         Mothersoccupation,
//         MotherPoorvegam, // ✅
//         family_wealth,
//         mother_tounge,
//         familymedicalhistory,
//         FamilyDetails,
//         ConfirmEmail,
//       ]
//     );

//     return res.json({
//       success: true,
//       message: "Family details updated successfully",
//     });
//   } catch (err) {
//     console.error("update/family error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

router.put("/update/family", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      matriId, // 🆕 Admin support

      Familyvalues,
      FamilyType,
      FamilyStatus,
      noofbrothers,
      noofsisters,
      noyubrothers,
      noyusisters,
      Fathername,
      Fathersoccupation,
      FatherPoorvegam,
      Mothersname,
      Mothersoccupation,
      MotherPoorvegam,
      family_wealth,
      mother_tounge,
      familymedicalhistory,
      FamilyDetails,
    } = req.body;

    /* -----------------------------
       IDENTIFIER CHECK
    ----------------------------- */
    if (!ConfirmEmail && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    const conn = db.promise();

    /* -----------------------------
       WHERE CONDITION
    ----------------------------- */
    let whereQuery = "";
    let identifier = "";

    if (ConfirmEmail) {
      whereQuery = "ConfirmEmail = ?";
      identifier = ConfirmEmail;
    } else {
      whereQuery = "MatriID = ?";
      identifier = matriId;
    }

    /* -----------------------------
       UPDATE QUERY
    ----------------------------- */
    await conn.query(
      `
      UPDATE register SET
        Familyvalues = ?,
        FamilyType = ?,
        FamilyStatus = ?,
        noofbrothers = ?,
        noofsisters = ?,
        noyubrothers = ?,
        noyusisters = ?,
        Fathername = ?,
        Fathersoccupation = ?,
        FatherPoorvegam = ?,
        Mothersname = ?,
        Mothersoccupation = ?,
        MotherPoorvegam = ?,
        family_wealth = ?,
        mother_tounge = ?,
        familymedicalhistory = ?,
        FamilyDetails = ?
      WHERE ${whereQuery}
      `,
      [
        Familyvalues || "",
        FamilyType || "",
        FamilyStatus || "",
        noofbrothers || "",
        noofsisters || "",
        noyubrothers || "",
        noyusisters || "",
        Fathername || "",
        Fathersoccupation || "",
        FatherPoorvegam || "",
        Mothersname || "",
        Mothersoccupation || "",
        MotherPoorvegam || "",
        family_wealth || "",
        mother_tounge || "",
        familymedicalhistory || "",
        FamilyDetails || "",
        identifier,
      ],
    );

    return res.json({
      success: true,
      message: "Family details updated successfully",
    });
  } catch (err) {
    console.error("update/family error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// router.put("/update/partner", async (req, res) => {
//   try {
//     const {
//       ConfirmEmail,
//       Looking,
//       PE_FromAge,
//       PE_ToAge,
//       PE_from_Height,
//       PE_to_Height,
//       PE_Complexion,
//       PE_MotherTongue,
//       PE_Religion,
//       PE_Caste,
//       PE_subcaste,
//       PE_Education,
//       PE_Occupation,
//       PE_Residentstatus,
//       PE_Country,
//       PE_Countrylivingin,
//       PE_State,
//       PE_City,
//       PartnerExpectations,
//     } = req.body;

//     if (!ConfirmEmail)
//       return res.status(400).json({
//         success: false,
//         message: "Email required",
//       });

//     const conn = db.promise();

//     await conn.query(
//       `
//       UPDATE register SET 
//         Looking = ?, 
//         PE_FromAge = ?, 
//         PE_ToAge = ?, 
//         PE_from_Height = ?, 
//         PE_to_Height = ?, 
//         PE_Complexion = ?, 
//         PE_MotherTongue = ?, 
//         PE_Religion = ?, 
//         PE_Caste = ?, 
//         PE_subcaste = ?, 
//         PE_Education = ?, 
//         PE_Occupation = ?, 
//         PE_Residentstatus = ?, 
//         PE_Country = ?, 
//         PE_Countrylivingin = ?, 
//         PE_State = ?, 
//         PE_City = ?, 
//         PartnerExpectations = ?
//       WHERE ConfirmEmail = ?
//       `,
//       [
//         Looking,
//         PE_FromAge,
//         PE_ToAge,
//         PE_from_Height,
//         PE_to_Height,
//         PE_Complexion,
//         PE_MotherTongue,
//         PE_Religion,
//         PE_Caste,
//         PE_subcaste,
//         PE_Education,
//         PE_Occupation,
//         PE_Residentstatus,
//         PE_Country,
//         PE_Countrylivingin,
//         PE_State,
//         PE_City,
//         PartnerExpectations,
//         ConfirmEmail,
//       ]
//     );

//     return res.json({
//       success: true,
//       message: "Partner preferences updated",
//     });
//   } catch (err) {
//     console.error("update/partner error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });


router.put("/update/partner", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      matriId, // 🆕 Admin support

      Looking,
      PE_FromAge,
      PE_ToAge,
      PE_from_Height,
      PE_to_Height,
      PE_Complexion,
      PE_MotherTongue,
      PE_Religion,
      PE_Caste,
      PE_subcaste,
      PE_Education,
      PE_Occupation,
      PE_Residentstatus,
      PE_Country,
      PE_Countrylivingin,
      PE_State,
      PE_City,
      PartnerExpectations,
    } = req.body;

    /* -----------------------------
       IDENTIFIER CHECK
    ----------------------------- */
    if (!ConfirmEmail && !matriId) {
      return res.status(400).json({
        success: false,
        message: "Email or MatriID required",
      });
    }

    const conn = db.promise();

    /* -----------------------------
       WHERE CONDITION
    ----------------------------- */
    let whereQuery = "";
    let identifier = "";

    if (ConfirmEmail) {
      whereQuery = "ConfirmEmail = ?";
      identifier = ConfirmEmail;
    } else {
      whereQuery = "MatriID = ?";
      identifier = matriId;
    }

    /* -----------------------------
       UPDATE QUERY
    ----------------------------- */
    await conn.query(
      `
      UPDATE register SET 
        Looking = ?, 
        PE_FromAge = ?, 
        PE_ToAge = ?, 
        PE_from_Height = ?, 
        PE_to_Height = ?, 
        PE_Complexion = ?, 
        PE_MotherTongue = ?, 
        PE_Religion = ?, 
        PE_Caste = ?, 
        PE_subcaste = ?, 
        PE_Education = ?, 
        PE_Occupation = ?, 
        PE_Residentstatus = ?, 
        PE_Country = ?, 
        PE_Countrylivingin = ?, 
        PE_State = ?, 
        PE_City = ?, 
        PartnerExpectations = ?
      WHERE ${whereQuery}
      `,
      [
        Looking || "",
        PE_FromAge || "",
        PE_ToAge || "",
        PE_from_Height || "",
        PE_to_Height || "",
        PE_Complexion || "",
        PE_MotherTongue || "",
        PE_Religion || "",
        PE_Caste || "",
        PE_subcaste || "",
        PE_Education || "",
        PE_Occupation || "",
        PE_Residentstatus || "",
        PE_Country || "",
        PE_Countrylivingin || "",
        PE_State || "",
        PE_City || "",
        PartnerExpectations || "",
        identifier,
      ],
    );

    return res.json({
      success: true,
      message: "Partner preferences updated",
    });
  } catch (err) {
    console.error("update/partner error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



export default router;
