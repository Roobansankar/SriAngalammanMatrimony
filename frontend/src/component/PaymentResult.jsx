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

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const status = new URLSearchParams(location.search).get("status");

    const raw = localStorage.getItem("multiStepRegistration_form_v1");

    if (raw) {
      const parsed = JSON.parse(raw);

      if (status === "success") {
        parsed.paymentDone = true;

        localStorage.setItem(
          "multiStepRegistration_form_v1",
          JSON.stringify(parsed),
        );

        navigate("/register/step/7", { replace: true });
      } else {
        navigate("/register/step/6?payment=failed", {
          replace: true,
        });
      }
    } else {
      navigate("/register/step/6");
    }
  }, [location, navigate]);

  return <div>Processing Payment...</div>;
}