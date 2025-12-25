// routes/auth.js
import express from "express";
import db from "../config/db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer({ dest: "uploads/" });

// const path = require("path");

// const router = express.Router();

const router = express.Router();
const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
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

    return res.json({
      success: true,
      message: "Login successful",
      user: safeUser,
    });
  } catch (err) {
    console.error("auth/login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

function makePhotoUrl1(photoFilename, photoApprove) {
  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";
  const file = hasPhoto ? photoFilename : FALLBACK;
  // ensure filename is encoded for URLs
  return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
}




// ----------------------------------------------
// Helper: Build Photo URL
// ----------------------------------------------
function makePhotoUrl(photoFilename, photoApprove) {
  const FALLBACK = "no-photo.gif";
  const BASE_URL = process.env.BASE_URL || "http://10.105.121.118:5000";
  const GALLERY_PATH = "/gallery/";

  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    String(photoApprove).toLowerCase() === "yes";

  const file = hasPhoto ? photoFilename : FALLBACK;

  return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
}

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
    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";


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

router.put("/update/photo1", upload1.single("photo1"), async (req, res) => {
  try {
    const { ConfirmEmail } = req.body;

    if (!ConfirmEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    const fileName = req.file?.filename;

    if (!fileName) {
      return res.status(400).json({ success: false, message: "Image missing" });
    }

    const conn = db.promise();

    // 🔹 Only update Photo1 – DO NOT change Photo1Approve
    await conn.query(
      `
      UPDATE register SET 
        Photo1 = ?,
        Photo1Approve = "Yes"
      WHERE ConfirmEmail = ?
      `,
      [fileName, ConfirmEmail]
    );

    return res.json({
      success: true,
      message: "Photo1 updated successfully",
    });
  } catch (err) {
    console.error("update/photo1 error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/update/about", async (req, res) => {
  try {
    const { email, aboutus } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const conn = db.promise();

    const [result] = await conn.query(
      "UPDATE register SET aboutus = ? WHERE ConfirmEmail = ?",
      [aboutus, email]
    );

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

router.put("/update/basic", async (req, res) => {
  try {
    const data = req.body;

    const email = data.ConfirmEmail || data.email;
    if (!email)
      return res.status(400).json({ success: false, message: "Email missing" });

    // WHITELIST: ONLY update allowed basic fields
    const allowed = {
      Name: data.Name,
      // MatriID: data.MatriID,
      Profilecreatedby: data.Profilecreatedby,
      Gender: data.Gender,
      DOB: data.DOB,
      Maritalstatus: data.Maritalstatus,
      Religion: data.Religion,
      Caste: data.Caste,
      Subcaste: data.Subcaste || data.sub_caste,
      Mobile: data.Mobile,
    };

    // Build SQL
    const fields = Object.keys(allowed);
    const values = Object.values(allowed);

    const setQuery = fields.map((f) => `${f} = ?`).join(", ");

    const conn = db.promise();
    const [result] = await conn.query(
      `UPDATE register SET ${setQuery} WHERE ConfirmEmail = ?`,
      [...values, email]
    );

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Basic details updated" });
  } catch (err) {
    console.error("update/basic error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



function safeToJSONArray(input) {
  if (!input || input === "" || input === "null") return "[]";

  // If already JSON array → OK
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return JSON.stringify(parsed);
  } catch (err) {}

  // Otherwise convert comma-separated → array
  const arr = input
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x !== "");

  return JSON.stringify(arr);
}

// --------------------------------------------------
// UPDATE HOROSCOPE
// --------------------------------------------------


// router.put(
//   "/update/horoscope",
//   upload.single("horoscope"),
//   async (req, res) => {
//     try {
//       const {
//         ConfirmEmail,
//         Moonsign,
//         Star,
//         Gothram,
//         Manglik,
//         shani,
//         shaniplace,
//         Horosmatch,
//         parigarasevai,
//         Sevai,
//         Raghu,
//         Keethu,
//         POB,
//         POC,
//         TOB,
//         Kuladeivam, // ⭐ NEW FIELD
//         ThesaiIrupu, // ⭐ NEW FIELD
//       } = req.body;

//       if (!ConfirmEmail) {
//         return res.status(400).json({
//           success: false,
//           message: "Email missing",
//         });
//       }

//       let horoscopeBlob = null;
//       if (req.file) {
//         horoscopeBlob = fs.readFileSync(req.file.path);
//         fs.unlinkSync(req.file.path);
//       }

//       const rasi = {};
//       const navamsa = {};

//       for (let i = 1; i <= 12; i++) {
//         rasi[`g${i}`] = safeToJSONArray(req.body[`g${i}`]);
//         navamsa[`a${i}`] = safeToJSONArray(req.body[`a${i}`]);
//       }

//       const conn = db.promise();

//       await conn.query(
//         `
//         UPDATE register SET
//           Moonsign = ?, 
//           Star = ?, 
//           Gothram = ?, 
//           Manglik = ?, 
//           shani = ?, 
//           shaniplace = ?, 
//           Horosmatch = ?, 
//           parigarasevai = ?, 
//           Sevai = ?, 
//           Raghu = ?, 
//           Keethu = ?, 
//           POB = ?, 
//           POC = ?, 
//           TOB = ?, 
//           Kuladeivam = ?,        -- ⭐ NEW FIELD
//           ThesaiIrupu = ?,       -- ⭐ NEW FIELD
//           HoroscopeMain = ?,

//           g1=?, g2=?, g3=?, g4=?, g5=?, g6=?,
//           g7=?, g8=?, g9=?, g10=?, g11=?, g12=?,

//           a1=?, a2=?, a3=?, a4=?, a5=?, a6=?,
//           a7=?, a8=?, a9=?, a10=?, a11=?, a12=? 

//         WHERE ConfirmEmail = ?
//       `,
//         [
//           Moonsign,
//           Star,
//           Gothram,
//           Manglik,
//           shani,
//           shaniplace,
//           Horosmatch,
//           parigarasevai,
//           Sevai,
//           Raghu,
//           Keethu,
//           POB,
//           POC,
//           TOB,
//           Kuladeivam, // ⭐ NEW FIELD
//           ThesaiIrupu, // ⭐ NEW FIELD
//           horoscopeBlob,

//           rasi.g1,
//           rasi.g2,
//           rasi.g3,
//           rasi.g4,
//           rasi.g5,
//           rasi.g6,
//           rasi.g7,
//           rasi.g8,
//           rasi.g9,
//           rasi.g10,
//           rasi.g11,
//           rasi.g12,

//           navamsa.a1,
//           navamsa.a2,
//           navamsa.a3,
//           navamsa.a4,
//           navamsa.a5,
//           navamsa.a6,
//           navamsa.a7,
//           navamsa.a8,
//           navamsa.a9,
//           navamsa.a10,
//           navamsa.a11,
//           navamsa.a12,

//           ConfirmEmail,
//         ]
//       );

//       return res.json({
//         success: true,
//         message: "Horoscope updated successfully",
//       });
//     } catch (err) {
//       console.error("update/horoscope error:", err);
//       return res.status(500).json({
//         success: false,
//         message: "Server error",
//       });
//     }
//   }
// );


// --------------------------------------------
// UPDATE HOROSCOPE (image or PDF)
// --------------------------------------------
router.put(
  "/update/horoscope",
  upload.single("horoscope"), // multer upload
  async (req, res) => {
    try {
      const {
        ConfirmEmail,
        Moonsign,
        Star,
        Gothram,
        Manglik,
        shani,
        shaniplace,
        Horosmatch,
        parigarasevai,
        Sevai,
        Raghu,
        Keethu,
        POB,
        POC,
        TOB,
        Kuladeivam,
        ThesaiIrupu,
      } = req.body;

      if (!ConfirmEmail) {
        return res.status(400).json({
          success: false,
          message: "Email missing",
        });
      }

      // -----------------------------------
      // SAVE UPLOADED FILE → kundli folder
      // -----------------------------------
      let uploadedFileName = null;

      if (req.file) {
        const ext = req.file.originalname.split(".").pop().toLowerCase();
        const newName = `horoscope_${Date.now()}.${ext}`;

        fs.renameSync(req.file.path, `kundli/${newName}`);

        uploadedFileName = newName;
      }

      // -----------------------------------
      // PARSE 12 RASI + 12 NAVAMSA
      // -----------------------------------
      const rasi = {};
      const navamsa = {};

      for (let i = 1; i <= 12; i++) {
        rasi[`g${i}`] = safeToJSONArray(req.body[`g${i}`]);
        navamsa[`a${i}`] = safeToJSONArray(req.body[`a${i}`]);
      }

      const conn = db.promise();

      // -----------------------------------
      // UPDATE DB RECORD
      // -----------------------------------
      await conn.query(
        `
        UPDATE register SET
          Moonsign=?, Star=?, Gothram=?, Manglik=?, shani=?, shaniplace=?,
          Horosmatch=?, parigarasevai=?, Sevai=?, Raghu=?, Keethu=?, 
          POB=?, POC=?, TOB=?, Kuladeivam=?, ThesaiIrupu=?,

          -- ⭐ STORE FILENAME HERE
          horosother=?,

          g1=?, g2=?, g3=?, g4=?, g5=?, g6=?,
          g7=?, g8=?, g9=?, g10=?, g11=?, g12=?,

          a1=?, a2=?, a3=?, a4=?, a5=?, a6=?,
          a7=?, a8=?, a9=?, a10=?, a11=?, a12=?

        WHERE ConfirmEmail=?
      `,
        [
          Moonsign,
          Star,
          Gothram,
          Manglik,
          shani,
          shaniplace,
          Horosmatch,
          parigarasevai,
          Sevai,
          Raghu,
          Keethu,
          POB,
          POC,
          TOB,
          Kuladeivam,
          ThesaiIrupu,

          uploadedFileName, // ⭐ IMPORTANT

          rasi.g1, rasi.g2, rasi.g3, rasi.g4, rasi.g5, rasi.g6,
          rasi.g7, rasi.g8, rasi.g9, rasi.g10, rasi.g11, rasi.g12,

          navamsa.a1, navamsa.a2, navamsa.a3, navamsa.a4, navamsa.a5, navamsa.a6,
          navamsa.a7, navamsa.a8, navamsa.a9, navamsa.a10, navamsa.a11, navamsa.a12,

          ConfirmEmail,
        ]
      );

      return res.json({
        success: true,
        message: "Horoscope updated successfully",
      });
    } catch (err) {
      console.error("update/horoscope error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);





router.put("/update/contact", async (req, res) => {
  try {
    const {
      ConfirmEmail,
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

    if (!ConfirmEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const conn = db.promise();

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
      WHERE ConfirmEmail = ?
    `,
      [
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
        ConfirmEmail,
      ]
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

router.put("/update/education", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      Education,
      EducationDetails,
      Occupation,
      occu_details,
      Employedin,
      Annualincome,
      anyotherincome,
      income_in,
      working_hours,
      workinglocation,
      workin,
    } = req.body;

    if (!ConfirmEmail) {
      return res.status(400).json({
        success: false,
        message: "Email missing",
      });
    }

    const conn = db.promise();

    await conn.query(
      `
      UPDATE register SET 
        Education = ?, 
        EducationDetails = ?, 
        Occupation = ?, 
        occu_details = ?, 
        Employedin = ?, 
        Annualincome = ?, 
        anyotherincome = ?, 
        income_in = ?, 
        working_hours = ?, 
        workinglocation = ?, 
        workin = ?
      WHERE ConfirmEmail = ?
    `,
      [
        Education,
        EducationDetails,
        Occupation,
        occu_details,
        Employedin,
        Annualincome,
        anyotherincome,
        income_in,
        working_hours,
        workinglocation,
        workin,
        ConfirmEmail,
      ]
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

router.put("/update/lifestyle", async (req, res) => {
  try {
    const {
      ConfirmEmail,
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

    if (!ConfirmEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const conn = db.promise();

    await conn.query(
      `
      UPDATE register SET 
        height = ?,
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
      WHERE ConfirmEmail = ?
      `,
      [
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
        ConfirmEmail,
      ]
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

router.put("/update/family", async (req, res) => {
  try {
    const {
      ConfirmEmail,
      Familyvalues,
      FamilyType,
      FamilyStatus,
      noofbrothers,
      noofsisters,
      noyubrothers,
      noyusisters,
      Fathername,
      Fathersoccupation,
      Mothersname,
      Mothersoccupation,
      family_wealth,
      mother_tounge,
      familymedicalhistory,
      FamilyDetails,
    } = req.body;

    if (!ConfirmEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    const conn = db.promise();

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
        Mothersname = ?, 
        Mothersoccupation = ?, 
        family_wealth = ?, 
        mother_tounge = ?, 
        familymedicalhistory = ?, 
        FamilyDetails = ?
      WHERE ConfirmEmail = ?
    `,
      [
        Familyvalues,
        FamilyType,
        FamilyStatus,
        noofbrothers,
        noofsisters,
        noyubrothers,
        noyusisters,
        Fathername,
        Fathersoccupation,
        Mothersname,
        Mothersoccupation,
        family_wealth,
        mother_tounge,
        familymedicalhistory,
        FamilyDetails,
        ConfirmEmail,
      ]
    );

    return res.json({
      success: true,
      message: "Family details updated",
    });
  } catch (err) {
    console.error("update/family error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.put("/update/partner", async (req, res) => {
  try {
    const {
      ConfirmEmail,
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

    if (!ConfirmEmail)
      return res.status(400).json({
        success: false,
        message: "Email required",
      });

    const conn = db.promise();

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
      WHERE ConfirmEmail = ?
      `,
      [
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
        ConfirmEmail,
      ]
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
