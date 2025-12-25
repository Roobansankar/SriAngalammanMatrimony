import express from "express";
import fs from "fs";
import path from "path";
import db from "../config/db.js";
import galleryUpload from "../middleware/galleryUpload.js";

const router = express.Router();
const galleryPath = path.join(process.cwd(), "gallery");

if (!fs.existsSync(galleryPath)) {
  fs.mkdirSync(galleryPath, { recursive: true });
}

/* UPLOAD */
router.post(
  "/upload",
  galleryUpload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  (req, res) => {
    const { matriId } = req.body;
    if (!matriId) return res.status(400).json({ success: false });

    const saveData = {};

    Object.keys(req.files || {}).forEach((field) => {
      const file = req.files[field][0];
      const ext = path.extname(file.originalname);
      const fileName = `${matriId}_${field}_${Date.now()}${ext}`;
      fs.writeFileSync(path.join(galleryPath, fileName), file.buffer);
      saveData[field] = fileName;
    });

    if (!Object.keys(saveData).length) {
      return res.status(400).json({ success: false, message: "No files" });
    }

    const setSQL = Object.keys(saveData)
      .map((k) => `${k}=?`)
      .join(",");

    db.query(
      `UPDATE register SET ${setSQL} WHERE MatriID=?`,
      [...Object.values(saveData), matriId],
      () => res.json({ success: true })
    );
  }
);

/* DELETE */
router.post("/delete", (req, res) => {
  const { matriId, slot } = req.body;

  db.query(
    `SELECT ${slot} FROM register WHERE MatriID=?`,
    [matriId],
    (err, rows) => {
      if (rows?.[0]?.[slot]) {
        const filePath = path.join(galleryPath, rows[0][slot]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      db.query(
        `UPDATE register SET ${slot}=NULL WHERE MatriID=?`,
        [matriId],
        () => res.json({ success: true })
      );
    }
  );
});

export default router;
