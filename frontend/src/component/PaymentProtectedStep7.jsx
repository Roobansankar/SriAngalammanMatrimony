// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Step12 from "./Step12";

// export default function PaymentProtectedStep7({ formData, setFormData }) {
//   const navigate = useNavigate();
//   const [verified, setVerified] = useState(false);

//   useEffect(() => {
//     async function verify() {
//       const raw = localStorage.getItem("multiStepRegistration_form_v1");

//       if (!raw) {
//         navigate("/register/step/6");
//         return;
//       }

//       const parsed = JSON.parse(raw);

//       /* Restore form */
//       setFormData(parsed);

//       if (!parsed.email) {
//         navigate("/register/step/6");
//         return;
//       }

//       const res = await axios.get("/api/payment/verify", {
//         params: { email: parsed.email },
//       });

//       if (!res.data.valid) {
//         navigate("/register/step/6");
//         return;
//       }

//       setVerified(true);
//     }

//     verify();
//   }, []);

//   if (!verified) return <div>Verifying Payment...</div>;

//   return <Step12 formData={formData} setFormData={setFormData} />;
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Step12 from "./Step12";

export default function PaymentProtectedStep7({ formData, setFormData }) {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [verifiedData, setVerifiedData] = useState(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        /* 1️⃣ Restore from localStorage */
        const raw = localStorage.getItem("multiStepRegistration_form_v1");

        if (!raw) {
          navigate("/register/step/6");
          return;
        }

        const parsed = JSON.parse(raw);

        if (!parsed.email) {
          navigate("/register/step/6");
          return;
        }

        /* 2️⃣ Verify from backend */
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE || ""}/api/payment/verify`,
          {
            params: { email: parsed.email },
          },
        );

        console.log("Verify Response:", res.data);

        if (!res.data.valid) {
          navigate("/register/step/6");
          return;
        }

        /* 3️⃣ Inject verified plan */
        parsed.plan = res.data.plan;
        parsed.paymentDone = true;

        /* Save again */
        localStorage.setItem(
          "multiStepRegistration_form_v1",
          JSON.stringify(parsed),
        );

        /* Set to local state (NOT async race) */
        setVerifiedData(parsed);

        /* Sync parent state */
        setFormData(parsed);
      } catch (err) {
        console.error("Verification failed:", err);
        navigate("/register/step/6");
      } finally {
        setChecking(false);
      }
    }

    verifyPayment();
  }, [navigate, setFormData]);

  /* Loading */
  if (checking) {
    return <div className="text-center mt-10">Verifying Payment...</div>;
  }

  /* Safety fallback */
  if (!verifiedData) {
    return (
      <div className="text-center mt-10 text-red-600">
        Payment verification failed.
      </div>
    );
  }

  /* Render final step */
  return <Step12 formData={verifiedData} setFormData={setFormData} />;
}