import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import db from "../config/db.js";

const router = express.Router();

// Folder path
const certificatePath = path.join(process.cwd(), "community_certificates");

if (!fs.existsSync(certificatePath)) {
  fs.mkdirSync(certificatePath, { recursive: true });
}

// Multer (Only Images)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  },
});

/* =========================================
   UPLOAD COMMUNITY CERTIFICATE
========================================= */
router.post("/upload", upload.single("certificate"), async (req, res) => {
  try {
    const { matriId } = req.body;

    if (!matriId || !req.file) {
      return res.status(400).json({
        success: false,
        message: "MatriID and image required",
      });
    }

    const conn = db.promise();

    // 🔎 1️⃣ Check if already image exists
    const [rows] = await conn.query(
      "SELECT certificate_image FROM community_certificate WHERE MatriID = ?",
      [matriId],
    );

    // 🗑 2️⃣ If exists → delete old file
    if (rows.length > 0 && rows[0].certificate_image) {
      const oldFilePath = path.join(certificatePath, rows[0].certificate_image);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // 💾 3️⃣ Save new file
    const ext = req.file.originalname.split(".").pop();
    const fileName = `${matriId}_certificate_${Date.now()}.${ext}`;
    const filePath = path.join(certificatePath, fileName);

    fs.writeFileSync(filePath, req.file.buffer);

    // 📝 4️⃣ Update or Insert
    if (rows.length > 0) {
      await conn.query(
        "UPDATE community_certificate SET certificate_image = ?, uploaded_at = NOW() WHERE MatriID = ?",
        [fileName, matriId],
      );
    } else {
      await conn.query(
        "INSERT INTO community_certificate (MatriID, certificate_image) VALUES (?, ?)",
        [matriId, fileName],
      );
    }

    res.json({
      success: true,
      message: "Community Certificate updated successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

/* =========================================
   GET COMMUNITY CERTIFICATE
========================================= */
router.get("/:matriId", async (req, res) => {
  try {
    const { matriId } = req.params;

    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT certificate_image FROM community_certificate WHERE MatriID = ?",
      [matriId],
    );

    if (rows.length === 0) {
      return res.json({ success: true, image: null });
    }

    res.json({
      success: true,
      image: rows[0].certificate_image,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
