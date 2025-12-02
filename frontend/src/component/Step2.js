// import React, { useState } from "react";
// import axios from "axios";
// import { Loader2, MailCheck, RefreshCcw, ArrowLeft } from "lucide-react";

// const API = "http://localhost:5000/api/register";

// export default function Step2({ nextStep, prevStep, formData }) {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);

//   const handleVerify = async () => {
//     if (!otp) return alert("Please enter the OTP.");
//     try {
//       setLoading(true);
//       await axios.post(`${API}/verify-otp`, {
//         email: formData.email,
//         otp,
//       });
//       alert("OTP verified successfully!");
//       nextStep({ otpVerified: true });
//     } catch (e) {
//       console.error(e?.response?.data || e);
//       alert("Invalid or expired OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resend = async () => {
//     try {
//       setResending(true);
//       await axios.post(`${API}/send-otp`, { email: formData.email });
//       alert("A new OTP has been sent to your email.");
//     } catch (e) {
//       console.error(e?.response?.data || e);
//       alert("Failed to resend OTP.");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center mt-12">
//       {/* Header */}
//       <div className="flex flex-col items-center mb-4 ml">
//         <MailCheck className="w-10 h-10 text-rose-600 mb-2" />
//         <h3 className="text-2xl font-bold text-rose-700 mb-1">
//           Verify Your Email
//         </h3>
//         <p className="text-sm text-gray-600">
//           We’ve sent a 6-digit OTP to your email:
//         </p>
//         <p className="text-sm font-semibold text-gray-800 mt-1">
//           {formData.email}
//         </p>
//       </div>

//       {/* OTP Input */}
//       <input
//         placeholder="Enter OTP"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         maxLength={6}
//         className="border text-center text-lg tracking-widest p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-rose-400 outline-none"
//       />

//       {/* Buttons */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
//         <button
//           onClick={prevStep}
//           className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </button>

//         <button
//           onClick={handleVerify}
//           disabled={loading}
//           className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 w-full sm:w-auto"
//         >
//           {loading ? (
//             <>
//               <Loader2 className="animate-spin w-4 h-4" /> Verifying...
//             </>
//           ) : (
//             "Verify OTP →"
//           )}
//         </button>
//       </div>

//       {/* Resend link */}
//       <div className="mt-6">
//         <button
//           onClick={resend}
//           disabled={resending}
//           type="button"
//           className="flex items-center justify-center gap-2 text-sm text-rose-600 font-semibold hover:text-rose-700 mx-auto"
//         >
//           <RefreshCcw className="w-4 h-4" />
//           {resending ? "Resending..." : "Resend OTP"}
//         </button>
//       </div>

//       {/* Footer */}
//       <p className="text-xs text-gray-500 mt-4">
//         Didn’t get the email? Check your spam folder.
//       </p>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { Loader2, MailCheck, RefreshCcw, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000/api/register";

export default function Step2({ nextStep, prevStep, formData }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp) return alert("Please enter the OTP.");
    try {
      setLoading(true);
      await axios.post(`${API}/verify-otp`, {
        email: formData.email,
        otp,
      });
      alert("OTP verified successfully!");
      nextStep({ otpVerified: true });
    } catch (e) {
      console.error(e?.response?.data || e);
      alert("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setResending(true);
      await axios.post(`${API}/send-otp`, { email: formData.email });
      alert("A new OTP has been sent to your email.");
    } catch (e) {
      console.error(e?.response?.data || e);
      alert("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    // Full-screen wrapper that centers the card
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <MailCheck className="w-10 h-10 text-rose-600 mb-2" />
          <h3 className="text-2xl font-bold text-rose-700 mb-1">
            Verify Your Email
          </h3>
          <p className="text-sm text-gray-600">
            We’ve sent a 6-digit OTP to your email:
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {formData.email}
          </p>
        </div>

        {/* OTP Input */}
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            // accept numbers only
            const val = e.target.value.replace(/\D/g, "");
            setOtp(val.slice(0, 6));
          }}
          maxLength={6}
          inputMode="numeric"
          pattern="\d{6}"
          aria-label="Enter 6 digit OTP"
          className="border text-center text-lg tracking-widest p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-rose-400 outline-none"
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <button
            onClick={prevStep}
            className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 w-full sm:w-auto"
            type="button"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Verifying...
              </>
            ) : (
              "Verify OTP →"
            )}
          </button>
        </div>

        {/* Resend link */}
        <div className="mt-6">
          <button
            onClick={resend}
            disabled={resending}
            type="button"
            className="flex items-center justify-center gap-2 text-sm text-rose-600 font-semibold hover:text-rose-700 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-4">
          Didn’t get the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
