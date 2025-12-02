import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import db from "../config/db.js";

const router = express.Router();

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1️⃣ Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { plan, email } = req.body;
    const amount = plan === "premium" ? 2 : 1; // INR

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

// 2️⃣ Verify Payment & Save in DB
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      plan,
    } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // ✅ Store in DB
    const sql = `INSERT INTO payments (email, plan, razorpay_order_id, razorpay_payment_id, razorpay_signature, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    await db
      .promise()
      .query(sql, [
        email,
        plan,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        "paid",
      ]);

    res.json({ success: true, message: "Payment verified and saved" });
  } catch (err) {
    console.error("Payment verify error:", err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
});

export default router;
