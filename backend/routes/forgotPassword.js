import express from "express";
import db from "../config/db.js";
import nodemailer from "nodemailer";

const router = express.Router();

// 🔹 Reuse the OTP store like in register.js
const otpStore = new Map();
const setOtp = (email, otp) =>
  otpStore.set(email, {
    otp: String(otp),
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
const getOtp = (email) => {
  const rec = otpStore.get(email);
  if (!rec) return null;
  if (Date.now() > rec.expiresAt) {
    otpStore.delete(email);
    return null;
  }
  return rec.otp;
};
const deleteOtp = (email) => otpStore.delete(email);

// ---------- SMTP ----------
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});



// 1️⃣ SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in database
    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT MatriID FROM register WHERE ConfirmEmail = ?",
      [email]
    );

    if (!rows.length) {
      return res.json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    setOtp(email, otp);

    await transporter.sendMail({
      from: `"Sriangalamman Matrimony" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset OTP - Sriangalamman Matrimony",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #e11d48;">Sriangalamman Matrimony</h2>
          <p>Your password reset verification code is:</p>

          <div style="
            background: #fef2f2;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
          ">
            <span style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #e11d48;
            ">${otp}</span>
          </div>

          <p style="color: #666; font-size: 14px;">
            This OTP expires in 5 minutes.  
            <br>
            Do not share it with anyone for your security.
          </p>
        </div>
      `,
      replyTo: process.env.SMTP_USER,
    });

    res.json({ success: true, message: "OTP sent to your email" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "OTP sending failed",
    });
  }
});


// 2️⃣ VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const stored = getOtp(email);
  if (!stored)
    return res.json({ success: false, message: "OTP expired or not found" });

  if (stored !== String(otp))
    return res.json({ success: false, message: "Invalid OTP" });

  deleteOtp(email);
  res.json({ success: true, message: "OTP verified" });
});

// 3️⃣ RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const conn = db.promise();

    await conn.query(
      "UPDATE register SET ConfirmPassword = ?, ParentPassword = ? WHERE ConfirmEmail = ?",
      [newPassword, newPassword, email]
    );

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
});

export default router;
