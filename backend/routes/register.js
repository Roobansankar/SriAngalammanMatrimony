// routes/register.js
import express from "express";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import db from "../config/db.js";

import multer from "multer";

const router = express.Router();

const galleryPath = path.join(process.cwd(), "gallery");
if (!fs.existsSync(galleryPath)) {
  fs.mkdirSync(galleryPath, { recursive: true });
}

// ---------- OTP store ----------
const otpStore = new Map(); // email -> { otp, expiresAt }
const setOtp = (email, otp) =>
  otpStore.set(email, {
    otp: String(otp),
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
const getOtp = (email) => {
  const v = otpStore.get(email);
  if (!v) return null;
  if (Date.now() > v.expiresAt) {
    otpStore.delete(email);
    return null;
  }
  return v.otp;
};
const deleteOtp = (email) => otpStore.delete(email);

// ---------- SMTP ----------

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 60000, // 60 seconds
});

// Verify SMTP connection once at startup (non-blocking)
transporter
  .verify()
  .then(() => console.log("📬 SMTP ready"))
  .catch((err) => console.error("📪 SMTP verify failed:", err.message));

// ---------- Send OTP ----------
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, error: "Email required" });
    
    const otp = Math.floor(100000 + Math.random() * 900000);
    setOtp(email, otp);

    console.log(`📧 Sending OTP to ${email}...`);
    
    // Send email and wait for confirmation
    const info = await transporter.sendMail({
      from: `"Sriangalamman Matrimony" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code - Sriangalamman Matrimony",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #e11d48;">Sriangalamman Matrimony</h2>
          <p>Your verification code is:</p>
          <div style="background: #fef2f2; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e11d48;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
      replyTo: process.env.SMTP_USER,
    });
    
    console.log("✅ OTP mail sent:", info?.messageId);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ send-otp error:", err.message);
    res.status(500).json({ success: false, error: "Failed to send OTP. Please try again." });
  }
});

// ---------- Verify OTP ----------
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: "Email and OTP are required" });
  }
  
  const stored = getOtp(email);
  
  if (!stored) {
    return res.status(400).json({ success: false, error: "OTP expired or not found. Please request a new OTP." });
  }
  
  if (stored === String(otp).trim()) {
    deleteOtp(email);
    return res.json({ success: true, message: "OTP verified" });
  }
  
  res.status(400).json({ success: false, error: "Invalid OTP. Please check and try again." });
});

// ---------- Generate MatriID ----------
router.get("/generate-matriid/:gender", async (req, res) => {
  const { gender } = req.params;
  if (!gender) return res.status(400).json({ message: "Gender is required" });

  const prefix = gender.toLowerCase() === "male" ? "SAM" : "SAF";
  let conn;

  try {
    conn = await db.promise().getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT last_number FROM matriid_counter WHERE gender = ? FOR UPDATE",
      [gender]
    );

    if (!rows.length) {
      await conn.query(
        "INSERT INTO matriid_counter (gender, last_number) VALUES (?, 0)",
        [gender]
      );
    }

    const current = rows[0]?.last_number ?? 0;
    const nextNumber = current + 1;

    await conn.query(
      "UPDATE matriid_counter SET last_number = ? WHERE gender = ?",
      [nextNumber, gender]
    );

    await conn.commit();

    const matriId = prefix + nextNumber.toString().padStart(3, "0");
    res.json({ matriId });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    console.error("Error generating MatriID:", err);
    res
      .status(500)
      .json({ message: "Error generating MatriID", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Use memory storage (we’re not saving to /uploads folder)
const upload = multer({ storage: multer.memoryStorage() });

// Helper functions
const toInt = (v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : null;
};
const toTrimOrNull = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
};
const toCSV = (v) => (Array.isArray(v) ? v.join(",") : toTrimOrNull(v));
const buildDOB = (y, m, d) => {
  if (!y || !m || !d) return null;
  const yy = String(y).padStart(4, "0");
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
};
const buildTOB = (h, m, s, ampm) => {
  if (!h && !m && !s) return null;
  const hh = String(h || "00").padStart(2, "0");
  const mm = String(m || "00").padStart(2, "0");
  const ss = String(s || "00").padStart(2, "0");
  const ap = (ampm || "AM").toUpperCase() === "PM" ? "PM" : "AM";
  return `${hh}:${mm}:${ss} ${ap}`;
};

router.post(
  "/complete",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "horoscopeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    let conn;
    try {
      const b = req.body;

      // // ----------------- HARD VALIDATION -----------------
      // if (!b.email) {
      //   return res.status(400).json({ message: "Email is required" });
      // }

      // if (!b.gender || !b.maritalStatus) {
      //   return res.status(400).json({ message: "Basic profile data missing" });
      // }

      // // Email must be verified
      // // if (
      // //   !b.otpVerified ||
      // //   (b.otpVerified !== "true" && b.otpVerified !== true)
      // // ) {
      // //   return res.status(403).json({ message: "Email not verified" });
      // // }

      // // Payment must be completed
      // if (b.paymentDone !== "1") {
      //   return res.status(403).json({ message: "Payment not completed" });
      // }

      // if (!b.plan) {
      //   return res.status(403).json({ message: "Plan not selected" });
      // }

      conn = await db.promise().getConnection();

      // ----------------- VERIFY PAYMENT FROM DB -----------------
  //     const [paymentRows] = await conn.query(
  //       `SELECT id FROM payments 
  //  WHERE email = ? 
  //  AND status = 'SUCCESS' 
  //  ORDER BY created_at DESC 
  //  LIMIT 1`,
  //       [b.email]
  //     );

  //     if (!paymentRows.length) {
  //       return res.status(403).json({
  //         message: "No successful payment found for this email",
  //       });
  //     }

      // ---------- GENERATE MATRI ID IF NOT PROVIDED ----------
      let matriId = toTrimOrNull(b.matriId);

      if (!matriId || matriId === "-" || matriId === "undefined") {
        // Generate MatriID based on occupation, maritalStatus, plan, gender
        const occupation = (b.occupation || "").toLowerCase().trim();
        const maritalStatus = (b.maritalStatus || "").toLowerCase().trim();
        // Admin panel users: paymentDone=1 indicates plan was selected (payment bypassed)
        // Allow plan to be set if paymentDone is "1" (admin bypass) or actual payment
        const plan = b.paymentDone === "1" 
          ? (b.plan || "basic").toLowerCase().trim() 
          : null;

        if (!plan) {
          return res
            .status(403)
            .json({ message: "Plan not selected. Please select a plan." });
        }

        const gender = (b.gender || "").toLowerCase().trim();

        let prefix = "SAM";

        // Priority 1: Doctor
        if (
          occupation.includes("doctor") ||
          occupation.includes("physician") ||
          occupation.includes("mbbs") ||
          occupation.includes("md")
        ) {
          prefix = "SAMD";
        }
        // Priority 2: Remarriage
        else if (
          maritalStatus === "remarriage" ||
          maritalStatus.includes("divorce") ||
          maritalStatus.includes("widow")
        ) {
          prefix = "SAMR";
        }
        // Priority 3: Plan + Gender
        else if (plan === "premium") {
          prefix = gender === "male" ? "SAMPM" : "SAMPF";
        }
        // Priority 4: Basic plan + Gender
        else {
          prefix = gender === "male" ? "SAMM" : "SAMF";
        }

        // Get next serial number for this prefix
        await conn.beginTransaction();

        try {
          const [rows] = await conn.query(
            "SELECT last_number FROM matriid_counter WHERE prefix = ? FOR UPDATE",
            [prefix]
          );

          let nextNumber;
          if (rows.length === 0) {
            await conn.query(
              "INSERT INTO matriid_counter (prefix, last_number) VALUES (?, 1)",
              [prefix]
            );
            nextNumber = 1;
          } else {
            nextNumber = rows[0].last_number + 1;
            await conn.query(
              "UPDATE matriid_counter SET last_number = ? WHERE prefix = ?",
              [nextNumber, prefix]
            );
          }

          matriId = prefix + nextNumber.toString().padStart(4, "0");
          await conn.commit();

          console.log(`✅ Generated MatriID: ${matriId}`);
        } catch (err) {
          await conn.rollback();
          throw err;
        }
      }

      // ---------- SAVE UPLOADED PHOTO TO /gallery ----------
      let savedPhotoFilename = null;

      if (req.files?.photo?.[0]) {
        const uploaded = req.files.photo[0];

        // extract extension (jpg/png/webp/jpeg/etc.)
        const ext = uploaded.originalname.split(".").pop().toLowerCase();

        // unique filename: SAM001_photo_timestamp.jpg (always use final MatriID)
        const fileName = `${matriId}_photo_${Date.now()}.${ext}`;

        // full path
        const filePath = path.join(galleryPath, fileName);

        // save file to /gallery
        fs.writeFileSync(filePath, uploaded.buffer);

        savedPhotoFilename = fileName; // save only filename in database
      }

      // ---------- SAVE HOROSCOPE FILE TO /kundli ----------
      let savedHoroscopeFilename = null;

      if (req.files && req.files.horoscopeFile && req.files.horoscopeFile[0]) {
        const uploaded = req.files.horoscopeFile[0];

        // Extract extension
        const ext = uploaded.originalname.split(".").pop().toLowerCase();

        // Unique filename
        const fileName = `${matriId}_horoscope_${Date.now()}.${ext}`;

        // Full path
        const filePath = path.join("kundli", fileName);

        // Save to kundli folder
        fs.writeFileSync(filePath, uploaded.buffer);

        savedHoroscopeFilename = fileName;
      }

      // ---- Map all fields ----
      const mapped = {
        MatriID: matriId,
        Prefix: "-",
        Name:
          toTrimOrNull([b.fname, b.mname, b.lname].filter(Boolean).join(" ")) ||
          "-",
        middlename: toTrimOrNull(b.mname) || "-",
        lastname: toTrimOrNull(b.lname) || "-",
        aboutus: toTrimOrNull(b.aboutus) || "-",
        Photo1: savedPhotoFilename || null,
        Photo1Approve: "Yes",
        crop: toTrimOrNull(b.crop) || "0",
        // ✅ Store images as BLOBs

        // ⚙️ Compatibility: set old field if DB still expects `horoscope`

        ConfirmEmail: toTrimOrNull(b.email) || "-",
        ConfirmPassword: toTrimOrNull(b.password) || "-",
        Countrycode: toTrimOrNull(b.countryCode) || "+91",
        Mobile: toTrimOrNull(b.mobile) || "-",
        Mobile2: toTrimOrNull(b.whatsapp) || "-",
        Phone: toTrimOrNull(b.altPhone) || "-",
        ParentEmail:
          toTrimOrNull(b.parentEmail) || toTrimOrNull(b.email) || "-",
        ParentPassword:
          toTrimOrNull(b.parentPassword) || toTrimOrNull(b.password) || "-",
        Profilecreatedby: toTrimOrNull(b.profileBy) || "Self",
        CreatorName: toTrimOrNull(b.fname) || "-",
        Relation: toTrimOrNull(b.relation) || "Self",
        Profile_new: "Self",

        Gender: toTrimOrNull(b.gender) || "-",
        DOB: buildDOB(b.dobYear, b.dobMonth, b.dobDay),
        DOBday: toTrimOrNull(b.dobDay),
        DOBmonth: toTrimOrNull(b.dobMonth),
        DOByear: toTrimOrNull(b.dobYear),
        TOB: buildTOB(b.birthHour, b.birthMinute, b.birthSecond, b.ampm),
        POB: toTrimOrNull(b.placeOfBirth),
        Maritalstatus: toCSV(b.maritalStatus) || "Unmarried",

        Religion: toTrimOrNull(b.religion),
        Caste: toTrimOrNull(b.caste),
        Subcaste: toTrimOrNull(b.subCaste),

        Moonsign: toTrimOrNull(b.moonSign) || "",
        Star: toTrimOrNull(b.star) || "",
        Gothram: toTrimOrNull(b.gothra) || "",
        Horosmatch: toTrimOrNull(b.horoscopeMatch) || "",
        Manglik: toTrimOrNull(b.manglik) || "",
        shani: toTrimOrNull(b.shani) || "",
        // shaniplace: toTrimOrNull(b.placeOfShani),
        shaniplace: b.shaniplace ? String(b.shaniplace).trim() : "",

        parigarasevai: toTrimOrNull(b.parigarasevai) || "",
        Sevai: toTrimOrNull(b.sevai) || "",
        Raghu: toTrimOrNull(b.raghu) || "",
        Keethu: toTrimOrNull(b.keethu) || "",
        Kuladeivam: toTrimOrNull(b.kuladeivam) || "",
        ThesaiIrupu: toTrimOrNull(b.thesaiirupu) || "",
        Horosother: savedHoroscopeFilename || null,

        Address: toTrimOrNull(b.address),
        City: toTrimOrNull(b.city),
        Dist: toTrimOrNull(b.Dist || b.district),
        State: toTrimOrNull(b.state),
        Country: toTrimOrNull(b.country),
        Phone: (b.altPhone || "").substring(0, 30),

        Pincode: b.pincode && b.pincode.length === 6 ? toInt(b.pincode) : null,
        Residencystatus: toTrimOrNull(b.residence),
        calling_time: toTrimOrNull(b.convenientTime),

        Education: toTrimOrNull(b.education),
        EducationDetails: toTrimOrNull(b.educationDetails),
        Occupation: toTrimOrNull(b.occupation),
        Employedin: toTrimOrNull(b.employedIn),
        Annualincome: toTrimOrNull(b.annualIncome),
        income_in: toTrimOrNull(b.incomeType),
        anyotherincome: toTrimOrNull(b.otherIncome),
        working_hours: toTrimOrNull(b.workingHours),
        company_name: toTrimOrNull(b.company_name),

        workinglocation: toTrimOrNull(b.workingLocation),

        HeightText: toTrimOrNull(b.heightText) || toTrimOrNull(b.HeightText),

        Weight: toTrimOrNull(b.weight),
        BloodGroup: toTrimOrNull(b.bloodGroup),
        Complexion: toTrimOrNull(b.complexion),
        Bodytype: toTrimOrNull(b.bodyType),
        Diet: toTrimOrNull(b.diet),
        Smoke: toTrimOrNull(b.smoke),
        Drink: toTrimOrNull(b.drink),
        spe_cases: toTrimOrNull(b.specialCases),
        spe_reason: toTrimOrNull(b.specialCaseReason),

        Hobbies: toTrimOrNull(b.hobbies),
        OtherHobbies: toTrimOrNull(b.otherHobbies),
        Interests: toTrimOrNull(b.interests),
        OtherInterests: toTrimOrNull(b.otherInterests),
        achievement: toTrimOrNull(b.achievement),

        // Rasi 12
        g1: toTrimOrNull(b.g1),
        g2: toTrimOrNull(b.g2),
        g3: toTrimOrNull(b.g3),
        g4: toTrimOrNull(b.g4),
        g5: toTrimOrNull(b.g5),
        g6: toTrimOrNull(b.g6),
        g7: toTrimOrNull(b.g7),
        g8: toTrimOrNull(b.g8),
        g9: toTrimOrNull(b.g9),
        g10: toTrimOrNull(b.g10),
        g11: toTrimOrNull(b.g11),
        g12: toTrimOrNull(b.g12),

        // Navamsam 12
        a1: toTrimOrNull(b.a1),
        a2: toTrimOrNull(b.a2),
        a3: toTrimOrNull(b.a3),
        a4: toTrimOrNull(b.a4),
        a5: toTrimOrNull(b.a5),
        a6: toTrimOrNull(b.a6),
        a7: toTrimOrNull(b.a7),
        a8: toTrimOrNull(b.a8),
        a9: toTrimOrNull(b.a9),
        a10: toTrimOrNull(b.a10),
        a11: toTrimOrNull(b.a11),
        a12: toTrimOrNull(b.a12),

        Familyvalues: toTrimOrNull(b.familyValues),
        FamilyType: toTrimOrNull(b.familyType),
        FamilyStatus: toTrimOrNull(b.familyStatus),
        mother_tounge: toTrimOrNull(b.motherTongue),

        noofbrothers: toTrimOrNull(b.noOfBrothers),
        nbm: toTrimOrNull(b.noOfBrothersMarried),
        noofsisters: toTrimOrNull(b.noOfSisters),
        nsm: toTrimOrNull(b.noOfSistersMarried),
        nb_unmarried: toTrimOrNull(b.noOfBrothersUnmarried),
        ns_unmarried: toTrimOrNull(b.noOfSistersUnmarried),

        Fathername: toTrimOrNull(b.fatherName),
        Fathersoccupation: toTrimOrNull(b.fatherOccupation),
        Mothersname: toTrimOrNull(b.motherName),
        Mothersoccupation: toTrimOrNull(b.motherOccupation),

        family_wealth: toTrimOrNull(b.familyWealth),

        FamilyDetails: toTrimOrNull(b.familyDescription),

        // medicalhistory: toTrimOrNull(b.medicalHistory),
        medicalhistory:
          toTrimOrNull(b.medicalHistory) ||
          toTrimOrNull(b.familyMedicalHistory),

        familymedicalhistory: toTrimOrNull(b.familyMedicalHistory),
        passport: toTrimOrNull(b.passport),

        // PE_Maritalstatus: toTrimOrNull(b.partner_maritalStatus),
        Looking: toTrimOrNull(b.partner_maritalStatus),

        PE_FromAge: toTrimOrNull(b.partner_ageFrom),
        PE_ToAge: toTrimOrNull(b.partner_ageTo),
        PE_from_Height: toTrimOrNull(b.partner_heightFrom),
        PE_to_Height: toTrimOrNull(b.partner_heightTo),
        PE_Religion: toTrimOrNull(b.partner_religion),
        PE_Caste: toTrimOrNull(b.partner_caste),
        PE_Complexion: toTrimOrNull(b.partner_complexion),
        PE_Residentstatus: toTrimOrNull(b.partner_residencyStatus),

        PE_Countrylivingin: toTrimOrNull(b.partner_countryLivingIn),

        // State, city
        PE_State: toTrimOrNull(b.partner_state),
        PE_City: toTrimOrNull(b.partner_city),

        // EDUCATION / OCCUPATION
        PE_Education: toTrimOrNull(b.partner_education),
        PE_Occupation: toTrimOrNull(b.partner_occupation),

        // FIX – Mother tongue
        PE_MotherTongue: toTrimOrNull(b.partner_motherTongue),

        PartnerExpectations: toTrimOrNull(b.partnerExpectations),

        // Plan: Store as varchar (basic/premium) - admin can set directly
        Plan: b.paymentDone === "1" ? toTrimOrNull(b.plan) || "basic" : null,

        Termsofservice: toTrimOrNull(b.terms) || "Not Accepted",
        verifymobile: b.otpVerified ? 1 : 0,

        Regdate: new Date(),
        IP: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
        Status: "Pending",

        // Required NOT NULL fields with defaults
        horos_status: toTrimOrNull(b.horos_status) || "No",
        online_status: "offline",
        visibility: toTrimOrNull(b.visibility) || "visible",
        follow: "",
      };

      // Remove undefined/null fields
      const keys = Object.keys(mapped).filter(
        (k) => mapped[k] !== undefined && mapped[k] !== null
      );
      const values = keys.map((k) => mapped[k]);

      const sql = `INSERT INTO register (${keys.join(",")}) VALUES (${keys
        .map(() => "?")
        .join(",")})`;

      console.log("🟢 Inserting record with", keys.length, "columns");

      await conn.query(sql, values);

      res.json({
        success: true,
        message: "Registration complete (photo + optional horoscope saved)",
        matriId: matriId,
      });
    } catch (err) {
      if (conn) {
        try {
          // Check if transaction was active before rolling back
          await conn.rollback(); 
        } catch (rollbackErr) {
          // ignore rollback error if no transaction was active
        }
      }
      console.error("❌ Registration complete error:", err);
      res.status(500).json({
        success: false,
        message: "Error completing registration",
        sql: err?.sqlMessage || err?.message,
      });
    } finally {
      if (conn) conn.release();
    }
  }
);

export default router;
