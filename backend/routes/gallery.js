// import express from "express";
// import fs from "fs";
// import path from "path";
// import db from "../config/db.js";
// import galleryUpload from "../middleware/galleryUpload.js";

// const router = express.Router();
// const galleryPath = path.join(process.cwd(), "gallery");

// if (!fs.existsSync(galleryPath)) {
//   fs.mkdirSync(galleryPath, { recursive: true });
// }

// /* UPLOAD */
// router.post(
//   "/upload",
//   galleryUpload.fields([
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//   ]),
//   (req, res) => {
//     const { matriId } = req.body;
//     if (!matriId) return res.status(400).json({ success: false });

//     const saveData = {};

//     Object.keys(req.files || {}).forEach((field) => {
//       const file = req.files[field][0];
//       const ext = path.extname(file.originalname);
//       const fileName = `${matriId}_${field}_${Date.now()}${ext}`;
//       fs.writeFileSync(path.join(galleryPath, fileName), file.buffer);
//       saveData[field] = fileName;
//     });

//     if (!Object.keys(saveData).length) {
//       return res.status(400).json({ success: false, message: "No files" });
//     }

//     const setSQL = Object.keys(saveData)
//       .map((k) => `${k}=?`)
//       .join(",");

//     db.query(
//       `UPDATE register SET ${setSQL} WHERE MatriID=?`,
//       [...Object.values(saveData), matriId],
//       () => res.json({ success: true })
//     );
//   }
// );

// /* DELETE */
// router.post("/delete", (req, res) => {
//   const { matriId, slot } = req.body;

//   db.query(
//     `SELECT ${slot} FROM register WHERE MatriID=?`,
//     [matriId],
//     (err, rows) => {
//       if (rows?.[0]?.[slot]) {
//         const filePath = path.join(galleryPath, rows[0][slot]);
//         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//       }

//       db.query(
//         `UPDATE register SET ${slot}=NULL WHERE MatriID=?`,
//         [matriId],
//         () => res.json({ success: true })
//       );
//     }
//   );
// });

// export default router;

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";
import galleryUpload from "../middleware/galleryUpload.js";

const router = express.Router();

/* -----------------------------------------
   FIXED PATH (Production Safe)
------------------------------------------ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always points to project-root/gallery
const galleryPath = path.join(__dirname, "..", "gallery");

console.log("📁 Gallery absolute path:", galleryPath);

// Create gallery folder if missing
if (!fs.existsSync(galleryPath)) {
  fs.mkdirSync(galleryPath, { recursive: true });
  console.log("✅ Gallery folder created");
}

/* -----------------------------------------
   UPLOAD IMAGE
------------------------------------------ */

router.post(
  "/upload",
  galleryUpload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { matriId } = req.body;

      if (!matriId) {
        return res
          .status(400)
          .json({ success: false, message: "MatriID missing" });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const saveData = {};

      for (const field of Object.keys(req.files)) {
        const file = req.files[field][0];
        const ext = path.extname(file.originalname) || ".webp";
        const fileName = `${matriId}_${field}_${Date.now()}${ext}`;

        const fullPath = path.join(galleryPath, fileName);

        console.log("📝 Saving file to:", fullPath);

        fs.writeFileSync(fullPath, file.buffer);

        saveData[field] = fileName;
      }

      const setSQL = Object.keys(saveData)
        .map((k) => `${k}=?`)
        .join(",");

      db.query(
        `UPDATE register SET ${setSQL} WHERE MatriID=?`,
        [...Object.values(saveData), matriId],
        (err) => {
          if (err) {
            console.error("❌ DB Update Error:", err);
            return res.status(500).json({ success: false });
          }

          res.json({ success: true });
        },
      );
    } catch (err) {
      console.error("❌ Upload Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

/* -----------------------------------------
   DELETE IMAGE
------------------------------------------ */

router.post("/delete", (req, res) => {
  const { matriId, slot } = req.body;

  if (!matriId || !slot) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  db.query(
    `SELECT ${slot} FROM register WHERE MatriID=?`,
    [matriId],
    (err, rows) => {
      if (err) {
        console.error("❌ DB Select Error:", err);
        return res.status(500).json({ success: false });
      }

      const fileName = rows?.[0]?.[slot];

      if (fileName) {
        const filePath = path.join(galleryPath, fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🗑️ Deleted file:", filePath);
        }
      }

      db.query(
        `UPDATE register SET ${slot}=NULL WHERE MatriID=?`,
        [matriId],
        (err2) => {
          if (err2) {
            console.error("❌ DB Update Error:", err2);
            return res.status(500).json({ success: false });
          }

          res.json({ success: true });
        },
      );
    },
  );
});

export default router;