import express from "express";
import ccav from "../../utils/ccavenue.js";
import db from "../../config/db.js";


const router = express.Router();

router.post("/ccavenue-response", async (req, res) => {
  let conn;
  try {
    const { encResp } = req.body;
    const response = ccav.redirectResponseToJson(encResp);

    if (response.order_status !== "Success") {
      return res.redirect(`${process.env.FRONTEND_URL}/step6?payment=failed`);
    }

    conn = await db.promise().getConnection();

    await conn.query(
      `INSERT INTO payments 
       (email, plan, order_id, tracking_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        response.billing_email,
        response.merchant_param3, // plan
        response.order_id,
        response.tracking_id,
        "paid",
      ]
    );

    // 🔑 Redirect to STEP 7 (registration submit)
    return res.redirect(
      `${process.env.FRONTEND_URL}/step7?payment=success&plan=${response.merchant_param3}`
    );
  } catch (err) {
    console.error("CCAvenue response error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/step6?payment=error`);
  } finally {
    if (conn) conn.release();
  }
});


export default router;
