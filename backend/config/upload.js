// server/config/upload.js
import fs from "fs";
import path from "path";
import multer from "multer";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

export const upload = multer({ storage });
export const uploadPublicPath = "/uploads";
export const uploadDir = UPLOAD_DIR;
