import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const matriId = params.get("matriId");

    if (token) {
      localStorage.setItem("token", token);
    }

    if (matriId) {
      localStorage.setItem("matriId", matriId);
    }

    // redirect to profile
    navigate("/profile");
  }, []);

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold">Payment Successful 🎉</h2>
      <p>Logging you in...</p>
    </div>
  );
}
