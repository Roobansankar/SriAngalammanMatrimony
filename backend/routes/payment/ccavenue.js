// // import express from "express";
// // import crypto from "crypto";
// // import qs from "querystring";
// // import FormData from "form-data";

// // const router = express.Router();

// // /* ================= CONFIG ================= */

// // const MERCHANT_ID = "4417415";
// // const ACCESS_CODE = "AVPV86ML93BN46VPNB";
// // const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";

// // /* LIVE GATEWAY (since keys are live) */
// // const CCAVENUE_URL =
// //   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// // /* ================= NGROK / DOMAIN BASE ================= */

// // /* 🔥 CHANGE THIS ONLY WHEN DEPLOYING */
// // const BASE_URL = "https://preextensive-yareli-herpetologic.ngrok-free.dev";

// // /* ================= ENCRYPT ================= */

// // function encrypt(plainText) {
// //   const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();

// //   const iv = Buffer.alloc(16, 0);

// //   const cipher = crypto.createCipheriv("aes-128-cbc", md5, iv);

// //   let encrypted = cipher.update(plainText, "utf8", "hex");
// //   encrypted += cipher.final("hex");

// //   return encrypted;
// // }

// // /* ================= DECRYPT ================= */

// // function decrypt(encText) {
// //   const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();

// //   const iv = Buffer.alloc(16, 0);

// //   const decipher = crypto.createDecipheriv("aes-128-cbc", md5, iv);

// //   let decrypted = decipher.update(encText, "hex", "utf8");
// //   decrypted += decipher.final("utf8");

// //   return decrypted;
// // }

// // /* ================= TEMP STORE ================= */

// // const paymentStore = new Map();

// // /* ================= INIT PAYMENT ================= */

// // router.post("/ccavenue-init", (req, res) => {
// //   console.log("INIT BODY:", req.body);

// //   try {
// //     const { plan, email, formData } = req.body;

// //     if (!plan || !email) {
// //       return res.status(400).json({ message: "Missing data" });
// //     }

// //     const parsedForm =
// //       typeof formData === "string" ? JSON.parse(formData) : formData;

// //     const orderId = "ORD" + Date.now();

// //     paymentStore.set(orderId, {
// //       formData: parsedForm,
// //       plan,
// //     });

// //     const amount = plan === "premium" ? "10.00" : "5.00";

// //     const payload = {
// //       merchant_id: MERCHANT_ID,
// //       order_id: orderId,
// //       currency: "INR",
// //       amount,
// //       redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
// //       cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
// //       language: "EN",
// //       billing_email: email,
// //     };

// //     const encRequest = encrypt(qs.stringify(payload));

// //     res.json({
// //       ccUrl: CCAVENUE_URL,
// //       encRequest,
// //       accessCode: ACCESS_CODE,
// //     });
// //   } catch (err) {
// //     console.error("INIT ERROR:", err);
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // /* ================= SUCCESS CALLBACK ================= */

// // router.post(
// //   "/ccavenue-success",
// //   express.urlencoded({ extended: false }),
// //   async (req, res) => {
// //     try {
// //       const decrypted = decrypt(req.body.encResp);

// //       const data = qs.parse(decrypted);

// //       console.log("CCAvenue Response:", data);

// //       if (data.order_status !== "Success") {
// //         return res.redirect("http://localhost:3000/payment-failed");
// //       }

// //       const orderId = data.order_id;

// //       const stored = paymentStore.get(orderId);

// //       if (!stored) {
// //         return res.redirect("http://localhost:3000/payment-failed");
// //       }

// //       const { formData, plan } = stored;

// //       /* CALL REGISTER API */

// //       const axios = (await import("axios")).default;

// //       const fd = new FormData();

// //       Object.keys(formData).forEach((key) => {
// //         fd.append(key, formData[key]);
// //       });

// //       fd.append("plan", plan);
// //       fd.append("paymentDone", "1");

// //       const registerRes = await axios.post(
// //         "http://localhost:5000/api/register/complete",
// //         fd,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //           },
// //         },
// //       );

// //       console.log("REGISTERED:", registerRes.data);

// //       paymentStore.delete(orderId);

// //       return res.redirect(
// //         "http://localhost:3000/payment-success?matriId=" +
// //           registerRes.data.matriId,
// //       );
// //     } catch (err) {
// //       console.error("SUCCESS ERROR:", err);

// //       res.redirect("http://localhost:3000/payment-failed");
// //     }
// //   },
// // );

// // /* ================= CANCEL ================= */

// // router.post("/ccavenue-cancel", (req, res) => {
// //   res.redirect("http://localhost:3000/payment-failed");
// // });

// // export default router;



// import express from "express";
// import crypto from "crypto";
// import qs from "querystring";
// import FormData from "form-data";
// import axios from "axios";

// const router = express.Router();

// /* ================= CONFIG ================= */

// const MERCHANT_ID = "4417415";
// const ACCESS_CODE = "AVPV86ML93BN46VPNB";
// const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";

// /* LIVE Gateway */
// const CCAVENUE_URL =
//   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// /* 🔥 CHANGE ONLY THIS IN PRODUCTION */
// const BASE_URL = "https://www.sriangalammanmatrimony.com";

// /* ================= ENCRYPT ================= */

// function encrypt(plainText) {
//   const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);

//   const cipher = crypto.createCipheriv("aes-128-cbc", md5, iv);

//   let encrypted = cipher.update(plainText, "utf8", "hex");
//   encrypted += cipher.final("hex");

//   return encrypted;
// }

// /* ================= DECRYPT ================= */

// function decrypt(encText) {
//   const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);

//   const decipher = crypto.createDecipheriv("aes-128-cbc", md5, iv);

//   let decrypted = decipher.update(encText, "hex", "utf8");
//   decrypted += decipher.final("utf8");

//   return decrypted;
// }

// /* ================= TEMP STORE ================= */

// const paymentStore = new Map();

// /* =========================================================
//    INIT PAYMENT
// ========================================================= */

// router.post("/ccavenue-init", (req, res) => {
//   console.log("INIT BODY:", req.body);

//   try {
//     const { plan, email, formData } = req.body;

//     if (!plan || !email) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     const parsedForm =
//       typeof formData === "string" ? JSON.parse(formData) : formData;

//     const orderId = "ORD" + Date.now();

//     paymentStore.set(orderId, {
//       formData: parsedForm,
//       plan,
//     });

//     const amount = plan === "premium" ? "10.00" : "5.00";

//     const payload = {
//       merchant_id: MERCHANT_ID,
//       order_id: orderId,
//       currency: "INR",
//       amount,
//       redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
//       cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
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
//     console.error("INIT ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// /* =========================================================
//    SUCCESS CALLBACK
// ========================================================= */

// router.post(
//   "/ccavenue-success",
//   express.urlencoded({ extended: false }),
//   async (req, res) => {
//     try {
//       const decrypted = decrypt(req.body.encResp);
//       const data = qs.parse(decrypted);

//       console.log("CCAvenue Response:", data);

//       if (data.order_status !== "Success") {
//         return res.redirect(`${BASE_URL}/payment-failed`);
//       }

//       const stored = paymentStore.get(data.order_id);

//       if (!stored) {
//         return res.redirect(`${BASE_URL}/payment-failed`);
//       }

//       const { formData, plan } = stored;

//       /* ================= REGISTER ================= */

//       const fd = new FormData();

//       Object.keys(formData).forEach((k) => {
//         fd.append(k, formData[k]);
//       });

//       fd.append("plan", plan);
//       fd.append("paymentDone", "1");

//       const registerRes = await axios.post(
//         `${BASE_URL}/api/register/complete`,
//         fd,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         },
//       );

//       const matriId = registerRes.data.matriId;

//       /* ================= AUTO LOGIN ================= */

//       const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
//         email: formData.email,
//         password: formData.password,
//       });

//       const token = loginRes.data.token || "";

//       paymentStore.delete(data.order_id);

//       /* ================= REDIRECT ================= */

//       return res.redirect(
//         `${BASE_URL}/payment-success?matriId=${matriId}&token=${token}`,
//       );
//     } catch (err) {
//       console.error("SUCCESS ERROR:", err);
//       res.redirect(`${BASE_URL}/payment-failed`);
//     }
//   },
// );

// /* =========================================================
//    CANCEL CALLBACK
// ========================================================= */

// router.post("/ccavenue-cancel", (req, res) => {
//   res.redirect(`${BASE_URL}/payment-failed`);
// });

// export default router;


// import express from "express";
// import crypto from "crypto";
// import qs from "querystring";

// const router = express.Router();

// /* ================= CONFIG ================= */

// const MERCHANT_ID = "4417415";
// const ACCESS_CODE = "AVPV86ML93BN46VPNB";
// const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";

// const CCAVENUE_URL =
//   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// const BASE_URL = "https://www.sriangalammanmatrimony.com";

// /* ================= ENCRYPT ================= */

// function encrypt(plainText) {
//   const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);
//   const cipher = crypto.createCipheriv("aes-128-cbc", md5, iv);

//   let encrypted = cipher.update(plainText, "utf8", "hex");
//   encrypted += cipher.final("hex");

//   return encrypted;
// }

// /* ================= DECRYPT ================= */

// function decrypt(encText) {
//   const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);
//   const decipher = crypto.createDecipheriv("aes-128-cbc", md5, iv);

//   let decrypted = decipher.update(encText, "hex", "utf8");
//   decrypted += decipher.final("utf8");

//   return decrypted;
// }

// /* ================= INIT PAYMENT ================= */

// router.post("/ccavenue-init", (req, res) => {
//   try {
//     const { plan, email } = req.body;

//     if (!plan || !email) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     const orderId = "ORD" + Date.now();
//     const amount = plan === "premium" ? "10.00" : "5.00";

//     const payload = {
//       merchant_id: MERCHANT_ID,
//       order_id: orderId,
//       currency: "INR",
//       amount,
//       redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
//       cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
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
//     res.status(500).json({ message: err.message });
//   }
// });

// /* ================= SUCCESS CALLBACK ================= */

// router.post(
//   "/ccavenue-success",
//   express.urlencoded({ extended: false }),
//   (req, res) => {
//     try {
//       const decrypted = decrypt(req.body.encResp);
//       const data = qs.parse(decrypted);

//       if (data.order_status === "Success") {
//         return res.redirect(`${BASE_URL}/register/step/6?payment=success`);
//       } else {
//         return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//       }
//     } catch (err) {
//       return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//     }
//   },
// );

// /* ================= CANCEL CALLBACK ================= */

// router.post("/ccavenue-cancel", (req, res) => {
//   res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
// });

// export default router;




// import express from "express";
// import crypto from "crypto";
// import qs from "querystring";
// import db from "../../config/db.js"; 

// const router = express.Router();

// /* ================= CONFIG ================= */

// const MERCHANT_ID = "4417415";
// const ACCESS_CODE = "AVPV86ML93BN46VPNB";
// const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";

// const CCAVENUE_URL =
//   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// const BASE_URL = "https://www.sriangalammanmatrimony.com";

// /* ================= ENCRYPT ================= */

// function encrypt(text) {
//   const key = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);
//   const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }

// /* ================= DECRYPT ================= */

// function decrypt(encText) {
//   const key = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);
//   const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

//   let decrypted = decipher.update(encText, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

// /* ================= INIT PAYMENT ================= */

// router.post("/ccavenue-init", async (req, res) => {
//   try {
//     const { plan, email } = req.body;

//     if (!plan || !email) {
//       return res.status(400).json({ message: "Missing plan or email" });
//     }

//     const orderId = "ORD" + Date.now();
//     const amount = plan === "premium" ? "10.00" : "5.00";

//     // 🔐 Save pending order in DB
//     await db.query(
//       "INSERT INTO payments (order_id, email, plan, amount, status) VALUES (?, ?, ?, ?, ?)",
//       [orderId, email, plan, amount, "Pending"],
//     );

//     const payload = {
//       merchant_id: MERCHANT_ID,
//       order_id: orderId,
//       currency: "INR",
//       amount,
//       redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
//       cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
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
//     console.error("Payment Init Error:", err);
//     res.status(500).json({ message: "Payment init failed" });
//   }
// });

// /* ================= SUCCESS CALLBACK ================= */

// router.post(
//   "/ccavenue-success",
//   express.urlencoded({ extended: false }),
//   async (req, res) => {
//     try {
//       const decrypted = decrypt(req.body.encResp);
//       const data = qs.parse(decrypted);

//       console.log("CCAvenue Response:", data);

//       const orderId = data.order_id;

//       if (data.order_status === "Success") {
//         const [rows] = await db.query(
//           "SELECT * FROM payments WHERE order_id = ?",
//           [orderId],
//         );

//         if (rows.length === 0) {
//           return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//         }

//         await db.query(
//           "UPDATE payments SET status = 'Success' WHERE order_id = ?",
//           [orderId],
//         );

//         return res.redirect(`${BASE_URL}/register/step/7?payment=success`);
//       }

//       await db.query(
//         "UPDATE payments SET status = 'Failed' WHERE order_id = ?",
//         [orderId],
//       );

//       return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//     } catch (err) {
//       console.error("Success Callback Error:", err);
//       return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//     }
//   },
// );

// /* ================= VERIFY PAYMENT ================= */

// router.get("/verify", async (req, res) => {
//   try {
//     const { email } = req.query;

//     const [rows] = await db.query(
//       "SELECT * FROM payments WHERE email = ? AND status = 'Success' ORDER BY id DESC LIMIT 1",
//       [email],
//     );

//     if (rows.length === 0) {
//       return res.json({ valid: false });
//     }

//     res.json({
//       valid: true,
//       plan: rows[0].plan,
//     });
//   } catch (err) {
//     console.error("Verify Error:", err);
//     res.status(500).json({ valid: false });
//   }
// });

// /* ================= CANCEL ================= */

// router.post("/ccavenue-cancel", (req, res) => {
//   res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
// });

// export default router;




// import express from "express";
// import crypto from "crypto";
// import qs from "querystring";
// import db from "../../config/db.js";

// import dotenv from "dotenv";
// dotenv.config();


// const router = express.Router();

// /* ================= ENV CONFIG ================= */

// const MERCHANT_ID = process.env.CCA_MERCHANT_ID;
// const ACCESS_CODE = process.env.CCA_ACCESS_CODE;
// const WORKING_KEY = process.env.CCA_WORKING_KEY;

// console.log("MID:", MERCHANT_ID);

// const CCAVENUE_URL =
//   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// const BASE_URL = process.env.BASE_URL;

// /* ================= ENCRYPT ================= */

// function encrypt(text) {
//   const key = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);

//   const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");

//   return encrypted;
// }

// /* ================= DECRYPT ================= */

// function decrypt(encText) {
//   const key = crypto.createHash("md5").update(WORKING_KEY).digest();
//   const iv = Buffer.alloc(16, 0);

//   const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

//   let decrypted = decipher.update(encText, "hex", "utf8");
//   decrypted += decipher.final("utf8");

//   return decrypted;
// }

// /* ================= INIT PAYMENT ================= */

// // router.post("/ccavenue-init", async (req, res) => {
// //   try {
// //     const { plan, email } = req.body;

// //     if (!plan || !email) {
// //       return res.status(400).json({ message: "Missing plan or email" });
// //     }

// //     const orderId = "ORD" + Date.now();
// //     const amount = plan === "premium" ? "10.00" : "5.00";

// //     /* Save Pending Order */
// //     await db.query(
// //       `INSERT INTO payments 
// //        (order_id, email, plan, amount, status) 
// //        VALUES (?, ?, ?, ?, ?)`,
// //       [orderId, email, plan, amount, "Pending"],
// //     );

// //     const payload = {
// //       merchant_id: MERCHANT_ID,
// //       order_id: orderId,
// //       currency: "INR",
// //       amount,
// //       redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
// //       cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
// //       language: "EN",
// //       billing_email: email,
// //     };

// //     const encRequest = encrypt(qs.stringify(payload));

// //     res.json({
// //       ccUrl: CCAVENUE_URL,
// //       encRequest,
// //       accessCode: ACCESS_CODE,
// //     });
// //   } catch (err) {
// //     console.error("Payment Init Error:", err);
// //     res.status(500).json({ message: "Payment init failed" });
// //   }
// // });

// router.post("/ccavenue-init", async (req, res) => {
//   try {
//     console.log("BODY:", req.body);

//     const { plan, email } = req.body;

//     console.log("ENV CHECK:", {
//       MERCHANT_ID,
//       ACCESS_CODE,
//       WORKING_KEY,
//       BASE_URL,
//     });

//     const orderId = "ORD" + Date.now();
//     const amount = plan === "premium" ? "10.00" : "5.00";

//     console.log("Inserting DB...");

//     await db.query(
//       `INSERT INTO payments 
//        (order_id, email, plan, amount, status) 
//        VALUES (?, ?, ?, ?, ?)`,
//       [orderId, email, plan, amount, "Pending"],
//     );

//     console.log("DB Inserted ✅");

//     const payload = {
//       merchant_id: MERCHANT_ID,
//       order_id: orderId,
//       currency: "INR",
//       amount,
//       redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
//       cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
//       language: "EN",
//       billing_email: email,
//     };

//     console.log("Payload:", payload);

//     const encRequest = encrypt(qs.stringify(payload));

//     res.json({
//       ccUrl:
//         "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
//       encRequest,
//       accessCode: ACCESS_CODE,
//     });
//   } catch (err) {
//     console.error("Payment Init Error FULL:", err);
//     res.status(500).json({
//       message: "Payment init failed",
//       error: err.message,
//     });
//   }
// });

// /* ================= SUCCESS CALLBACK ================= */

// router.post(
//   "/ccavenue-success",
//   express.urlencoded({ extended: false }),
//   async (req, res) => {
//     try {
//       const decrypted = decrypt(req.body.encResp);
//       const data = qs.parse(decrypted);

//       console.log("CCAvenue Response:", data);

//       const orderId = data.order_id;

//       if (!orderId) {
//         return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//       }

//       if (data.order_status === "Success") {
//         await db.query(
//           "UPDATE payments SET status = 'Success' WHERE order_id = ?",
//           [orderId],
//         );

//         return res.redirect(`${BASE_URL}/register/step/6?payment=success`);
//       }

//       await db.query(
//         "UPDATE payments SET status = 'Failed' WHERE order_id = ?",
//         [orderId],
//       );

//       return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//     } catch (err) {
//       console.error("Success Callback Error:", err);
//       return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
//     }
//   },
// );

// /* ================= VERIFY PAYMENT ================= */

// router.get("/verify", async (req, res) => {
//   try {
//     const { email } = req.query;

//     const [rows] = await db.query(
//       `SELECT * FROM payments
//        WHERE email = ?
//        AND status = 'Success'
//        ORDER BY id DESC
//        LIMIT 1`,
//       [email],
//     );

//     if (rows.length === 0) {
//       return res.json({ valid: false });
//     }

//     res.json({
//       valid: true,
//       plan: rows[0].plan,
//     });
//   } catch (err) {
//     console.error("Verify Error:", err);
//     res.status(500).json({ valid: false });
//   }
// });

// /* ================= CANCEL ================= */
// /* Supports GET + POST */

// router.all("/ccavenue-cancel", (req, res) => {
//   res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
// });

// export default router;


import express from "express";
import crypto from "crypto";
import qs from "querystring";
import db from "../../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/* ================= ENV CONFIG ================= */

// const MERCHANT_ID = process.env.CCA_MERCHANT_ID;
// const ACCESS_CODE = process.env.CCA_ACCESS_CODE;
// const WORKING_KEY = process.env.CCA_WORKING_KEY;
const MERCHANT_ID = "4417415";
const ACCESS_CODE = "AVPV86ML93BN46VPNB";
const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";
const BASE_URL = process.env.BASE_URL;

console.log("MID:", MERCHANT_ID);

/* ================= CCA URL ================= */

// const CCAVENUE_URL =
//   "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

const CCAVENUE_URL =
  "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

/* ================= ENCRYPT ================= */

function encrypt(text) {
  const key = crypto.createHash("md5").update(WORKING_KEY).digest();
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

/* ================= DECRYPT ================= */

function decrypt(encText) {
  const key = crypto.createHash("md5").update(WORKING_KEY).digest();
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/* ================= INIT PAYMENT ================= */

router.post("/ccavenue-init", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { plan, email } = req.body;

    if (!plan || !email) {
      return res.status(400).json({ message: "Missing plan or email" });
    }

    console.log("ENV CHECK:", {
      MERCHANT_ID,
      ACCESS_CODE,
      WORKING_KEY,
      BASE_URL,
    });

    const orderId = "ORD" + Date.now();
    const amount = plan === "premium" ? "10.00" : "5.00";

    console.log("Inserting DB...");

    /* ✅ FIXED — PROMISE QUERY */
    await db.promise().query(
      `INSERT INTO payments
       (order_id, email, plan, amount, status)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, email, plan, amount, "Pending"],
    );

    console.log("DB Inserted ✅");

    const payload = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      currency: "INR",
      amount,
      redirect_url: `${BASE_URL}/api/payment/ccavenue-success`,
      cancel_url: `${BASE_URL}/api/payment/ccavenue-cancel`,
      language: "EN",
      billing_email: email,
    };

    console.log("Payload:", payload);

    const encRequest = encrypt(qs.stringify(payload));

    res.json({
      ccUrl: CCAVENUE_URL,
      encRequest,
      accessCode: ACCESS_CODE,
    });
  } catch (err) {
    console.error("Payment Init Error FULL:", err);
    res.status(500).json({
      message: "Payment init failed",
      error: err.message,
    });
  }
});

/* ================= SUCCESS CALLBACK ================= */

router.post(
  "/ccavenue-success",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const decrypted = decrypt(req.body.encResp);
      const data = qs.parse(decrypted);

      console.log("CCAvenue Response:", data);

      const orderId = data.order_id;

      if (!orderId) {
        return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
      }

      if (data.order_status === "Success") {
        /* ✅ FIXED */
        await db
          .promise()
          .query("UPDATE payments SET status='Success' WHERE order_id=?", [
            orderId,
          ]);

        return res.redirect(`${BASE_URL}/register/step/6?payment=success`);
      }

      /* FAILED */
      await db
        .promise()
        .query("UPDATE payments SET status='Failed' WHERE order_id=?", [
          orderId,
        ]);

      return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
    } catch (err) {
      console.error("Success Callback Error:", err);

      return res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
    }
  },
);

/* ================= VERIFY PAYMENT ================= */

router.get("/verify", async (req, res) => {
  try {
    const { email } = req.query;

    const [rows] = await db.promise().query(
      `SELECT * FROM payments
         WHERE email=?
         AND status='Success'
         ORDER BY id DESC
         LIMIT 1`,
      [email],
    );

    if (rows.length === 0) {
      return res.json({
        valid: false,
      });
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

/* ================= CANCEL ================= */

router.all("/ccavenue-cancel", (req, res) => {
  res.redirect(`${BASE_URL}/register/step/6?payment=failed`);
});

export default router;
