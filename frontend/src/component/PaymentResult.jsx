// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function PaymentResult() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const status = params.get("status");

//     if (status === "success") {
//       navigate("/register/step/7", { replace: true });
//     } else {
//       navigate("/register/step/6?payment=failed", { replace: true });
//     }
//   }, [location, navigate]);

//   return <div className="text-center mt-20">Processing Payment...</div>;
// }

// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// export default function PaymentResult() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const status = new URLSearchParams(location.search).get("status");

//     if (status === "success") {
//       /* Restore form data */
//       const raw = localStorage.getItem("multiStepRegistration_form_v1");

//       if (raw) {
//         const parsed = JSON.parse(raw);

//         /* Save payment flag */
//         parsed.paymentDone = true;

//         localStorage.setItem(
//           "multiStepRegistration_form_v1",
//           JSON.stringify(parsed),
//         );
//       }

//       navigate("/register/step/7", { replace: true });
//     } else {
//       navigate("/register/step/6?payment=failed", { replace: true });
//     }
//   }, [location, navigate]);

//   return <div>Processing Payment...</div>;
// }

// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// export default function PaymentResult() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const status = new URLSearchParams(location.search).get("status");

//     const raw = localStorage.getItem("multiStepRegistration_form_v1");

//     if (raw) {
//       const parsed = JSON.parse(raw);

//       if (status === "success") {
//         parsed.paymentDone = true;

//         localStorage.setItem(
//           "multiStepRegistration_form_v1",
//           JSON.stringify(parsed),
//         );

//         navigate("/register/step/7", { replace: true });
//       } else {
//         navigate("/register/step/6?payment=failed", {
//           replace: true,
//         });
//       }
//     } else {
//       navigate("/register/step/6");
//     }
//   }, [location, navigate]);

//   return <div>Processing Payment...</div>;
// }

// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// export default function PaymentResult() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const status = new URLSearchParams(location.search).get("status");

//     const raw = localStorage.getItem("multiStepRegistration_form_v1");

//     if (!raw) {
//       navigate("/register/step/6", { replace: true });
//       return;
//     }

//     const parsed = JSON.parse(raw);

//     if (status === "success") {
//       /* 🔥 FORCE SAVE PAYMENT STATE */
//       parsed.paymentDone = true;

//       localStorage.setItem(
//         "multiStepRegistration_form_v1",
//         JSON.stringify(parsed),
//       );

//       /* 🔥 GO DIRECT STEP 7 */
//       navigate("/register/step/7", { replace: true });
//     } else {
//       navigate("/register/step/6?payment=failed", {
//         replace: true,
//       });
//     }
//   }, [location, navigate]);

//   useEffect(() => {
//   async function finalize() {
//     const raw = localStorage.getItem(
//       "multiStepRegistration_form_v1"
//     );

//     if (!raw) {
//       navigate("/register/step/6");
//       return;
//     }

//     const parsed = JSON.parse(raw);

//     // 🔥 Verify directly from DB
//     const res = await axios.get(
//       "/api/payment/verify",
//       { params: { email: parsed.email } }
//     );

//     if (res.data.valid) {
//       parsed.paymentDone = true;

//       localStorage.setItem(
//         "multiStepRegistration_form_v1",
//         JSON.stringify(parsed)
//       );

//       navigate("/register/step/7", { replace: true });
//     } else {
//       // wait 2 sec retry
//       setTimeout(finalize, 2000);
//     }
//   }

//   finalize();
// }, []);

//   return <div>Processing Payment...</div>;
// }

// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// export default function PaymentResult() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     async function finalize() {
//       const raw = localStorage.getItem("multiStepRegistration_form_v1");

//       if (!raw) {
//         navigate("/register/step/6");
//         return;
//       }

//       const parsed = JSON.parse(raw);

//       /* Retry verify until gateway updates DB */
//       const res = await axios.get("/api/payment/verify", {
//         params: { email: parsed.email },
//       });

//       if (res.data.valid) {
//         parsed.paymentDone = true;

//         localStorage.setItem(
//           "multiStepRegistration_form_v1",
//           JSON.stringify(parsed),
//         );

//         navigate("/register/step/7", { replace: true });
//       } else {
//         setTimeout(finalize, 2000);
//       }
//     }

//     finalize();
//   }, [navigate, location]);

//   return <div>Processing Payment...</div>;
// }

import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "multiStepRegistration_form_v1";
const MAX_ATTEMPTS = 8;
const RETRY_MS = 1500;

export default function PaymentResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const status = (params.get("status") || "").toLowerCase();

  useEffect(() => {
    window.history.replaceState(null, "", window.location.href);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer;
    let attempts = 0;

    // Every exit uses `replace`, so /payment-result never stays in the
    // history stack (Back would re-run this page and bounce the user around).
    const backToPayment = () =>
      navigate("/register/step/6?payment=failed", { replace: true });

    // Gateway said failed / cancelled: no need to poll — straight back to
    // step 6 with the failure notice (+ contact numbers).
    if (status !== "success") {
      backToPayment();
      return undefined;
    }

    async function confirmPayment() {
      if (cancelled) return;
      attempts += 1;

      let email = "";
      try {
        email = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").email || "";
      } catch {
        email = "";
      }

      // Registration draft is not in this browser origin, so we cannot
      // continue to step 7 from here — stay on step 6.
      if (!email) {
        navigate("/register/step/6", { replace: true });
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE || ""}/api/payment/verify`,
          { params: { email } },
        );
        if (cancelled) return;

        if (res.data.valid) {
          navigate("/register/step/7", { replace: true });
          return;
        }
      } catch {
        // network hiccup — retry below
      }

      if (attempts < MAX_ATTEMPTS) {
        timer = setTimeout(confirmPayment, RETRY_MS);
      } else {
        backToPayment();
      }
    }

    confirmPayment();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigate, status]);

  return (
    <div className="text-center mt-20 text-lg">
      {status === "success"
        ? "Verifying Payment... Please wait."
        : "Returning to the payment page..."}
    </div>
  );
}