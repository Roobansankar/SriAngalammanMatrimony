import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";

const router = express.Router();

const merchantId = process.env.CC_MERCHANT_ID;
const accessCode = process.env.CC_ACCESS_CODE;
const workingKey = process.env.CC_WORKING_KEY;

// 🔐 Encrypt
function encrypt(plainText) {
  const key = Buffer.from(process.env.CC_WORKING_KEY, "hex");
  const iv = Buffer.alloc(16, 0); // CCAvenue uses zero IV

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encText) {
  const key = Buffer.from(process.env.CC_WORKING_KEY, "hex");
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
console.log(
  "CC KEY length:",
  Buffer.from(process.env.CC_WORKING_KEY, "hex").length
);


// 1️⃣ Initiate Payment
router.post("/initiate", (req, res) => {
  const { plan, email } = req.body;

  const amount = plan === "premium" ? "4000" : "2000";
  const orderId = "ORD_" + Date.now();

  const data = `merchant_id=${merchantId}&order_id=${orderId}&currency=INR&amount=${amount}&redirect_url=${process.env.BASE_URL}/api/ccavenue/response&cancel_url=${process.env.BASE_URL}/api/ccavenue/response&billing_email=${email}`;

  const encRequest = encrypt(data);

  res.send(`
    <html>
      <body onload="document.forms[0].submit()">
        <form method="POST" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
          <input type="hidden" name="encRequest" value="${encRequest}" />
          <input type="hidden" name="access_code" value="${accessCode}" />
        </form>
      </body>
    </html>
  `);
});

// 2️⃣ Payment Response
router.post(
  "/response",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const encResp = req.body.encResp;
    const decrypted = decrypt(encResp);

    // Convert to object
    const response = {};
    decrypted.split("&").forEach((item) => {
      const [key, value] = item.split("=");
      response[key] = value;
    });

    if (response.order_status === "Success") {
      // ✅ SAVE PAYMENT IN DB HERE
      // ✅ GENERATE MatriID HERE

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-success`
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
      );
    }
  }
);

export default router;
