import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // mark payment success
    localStorage.setItem("paymentDone", "1");

    // 🔥 GO TO FINAL STEP EXPLICITLY
    navigate("/register/step/7", { replace: true });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-bold text-green-600">
        ✅ Payment Successful, completing registration…
      </h1>
    </div>
  );
}
