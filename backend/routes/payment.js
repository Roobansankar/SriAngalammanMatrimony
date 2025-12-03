import crypto from "crypto";
import express from "express";
import Razorpay from "razorpay";
import db from "../config/db.js";

const router = express.Router();

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function generateMatriID(conn, { occupation, maritalStatus, plan, gender }) {
  let prefix = "SAM";
  
  // Normalize inputs - handle array for maritalStatus
  const occLower = (occupation || "").toLowerCase().trim();
  // maritalStatus can be an array or string
  const maritalLower = Array.isArray(maritalStatus) 
    ? maritalStatus.join(",").toLowerCase().trim()
    : (maritalStatus || "").toLowerCase().trim();
  const planLower = (plan || "basic").toLowerCase().trim();
  const genderLower = (gender || "").toLowerCase().trim();
  
  // Priority 1: Doctor
  if (occLower.includes("doctor") || occLower.includes("physician") || occLower.includes("mbbs") || occLower.includes("md")) {
    prefix = "SAMD";
  }
  // Priority 2: Remarriage
  else if (maritalLower.includes("remarriage") || maritalLower.includes("divorce") || maritalLower.includes("widow")) {
    prefix = "SAMR";
  }
  // Priority 3: Plan + Gender
  else if (planLower === "premium") {
    prefix = genderLower === "male" ? "SAMPM" : "SAMPF";
  }
  // Priority 4: Basic plan
  else {
    prefix = genderLower === "male" ? "SAMM" : "SAMF";
  }
  
  // Get next serial number for this prefix (thread-safe with FOR UPDATE)
  try {
    // Check if counter exists for this prefix
    const [rows] = await conn.query(
      "SELECT last_number FROM matriid_counter WHERE prefix = ? FOR UPDATE",
      [prefix]
    );
    
    let nextNumber;
    if (rows.length === 0) {
      // Create new counter for this prefix starting at 1
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
    
    // Format: prefix + 4-digit padded number (e.g., SAMD0125)
    const matriId = prefix + nextNumber.toString().padStart(4, "0");
    
    return matriId;
  } catch (err) {
    console.error("Error generating MatriID:", err);
    throw err;
  }
}

// 1️⃣ Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { plan, email } = req.body;
    // Use ₹100 for testing (simulation works better with higher amounts)
    // Change back to ₹1/₹2 for production
    const amount = plan === "premium" ? 100 : 50; // INR (test amounts)

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: amount,
      currency: order.currency,
      email,
      plan,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// 2️⃣ Verify Payment, Generate MatriID & Save in DB
router.post("/verify", async (req, res) => {
  const conn = db.promise();
  
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      plan,
      // User details needed for MatriID generation
      occupation,
      maritalStatus,
      gender,
    } = req.body;

    // Verify signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Start transaction for atomic MatriID generation
    await conn.beginTransaction();

    // ✅ Generate MatriID after successful payment
    const matriId = await generateMatriID(conn, {
      occupation,
      maritalStatus,
      plan,
      gender,
    });

    // ✅ Store payment in DB
    const sql = `INSERT INTO payments (email, plan, razorpay_order_id, razorpay_payment_id, razorpay_signature, matri_id, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

    await conn.query(sql, [
      email,
      plan,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      matriId,
      "paid",
    ]);

    await conn.commit();

    console.log(`✅ Payment verified & MatriID generated: ${matriId}`);

    res.json({ 
      success: true, 
      message: "Payment verified and saved",
      matriId: matriId,
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    console.error("Payment verify error:", err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
});

export default router;
