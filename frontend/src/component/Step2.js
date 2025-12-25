// import axios from "axios";
// import { ArrowLeft, CheckCircle, Loader2, MailCheck, RefreshCcw } from "lucide-react";
// import { useEffect, useState } from "react";

// const API = (process.env.REACT_APP_API_BASE || "") + "/api/register";

// export default function Step2({ nextStep, prevStep, formData }) {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   // Only set verified if user just verified in THIS session (not from localStorage)
//   const [verified, setVerified] = useState(false);
//   const [countdown, setCountdown] = useState(0);

//   // Countdown timer for resend button
//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const handleVerify = async () => {
//     if (!otp) return alert("Please enter the OTP.");
//     if (otp.length !== 6) return alert("Please enter a valid 6-digit OTP.");
    
//     try {
//       setLoading(true);
//       await axios.post(`${API}/verify-otp`, {
//         email: formData.email,
//         otp,
//       });
//       setVerified(true);
//       // Auto-navigate after 1.5 seconds
//       setTimeout(() => {
//         nextStep({ otpVerified: true });
//       }, 1500);
//     } catch (e) {
//       console.error(e?.response?.data || e);
//       const errorMsg = e?.response?.data?.error || "Invalid or expired OTP. Please try again.";
//       alert(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resend = async () => {
//     try {
//       setResending(true);
//       await axios.post(`${API}/send-otp`, { email: formData.email });
//       alert("A new OTP has been sent to your email.");
//       setCountdown(60); // Start 60 second countdown
//       setOtp(""); // Clear old OTP
//     } catch (e) {
//       console.error(e?.response?.data || e);
//       alert("Failed to resend OTP. Please try again.");
//     } finally {
//       setResending(false);
//     }
//   };

//   // If already verified, show success and auto-navigate
//   if (verified) {
//     return (
//       // <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
//       <div className="flex justify-center pt-2 pb-6">
//         <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center">
//           <div className="flex flex-col items-center mb-4">
//             <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
//             <h3 className="text-2xl font-bold text-green-600 mb-2">
//               Email Verified!
//             </h3>
//             <p className="text-sm text-gray-600">
//               Redirecting to the next step...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
//       <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center">
//         {/* Header */}
//         <div className="flex flex-col items-center mb-4">
//           <MailCheck className="w-10 h-10 text-rose-600 mb-2" />
//           <h3 className="text-2xl font-bold text-rose-700 mb-1">
//             Verify Your Email
//           </h3>
//           <p className="text-sm text-gray-600">
//             We've sent a 6-digit OTP to your email:
//           </p>
//           <p className="text-sm font-semibold text-gray-800 mt-1">
//             {formData.email}
//           </p>
//         </div>

//         {/* OTP Input */}
//         <input
//           placeholder="Enter 6-digit OTP"
//           value={otp}
//           onChange={(e) => {
//             const val = e.target.value.replace(/\D/g, "");
//             setOtp(val.slice(0, 6));
//           }}
//           maxLength={6}
//           inputMode="numeric"
//           pattern="\d{6}"
//           aria-label="Enter 6 digit OTP"
//           className="border text-center text-lg tracking-widest p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-rose-400 outline-none"
//           autoFocus
//         />

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
//           {/* Back button - only show if NOT coming from a verified email state */}
//           {!formData.otpVerified && (
//             <button
//               onClick={prevStep}
//               className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//               type="button"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </button>
//           )}

//           <button
//             onClick={handleVerify}
//             disabled={loading || otp.length !== 6}
//             className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 w-full sm:w-auto"
//             type="button"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin w-4 h-4" /> Verifying...
//               </>
//             ) : (
//               "Verify OTP →"
//             )}
//           </button>
//         </div>

//         {/* Resend link */}
//         <div className="mt-6">
//           <button
//             onClick={resend}
//             disabled={resending || countdown > 0}
//             type="button"
//             className="flex items-center justify-center gap-2 text-sm text-rose-600 font-semibold hover:text-rose-700 mx-auto disabled:text-gray-400 disabled:cursor-not-allowed"
//           >
//             <RefreshCcw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
//             {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
//           </button>
//         </div>

//         {/* Footer */}
//         <p className="text-xs text-gray-500 mt-4">
//           Didn't get the email? Check your spam folder.
//         </p>
//       </div>
//     </div>
//   );
// }


import axios from "axios";
import { ArrowLeft, CheckCircle, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
const API = (process.env.REACT_APP_API_BASE || "") + "/api/register";

export default function Step2({ nextStep, prevStep, formData }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) return alert("Enter valid OTP");

    try {
      setLoading(true);
      await axios.post(`${API}/verify-otp`, {
        email: formData.email,
        otp,
      });
      setVerified(true);
      setTimeout(() => nextStep({ otpVerified: true }), 1500);
    } catch {
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setResending(true);
      await axios.post(`${API}/send-otp`, { email: formData.email });
      setCountdown(60);
      setOtp("");
    } catch {
      alert("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="flex justify-center pt-4 pb-10">
        <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-600">Email Verified</h3>
          <p className="text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-2 pb-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center">
        <MailCheck className="w-10 h-10 text-rose-600 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-rose-700 mb-1">
          Verify Your Email
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          We've sent a 6-digit OTP to
        </p>
        <p className="text-sm font-semibold text-gray-800 mb-4">
          {formData.email}
        </p>

        <input
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          className="border text-center text-lg tracking-widest p-3 rounded-lg w-full mb-4"
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={prevStep} className="px-4 py-2 border rounded-lg">
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back
          </button>

          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="bg-rose-600 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify OTP →"}
          </button>
        </div>

        <button
          onClick={resend}
          disabled={resending || countdown > 0}
          className="mt-5 text-sm text-rose-600 font-semibold"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
