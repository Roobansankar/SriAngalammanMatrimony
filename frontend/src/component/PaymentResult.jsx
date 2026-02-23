import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (status === "success") {
      navigate("/register/step/7", { replace: true });
    } else {
      navigate("/register/step/6?payment=failed", { replace: true });
    }
  }, [location, navigate]);

  return <div className="text-center mt-20">Processing Payment...</div>;
}