// import express from "express";
// import crypto from "crypto";
// import qs from "querystring";
// import db from "../../config/db.js";

// const router = express.Router();

// /* =========================================================
//    🔐 LIVE CREDENTIALS (HARDCODE — CCAvenue instruction)
// ========================================================= */

// const MERCHANT_ID = "4417415";
// const ACCESS_CODE = "AVPV86ML93BN46VPNB";
// const WORKING_KEY = "8D5201FF07BB00FF435BE2C64E38CF32";

// /* ⚠️ MUST match CCAvenue registered domain */
// const BASE_URL = "https://sriangalammanmatrimony.com";

// /* LIVE PAYMENT URL */
// const CCAVENUE_URL =
//   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// /* =========================================================
//    🔐 ENCRYPTION — OFFICIAL CCAvenue AES-128 LOGIC
// ========================================================= */

// function encrypt(plainText) {
//   /* Key = MD5 hash (16 bytes) */
//   const key = crypto.createHash("md5").update(WORKING_KEY).digest();

//   /* Kit IV sequence */
//   const iv = Buffer.from([
//     0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//     0x0c, 0x0d, 0x0e, 0x0f,
//   ]);

//   const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

//   let encrypted = cipher.update(plainText, "utf8", "hex");

//   encrypted += cipher.final("hex");

//   return encrypted;
// }

// /* =========================================================
//    🔓 DECRYPT
// ========================================================= */

// function decrypt(encText) {
//   const key = crypto.createHash("md5").update(WORKING_KEY).digest();

//   const iv = Buffer.from([
//     0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//     0x0c, 0x0d, 0x0e, 0x0f,
//   ]);

//   const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

//   let decrypted = decipher.update(encText, "hex", "utf8");

//   decrypted += decipher.final("utf8");

//   return decrypted;
// }

// /* =========================================================
//    💳 INIT PAYMENT
// ========================================================= */

// router.post("/ccavenue-init", async (req, res) => {
//   try {
//     const { plan, email } = req.body;

//     if (!plan || !email) {
//       return res.status(400).json({
//         message: "Missing plan or email",
//       });
//     }

//     /* ================= CHECK IF PAYMENT ALREADY SUCCESS ================= */

//     const [existing] = await db.promise().query(
//       `SELECT * FROM payments
//        WHERE email=? AND status='Success'
//        LIMIT 1`,
//       [email],
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({
//         message: "Payment already completed",
//       });
//     }

//     /* ================= CHECK IF PENDING EXISTS ================= */

//     const [pending] = await db.promise().query(
//       `SELECT * FROM payments
//       WHERE email=?
// AND status='Pending'
// AND created_at > NOW() - INTERVAL 30 MINUTE
//        LIMIT 1`,
//       [email],
//     );

//    if (pending.length > 0) {
//      /* Reuse same order instead of blocking */
//      const orderId = pending[0].order_id;
//      const amount = pending[0].amount;

//      const payload =
//        "merchant_id=" +
//        MERCHANT_ID +
//        "&order_id=" +
//        orderId +
//        "&currency=INR" +
//        "&amount=" +
//        amount +
//        "&redirect_url=" +
//        BASE_URL +
//        "/api/payment/ccavenue-success" +
//        "&cancel_url=" +
//        BASE_URL +
//        "/api/payment/ccavenue-cancel" +
//        "&language=EN" +
//        "&billing_email=" +
//        email;

//      const encRequest = encrypt(payload);

//      return res.json({
//        ccUrl: CCAVENUE_URL,
//        encRequest,
//        accessCode: ACCESS_CODE,
//      });
//    }
//     /* ================= CREATE NEW ORDER ================= */

//     const orderId = "ORD" + Date.now();
//     const amount = plan === "premium" ? "2.00" : "1.00";

//     await db.promise().query(
//       `INSERT INTO payments
//        (order_id,email,plan,amount,status)
//        VALUES (?,?,?,?,?)`,
//       [orderId, email, plan, amount, "Pending"],
//     );

//     const payload =
//       "merchant_id=" +
//       MERCHANT_ID +
//       "&order_id=" +
//       orderId +
//       "&currency=INR" +
//       "&amount=" +
//       amount +
//       "&redirect_url=" +
//       BASE_URL +
//       "/api/payment/ccavenue-success" +
//       "&cancel_url=" +
//       BASE_URL +
//       "/api/payment/ccavenue-cancel" +
//       "&language=EN" +
//       "&billing_email=" +
//       email;

//     const encRequest = encrypt(payload);

//     res.json({
//       ccUrl: CCAVENUE_URL,
//       encRequest,
//       accessCode: ACCESS_CODE,
//     });
//   } catch (err) {
//     console.error("Payment Init Error:", err);

//     res.status(500).json({
//       message: "Payment init failed",
//       error: err.message,
//     });
//   }
// });

// /* =========================================================
//    ✅ SUCCESS CALLBACK
// ========================================================= */

// router.all(
//   "/ccavenue-success",
//   express.urlencoded({ extended: false }),
//   async (req, res) => {
//     try {
//       const encResp =
//         req.body?.encResp ||
//         req.query?.encResp ||
//         req.body?.encresp ||
//         req.query?.encresp;

//       if (!encResp) {
//         return res.send(`
//           <html>
//             <script>
//               window.location.href = "${BASE_URL}/payment-result?status=failed";
//             </script>
//           </html>
//         `);
//       }

//       const decrypted = decrypt(encResp);
//       const data = qs.parse(decrypted);
//       const orderId = data.order_id;

//       if (data.order_status === "Success") {
//         await db
//           .promise()
//           .query("UPDATE payments SET status='Success' WHERE order_id=?", [
//             orderId,
//           ]);

//         return res.send(`
//           <html>
//             <body>
//               <script>
//                 window.location.replace("${BASE_URL}/payment-result?status=success");
//               </script>
//             </body>
//           </html>
//         `);
//       }

//       await db
//         .promise()
//         .query("UPDATE payments SET status='Failed' WHERE order_id=?", [
//           orderId,
//         ]);

//       return res.send(`
//         <html>
//           <script>
//             window.location.replace("${BASE_URL}/payment-result?status=failed");
//           </script>
//         </html>
//       `);
//     } catch (err) {
//       console.error(err);

//       return res.send(`
//         <html>
//           <script>
//             window.location.replace("${BASE_URL}/payment-result?status=failed");
//           </script>
//         </html>
//       `);
//     }
//   },
// );

// /* =========================================================
//    🔎 VERIFY PAYMENT
// ========================================================= */

// router.get("/verify", async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.json({ valid: false });
//     }

//     /* ---------- SUCCESS ---------- */
//     const [success] = await db.promise().query(
//       `SELECT * FROM payments
//        WHERE email=? AND status='Success'
//        ORDER BY id DESC
//        LIMIT 1`,
//       [email],
//     );

//     if (success.length > 0) {
//       return res.json({
//         valid: true,
//         plan: success[0].plan,
//       });
//     }

//     /* ---------- PENDING ---------- */
//     const [pending] = await db.promise().query(
//       `SELECT * FROM payments
//        WHERE email=? AND status='Pending'
//        ORDER BY id DESC
//        LIMIT 1`,
//       [email],
//     );

//     if (pending.length > 0) {
//       return res.json({
//         valid: false,
//         pending: true,
//       });
//     }

//     /* ---------- NONE ---------- */
//     return res.json({
//       valid: false,
//       pending: false,
//     });
//   } catch (err) {
//     console.error("Verify Error:", err);

//     res.status(500).json({
//       valid: false,
//     });
//   }
// });

// /* =========================================================
//    📊 ADMIN — PAYMENT LIST WITH MATRIID
// ========================================================= */

// router.get("/admin/payments", async (req, res) => {
//   try {
//     const [rows] = await db.promise().query(`
//       SELECT
//         p.order_id,
//         p.email,
//         p.plan,
//         p.amount,
//         p.status,
//         p.created_at,
//         r.MatriID,
//         r.Name
//       FROM payments p
//       LEFT JOIN register r
//         ON p.email = r.ConfirmEmail
//       ORDER BY p.id DESC
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json([]);
//   }
// });

// /* =========================================================
//    ❌ CANCEL CALLBACK
// ========================================================= */

// // router.all("/ccavenue-cancel", (req, res) => {
// //   res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
// // });

// router.all("/ccavenue-cancel", (req, res) => {
//   res.set({ "Cache-Control": "no-store" });

//   res.redirect(303, `${BASE_URL}/register/step/6?payment=failed`);
// });

// export default router;

import express from "express";
import crypto from "crypto";
import qs from "querystring";
import db from "../../config/db.js";

const router = express.Router();

/* =========================================================
   🔐 LIVE CREDENTIALS
========================================================= */

const MERCHANT_ID = "4417415";
const ACCESS_CODE = "AVPV86ML93BN46VPNB";
const WORKING_KEY = "8D5201FF07BB00FF435BE2C64E38CF32";

const BASE_URL = "https://sriangalammanmatrimony.com";

const CCAVENUE_URL =
  "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

/* =========================================================
   🔐 ENCRYPTION
========================================================= */

function encrypt(plainText) {
  const key = crypto.createHash("md5").update(WORKING_KEY).digest();

  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

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



router.post("/ccavenue-init", async (req, res) => {
  try {
    const { plan, email } = req.body;

    if (!plan || !email) {
      return res.status(400).json({ message: "Missing plan or email" });
    }

    /* 🔒 Prevent duplicate success */
    const [success] = await db.promise().query(
      `SELECT id FROM payments
       WHERE email=? AND status='Success'
       LIMIT 1`,
      [email],
    );

    if (success.length > 0) {
      return res.status(400).json({
        message: "Payment already completed",
      });
    }

    /* 🔒 Prevent rapid duplicate pending (5 min window) */
    const [pending] = await db.promise().query(
      `SELECT * FROM payments
       WHERE email=? 
       AND status='Pending'
       AND created_at > NOW() - INTERVAL 5 MINUTE
       LIMIT 1`,
      [email],
    );

    if (pending.length > 0) {
      const orderId = pending[0].order_id;
      const amount = pending[0].amount;

      const payload =
        `merchant_id=${MERCHANT_ID}` +
        `&order_id=${orderId}` +
        `&currency=INR` +
        `&amount=${amount}` +
        `&redirect_url=${BASE_URL}/api/payment/ccavenue-success` +
        `&cancel_url=${BASE_URL}/api/payment/ccavenue-cancel` +
        `&language=EN` +
        `&billing_email=${email}`;

      return res.json({
        ccUrl: CCAVENUE_URL,
        encRequest: encrypt(payload),
        accessCode: ACCESS_CODE,
      });
    }

    /* ✅ Create new order */
    const orderId = "ORD" + Date.now();
    const amount = plan === "premium" ? "2.00" : "1.00";

    // await db.promise().query(
    //   `INSERT INTO payments (order_id,email,plan,amount,status)
    //    VALUES (?,?,?,?,?)`,
    //   [orderId, email, plan, amount, "Pending"],
    // );

    await db.promise().query(
      `
  INSERT INTO payments (order_id,email,plan,amount,status)
  VALUES (?,?,?,?, 'Success')
`,
      [orderId, email, "basic", data.amount || "1.00"],
    );

    const payload =
      `merchant_id=${MERCHANT_ID}` +
      `&order_id=${orderId}` +
      `&currency=INR` +
      `&amount=${amount}` +
      `&redirect_url=${BASE_URL}/api/payment/ccavenue-success` +
      `&cancel_url=${BASE_URL}/api/payment/ccavenue-cancel` +
      `&language=EN` +
      `&billing_email=${email}`;

    res.json({
      ccUrl: CCAVENUE_URL,
      encRequest: encrypt(payload),
      accessCode: ACCESS_CODE,
    });
  } catch (err) {
    console.error("Payment Init Error:", err);
    res.status(500).json({ message: "Payment init failed" });
  }
});


router.post("/reconcile", async (req, res) => {
  const { order_id } = req.body;

  await db.promise().query(
    `
    UPDATE payments
    SET status='Success'
    WHERE order_id=?
  `,
    [order_id],
  );

  res.json({ success: true });
});
/* =========================================================
   ✅ SUCCESS CALLBACK (POST CHAIN BROKEN SAFELY)
========================================================= */

router.all(
  "/ccavenue-success",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const encResp =
        req.body?.encResp ||
        req.query?.encResp ||
        req.body?.encresp ||
        req.query?.encresp;

      res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
        Expires: "0",
      });

      if (!encResp) {
        return res.send(`
          <html>
            <script>
              window.location.replace("${BASE_URL}/payment-result?status=failed");
            </script>
          </html>
        `);
      }

      const decrypted = decrypt(encResp);
      const data = qs.parse(decrypted);
      const orderId = data.order_id;
      const email = data.billing_email || data.merchant_param1 || "";

      console.log("CCAvenue Response:", data);

      // if (data.order_status === "Success") {
      //   await db
      //     .promise()
      //     .query("UPDATE payments SET status='Success' WHERE order_id=?", [
      //       orderId,
      //     ]);

      //   return res.send(`
      //     <html>
      //       <script>
      //         window.location.replace("${BASE_URL}/payment-result?status=success");
      //       </script>
      //     </html>
      //   `);
      // }


      if (data.order_status === "Success") {
        // 🔥 Always mark success even if already updated
        await db.promise().query(
          `
    UPDATE payments
    SET status='Success'
    WHERE order_id=?
  `,
          [orderId],
        );

        // 🔥 Double safety — if row missing create success
        const [rows] = await db
          .promise()
          .query("SELECT id FROM payments WHERE order_id=?", [orderId]);

        if (rows.length === 0) {
          await db.promise().query(
            `
      INSERT INTO payments (order_id,email,plan,amount,status)
      VALUES (?,?,?,?, 'Success')
    `,
            [orderId, data.billing_email || "", "basic", data.amount || "1.00"],
          );
        }

        return res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${BASE_URL}/payment-result?status=success" />
      </head>
    </html>
  `);
      }
      await db
        .promise()
        .query("UPDATE payments SET status='Failed' WHERE order_id=?", [
          orderId,
        ]);

      return res.send(`
        <html>
          <script>
            window.location.replace("${BASE_URL}/payment-result?status=failed");
          </script>
        </html>
      `);
    } catch (err) {
      console.error("Callback Error:", err);

      return res.send(`
        <html>
          <script>
            window.location.replace("${BASE_URL}/payment-result?status=failed");
          </script>
        </html>
      `);
    }
  },
);

/* =========================================================
   ❌ CANCEL CALLBACK
========================================================= */

router.all("/ccavenue-cancel", (req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
  });

  res.send(`
    <html>
      <script>
        window.location.replace("${BASE_URL}/payment-result?status=failed");
      </script>
    </html>
  `);
});

/* =========================================================
   🔎 VERIFY PAYMENT
========================================================= */

router.get("/verify", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) return res.json({ valid: false });

    const [success] = await db.promise().query(
      `SELECT plan FROM payments
       WHERE email=? AND status='Success'
       ORDER BY id DESC
       LIMIT 1`,
      [email],
    );

    if (success.length > 0) {
      return res.json({
        valid: true,
        plan: success[0].plan,
      });
    }

    return res.json({ valid: false });
  } catch (err) {
    console.error("Verify Error:", err);
    res.json({ valid: false });
  }
});


/* =========================================================
   🗑 DELETE PAYMENT
========================================================= */

router.delete("/admin/payments/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    await db.promise().query(
      "DELETE FROM payments WHERE order_id = ?",
      [orderId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false });
  }
});


/* =========================================================
   🔄 TOGGLE STATUS (Pending ⇄ Success)
========================================================= */

router.put("/admin/payments/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Success"].includes(status)) {
      return res.status(400).json({ success: false });
    }

    await db.promise().query(
      "UPDATE payments SET status=? WHERE order_id=?",
      [status, orderId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;