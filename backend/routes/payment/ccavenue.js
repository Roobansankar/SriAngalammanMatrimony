import express from "express";
import crypto from "crypto";
import qs from "querystring";

const router = express.Router();

/* ================= CCAvenue CONFIG ================= */
const MERCHANT_ID = "4417415";
const ACCESS_CODE = "AVPV86ML93BN46VPNB";
const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";

const CCAVENUE_URL =
  "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

/* ================= ENCRYPT (NODE 22 SAFE) ================= */
function encrypt(plainText) {
  const md5 = crypto.createHash("md5").update(WORKING_KEY).digest(); // 16 bytes
  const iv = Buffer.alloc(16, 0); // 🔥 IMPORTANT: ZERO IV

  const cipher = crypto.createCipheriv("aes-128-cbc", md5, iv);
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/* ================= DECRYPT (NODE 22 SAFE) ================= */
function decrypt(encText) {
  const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", md5, iv);
  decipher.setAutoPadding(true);

  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/* ================= INITIATE PAYMENT ================= */
// router.post("/ccavenue-init", (req, res) => {
//   try {
//     const { plan, email } = req.body || {};

//     if (!plan || !email) {
//       return res.status(400).json({ message: "Missing plan or email" });
//     }

//     const amount = plan === "premium" ? "10.00" : "5.00";
//     const orderId = "ORD" + Date.now();

//     const payload = {
//       merchant_id: MERCHANT_ID,
//       order_id: orderId,
//       currency: "INR",
//       amount,
//       redirect_url:
//         "https://www.sriangalammanmatrimony.com/api/payment/ccavenue-success",
//       cancel_url:
//         "https://www.sriangalammanmatrimony.com/api/payment/ccavenue-cancel",
//       language: "EN",
//       billing_email: email,
//     };

//     const encRequest = encrypt(qs.stringify(payload));

//     res.json({
//       ccUrl: CCAVENUE_URL,
//       encRequest,
//       accessCode: ACCESS_CODE,
//     });
//   } catch (err) {
//     console.error("❌ CC INIT ERROR:", err);
//     res.status(500).json({ message: "Payment init failed" });
//   }
// });

router.post("/ccavenue-init", (req, res) => {
  console.log("🔥 /ccavenue-init HIT");
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  try {
    const { plan, email } = req.body || {};

    if (!plan || !email) {
      console.log("❌ Missing plan or email");
      return res.status(400).json({ message: "Missing plan or email" });
    }

    const amount = plan === "premium" ? "10.00" : "5.00";
    const orderId = "ORD" + Date.now();

    const payload = {
      merchant_id: "4417415",
      order_id: orderId,
      currency: "INR",
      amount,
      redirect_url:
        "https://www.sriangalammanmatrimony.com/api/payment/ccavenue-success",
      cancel_url:
        "https://www.sriangalammanmatrimony.com/api/payment/ccavenue-cancel",
      language: "EN",
      billing_email: email,
    };

    console.log("PAYLOAD:", payload);

    // 🔥 COMMENT ENCRYPTION TEMPORARILY
    // const encRequest = encrypt(qs.stringify(payload));

    return res.json({
      ok: true,
      message: "INIT ROUTE WORKING",
      payload,
    });
  } catch (err) {
    console.error("❌ CC INIT CRASH:", err);
    return res.status(500).json({ message: err.message });
  }
});

/* ================= SUCCESS CALLBACK ================= */
router.post(
  "/ccavenue-success",
  express.urlencoded({ extended: false }),
  (req, res) => {
    try {
      const decrypted = decrypt(req.body.encResp);
      const data = qs.parse(decrypted);

      console.log("✅ CCAvenue Response:", data);

      if (data.order_status === "Success") {
        return res.redirect(
          "https://www.sriangalammanmatrimony.com/payment-success?order_id=" +
            data.order_id,
        );
      }

      res.redirect("https://www.sriangalammanmatrimony.com/payment-failed");
    } catch (err) {
      console.error("❌ CC SUCCESS ERROR:", err);
      res.redirect("https://www.sriangalammanmatrimony.com/payment-failed");
    }
  },
);

/* ================= CANCEL CALLBACK ================= */
router.post("/ccavenue-cancel", (req, res) => {
  res.redirect("https://www.sriangalammanmatrimony.com/payment-failed");
});

export default router;
