import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Step12 from "./Step12";

export default function PaymentProtectedStep7({ formData, setFormData }) {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verify() {
      const raw = localStorage.getItem("multiStepRegistration_form_v1");

      if (!raw) {
        navigate("/register/step/6");
        return;
      }

      const parsed = JSON.parse(raw);

      /* Restore form */
      setFormData(parsed);

      if (!parsed.email) {
        navigate("/register/step/6");
        return;
      }

      const res = await axios.get("/api/payment/verify", {
        params: { email: parsed.email },
      });

      if (!res.data.valid) {
        navigate("/register/step/6");
        return;
      }

      setVerified(true);
    }

    verify();
  }, []);

  if (!verified) return <div>Verifying Payment...</div>;

  return <Step12 formData={formData} setFormData={setFormData} />;
}
