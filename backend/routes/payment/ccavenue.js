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



import express from "express";
import crypto from "crypto";
import qs from "querystring";
import FormData from "form-data";
import axios from "axios";

const router = express.Router();

/* =========================================================
   CONFIG — LIVE CREDENTIALS
========================================================= */

const MERCHANT_ID = "4417415";
const ACCESS_CODE = "AVPV86ML93BN46VPNB";
const WORKING_KEY = "8A6F30AFBA81C3842F00E1F7B14E0C7B";

/* LIVE PAYMENT URL */
const CCAVENUE_URL =
  "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

/* YOUR DOMAIN */
const BASE_URL = "https://www.sriangalammanmatrimony.com";

/* =========================================================
   ENCRYPT FUNCTION
========================================================= */

function encrypt(plainText) {
  const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();

  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv("aes-128-cbc", md5, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

/* =========================================================
   DECRYPT FUNCTION
========================================================= */

function decrypt(encText) {
  const md5 = crypto.createHash("md5").update(WORKING_KEY).digest();

  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", md5, iv);

  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/* =========================================================
   TEMP STORE (Holds form data until payment completes)
========================================================= */

const paymentStore = new Map();

/* =========================================================
   INIT PAYMENT
========================================================= */

router.post("/ccavenue-init", (req, res) => {
  console.log("INIT BODY:", req.body);

  try {
    const { plan, email, formData } = req.body;

    if (!plan || !email) {
      return res.status(400).json({ message: "Missing data" });
    }

    const parsedForm =
      typeof formData === "string" ? JSON.parse(formData) : formData;

    const orderId = "ORD" + Date.now();

    paymentStore.set(orderId, {
      formData: parsedForm,
      plan,
    });

    const amount = plan === "premium" ? "10.00" : "5.00";

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

    const encRequest = encrypt(qs.stringify(payload));

    res.json({
      ccUrl: CCAVENUE_URL,
      encRequest,
      accessCode: ACCESS_CODE,
    });
  } catch (err) {
    console.error("INIT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   SUCCESS CALLBACK → REGISTER → LOGIN → PROFILE
========================================================= */

router.post(
  "/ccavenue-success",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const decrypted = decrypt(req.body.encResp);

      const data = qs.parse(decrypted);

      console.log("CCAvenue Response:", data);

      if (data.order_status !== "Success") {
        return res.redirect(`${BASE_URL}/register/payment-error`);
      }

      const stored = paymentStore.get(data.order_id);

      if (!stored) {
        return res.redirect(`${BASE_URL}/register/payment-error`);
      }

      const { formData, plan } = stored;

      /* ================= REGISTER USER ================= */

      const fd = new FormData();

      Object.keys(formData).forEach((k) => {
        fd.append(k, formData[k]);
      });

      fd.append("plan", plan);
      fd.append("paymentDone", "1");

      const registerRes = await axios.post(
        `${BASE_URL}/api/register/complete`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      /* ================= AUTO LOGIN ================= */

      const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      const token = loginRes.data.token;

      paymentStore.delete(data.order_id);

      /* ================= DIRECT PROFILE REDIRECT ================= */

      return res.redirect(`${BASE_URL}/profile?token=${token}`);
    } catch (err) {
      console.error("SUCCESS ERROR:", err);

      res.redirect(`${BASE_URL}/register/payment-error`);
    }
  },
);

/* =========================================================
   CANCEL CALLBACK
========================================================= */

router.post("/ccavenue-cancel", (req, res) => {
  res.redirect(`${BASE_URL}/register/payment-cancelled`);
});

export default router;
