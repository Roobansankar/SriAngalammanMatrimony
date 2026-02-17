
import express from "express";
import crypto from "crypto";
import qs from "querystring";
import db from "../../config/db.js";

const router = express.Router();

/* =========================================================
   🔐 LIVE CREDENTIALS (HARDCODE — CCAvenue instruction)
========================================================= */

const MERCHANT_ID = "4417415";
const ACCESS_CODE = "AVPV86ML93BN46VPNB";
const WORKING_KEY = "8D5201FF07BB00FF435BE2C64E38CF32";

/* ⚠️ MUST match CCAvenue registered domain */
const BASE_URL = "https://sriangalammanmatrimony.com";

/* LIVE PAYMENT URL */
const CCAVENUE_URL =
  "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

/* =========================================================
   🔐 ENCRYPTION — OFFICIAL CCAvenue AES-128 LOGIC
========================================================= */

function encrypt(plainText) {
  /* Key = MD5 hash (16 bytes) */
  const key = crypto.createHash("md5").update(WORKING_KEY).digest();

  /* Kit IV sequence */
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");

  encrypted += cipher.final("hex");

  return encrypted;
}




/* =========================================================
   🔓 DECRYPT
========================================================= */

function decrypt(encText) {
  const key = crypto.createHash("md5").update(WORKING_KEY).digest();

  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

  let decrypted = decipher.update(encText, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}


/* =========================================================
   💳 INIT PAYMENT
========================================================= */

router.post("/ccavenue-init", async (req, res) => {
  try {
    const { plan, email } = req.body;

    if (!plan || !email) {
      return res.status(400).json({
        message: "Missing plan or email",
      });
    }

    /* Generate Order */
    const orderId = "ORD" + Date.now();
    const amount = plan === "premium" ? "2.00" : "1.00";

    /* Save Pending Order */
    await db.promise().query(
      `INSERT INTO payments
       (order_id,email,plan,amount,status)
       VALUES (?,?,?,?,?)`,
      [orderId, email, plan, amount, "Pending"],
    );

    console.log("DB Inserted ✅");

    /* =====================================================
       ⚠️ RAW PAYLOAD STRING (NO qs.stringify)
    ===================================================== */

    const payload =
      "merchant_id=" +
      MERCHANT_ID +
      "&order_id=" +
      orderId +
      "&currency=INR" +
      "&amount=" +
      amount +
      "&redirect_url=" +
      BASE_URL +
      "/api/payment/ccavenue-success" +
      "&cancel_url=" +
      BASE_URL +
      "/api/payment/ccavenue-cancel" +
      "&language=EN" +
      "&billing_email=" +
      email;

    console.log("Payload:", payload);

    /* Encrypt */
    const encRequest = encrypt(payload);

    console.log("ENC REQUEST:", encRequest);

    /* Send to frontend */
    res.json({
      ccUrl: CCAVENUE_URL,
      encRequest,
      accessCode: ACCESS_CODE,
    });
  } catch (err) {
    console.error("Payment Init Error:", err);

    res.status(500).json({
      message: "Payment init failed",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ SUCCESS CALLBACK
========================================================= */

router.post(
  "/ccavenue-success",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const decrypted = decrypt(req.body.encResp);

      const data = qs.parse(decrypted);

      console.log("CCA Response:", data);

      const orderId = data.order_id;

      if (data.order_status === "Success") {
        await db
          .promise()
          .query("UPDATE payments SET status='Success' WHERE order_id=?", [
            orderId,
          ]);

        return res.redirect(`${BASE_URL}/register/step/6?payment=success`);
      }

      await db
        .promise()
        .query("UPDATE payments SET status='Failed' WHERE order_id=?", [
          orderId,
        ]);

      res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
    } catch (err) {
      console.error("Success Callback Error:", err);

      res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
    }
  },
);



/* =========================================================
   🔎 VERIFY PAYMENT
========================================================= */

router.get("/verify", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.json({ valid: false });
    }

    const [rows] = await db.promise().query(
      `SELECT *
       FROM payments
       WHERE email = ?
       AND status = 'Success'
       ORDER BY id DESC
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.json({ valid: false });
    }

    res.json({
      valid: true,
      plan: rows[0].plan,
    });

  } catch (err) {
    console.error("Verify Error:", err);

    res.status(500).json({
      valid: false,
    });
  }
});

/* =========================================================
   📊 ADMIN — PAYMENT LIST WITH MATRIID
========================================================= */

router.get("/admin/payments", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        p.order_id,
        p.email,
        p.plan,
        p.amount,
        p.status,
        p.created_at,
        r.MatriID,
        r.Name
      FROM payments p
      LEFT JOIN register r
        ON p.email = r.ConfirmEmail
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});




/* =========================================================
   ❌ CANCEL CALLBACK
========================================================= */


router.all("/ccavenue-cancel", (req, res) => {
  res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
});

export default router;
