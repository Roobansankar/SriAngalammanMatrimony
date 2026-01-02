import express from "express";
import ccav from "../../utils/ccavenue.js";

const router = express.Router();

router.post("/ccavenue-init", async (req, res) => {
  try {
    const { plan, email, occupation, maritalStatus, gender } = req.body;

    const amount = plan === "premium" ? 4000 : 1500;
    const orderId = "ORD" + Date.now();

    const orderParams = {
      order_id: orderId,
      currency: "INR",
      amount: amount.toFixed(2),
      redirect_url: `${process.env.BASE_URL}/api/payment/ccavenue-response`,
      cancel_url: `${process.env.BASE_URL}/api/payment/ccavenue-response`,
      billing_email: email,
      merchant_param1: occupation,
      merchant_param2: maritalStatus,
      merchant_param3: plan,
      merchant_param4: gender,
    };


    const encRequest = ccav.getEncryptedOrder(orderParams);

    res.json({
      encRequest,
      accessCode: process.env.CC_ACCESS_CODE,
      ccUrl:
        "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
    });
  } catch (err) {
    console.error("CCAvenue init error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
