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

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
      let attempts = 0;

      async function checkPayment() {
        const raw = localStorage.getItem("multiStepRegistration_form_v1");
        if (!raw) {
          navigate("/register/step/6");
          return;
        }

        const parsed = JSON.parse(raw);

        try {
          const res = await axios.get("/api/payment/verify", {
            params: { email: parsed.email },
          });

          if (res.data.valid) {
            parsed.paymentDone = true;
            parsed.plan = res.data.plan;

            localStorage.setItem(
              "multiStepRegistration_form_v1",
              JSON.stringify(parsed),
            );

            navigate("/register/step/7", { replace: true });
          } else {
            if (attempts < 10) {
              attempts++;
              setTimeout(checkPayment, 2000);
            } else {
              navigate("/register/step/6");
            }
          }
        } catch {
          navigate("/register/step/6");
        }
      }

      checkPayment();
    }, [navigate]);

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

  return <div>Processing Payment...</div>;
}