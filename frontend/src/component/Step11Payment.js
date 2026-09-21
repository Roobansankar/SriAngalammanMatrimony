
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Support numbers shown at the bottom of step 6 (always).
const SUPPORT_NUMBERS = [
  { label: "9443946541", tel: "9443946541" },
  { label: "70104 59106", tel: "7010459106" },
];

export default function Step11Payment({ formData, setFormData }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [searchParams] = useSearchParams();
  // PaymentResult sends the user back here with ?payment=failed
  const paymentFailed = searchParams.get("payment") === "failed";


useEffect(() => {
  const blockBack = () => {
    window.history.pushState(null, "", window.location.href);
  };

  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", blockBack);

  return () => {
    window.removeEventListener("popstate", blockBack);
  };
}, []);


  useEffect(() => {
    async function verifyPayment() {
      const raw = localStorage.getItem("multiStepRegistration_form_v1");

      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (!parsed.email) return;

      try {
        const res = await axios.get("/api/payment/verify", {
          params: { email: parsed.email },
        });

        if (res.data.valid) {
          navigate("/register/step/7", { replace: true });
        }
      } catch (err) {
        console.error(err);
      }
    }

    verifyPayment();
  }, [navigate]);

  /* --------------------------------------------------
     💳 HANDLE PAYMENT
  -------------------------------------------------- */

  const handlePayment = async () => {
    let emailToUse = formData?.email;

    /* Restore email if lost */
    if (!emailToUse) {
      const raw = localStorage.getItem("multiStepRegistration_form_v1");

      if (raw) {
        const parsed = JSON.parse(raw);
        emailToUse = parsed.email;
        setFormData(parsed);
      }
    }

    if (!plan) {
      alert("Please select a plan");
      return;
    }

    if (!emailToUse) {
      alert("Registration data missing. Restart.");
      return;
    }

    try {
      setLoading(true);

      const updatedData = {
        ...formData,
        email: emailToUse,
        plan,
      };

      localStorage.setItem(
        "multiStepRegistration_form_v1",
        JSON.stringify(updatedData),
      );

      setFormData(updatedData);

      // const res = await axios.post("/api/payment/ccavenue-init", {
      //   plan,
      //   email: emailToUse,
      // });

      const res = await axios.post("/api/payment/ccavenue-init", {
        plan,
        email: emailToUse,
        mobile: formData?.mobile,
        amount: userType === "old" ? 500 : plan === "premium" ? 5000 : 2000,
        // The registration draft lives in THIS host's localStorage (www and
        // non-www are separate), so tell the server where to send us back.
        returnHost: window.location.hostname,
      });

      /* Redirect to CCAvenue */
      const form = document.createElement("form");
      form.method = "POST";
      form.action = res.data.ccUrl;

      form.innerHTML = `
        <input type="hidden" name="encRequest" value="${res.data.encRequest}" />
        <input type="hidden" name="access_code" value="${res.data.accessCode}" />
      `;

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      alert("Payment init failed");
      setLoading(false);
    }
  };



return (
  <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow text-center">
    {paymentFailed && (
      <div
        role="alert"
        className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-red-700"
      >
        <p className="font-semibold">Payment was not completed.</p>
        <p className="text-sm mt-1">
          Your registration details are saved. Please choose a plan and try
          again.
        </p>
      </div>
    )}

    <h2 className="text-xl font-bold mb-8">Choose Your Plan</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* OLD USER */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Old Users</h3>
        <p className="text-sm text-gray-500 mb-6">
          Already joined in WhatsApp group
        </p>

        <div
          onClick={() => {
            setPlan("basic");
            setUserType("old");
          }}
          className={`p-6 border rounded-lg cursor-pointer ${
            plan === "basic" && userType === "old"
              ? "border-rose-500 bg-rose-50"
              : ""
          }`}
        >
          <h3 className="font-semibold">Basic</h3>
          <p className="text-lg mt-2">₹500</p>
        </div>
      </div>

      {/* NEW USER */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">New Users</h3>
        <p className="text-sm text-gray-500 mb-6">
          New to Sri Angalamman Matrimony
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* NEW BASIC */}
          <div
            onClick={() => {
              setPlan("basic");
              setUserType("new");
            }}
            className={`p-6 border rounded-lg cursor-pointer flex flex-col items-center justify-center min-h-[90px] ${
              plan === "basic" && userType === "new"
                ? "border-rose-500 bg-rose-50"
                : ""
            }`}
          >
            <h3 className="font-semibold">Basic</h3>
            <p className="text-lg mt-2">₹2000</p>
          </div>

          {/* PREMIUM */}
          <div
            onClick={() => {
              setPlan("premium");
              setUserType("new");
            }}
            className={`p-6 border rounded-lg cursor-pointer flex flex-col items-center justify-center min-h-[90px] ${
              plan === "premium" ? "border-rose-500 bg-rose-50" : ""
            }`}
          >
            <h3 className="font-semibold">Premium</h3>
            <p className="text-lg mt-2">₹5000</p>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={handlePayment}
      disabled={loading || !plan}
      className="mt-8 px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded"
    >
      {loading ? "Redirecting..." : "Pay Now"}
    </button>

    {/* Always visible; only the wording changes after a failed payment. */}
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700">
      <p className="font-semibold mb-1">
        {paymentFailed
          ? "Payment problem? Money debited but payment failed? Contact us:"
          : "Any doubt? Need help with the payment? Contact us:"}
      </p>
      <p className="text-base font-semibold text-rose-700">
        {SUPPORT_NUMBERS.map((n, i) => (
          <span key={n.tel}>
            {i > 0 && ", "}
            <a href={`tel:${n.tel}`} className="hover:underline">
              {n.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  </div>
);
}