// import React, { useState } from "react";
// import axios from "axios";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
//   const [otp, setOtp] = useState("");
//   const [newPass, setNewPass] = useState("");

//   const sendOtp = async () => {
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/send-otp`,
//       { email }
//     );
//     if (res.data.success) setStep(2);
//     else alert(res.data.message);
//   };

//   const verifyOtp = async () => {
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/verify-otp`,
//       { email, otp }
//     );
//     if (res.data.success) setStep(3);
//     else alert(res.data.message);
//   };

//   const resetPassword = async () => {
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/reset-password`,
//       {
//         email,
//         newPassword: newPass,
//       }
//     );

//     if (res.data.success) {
//       alert("Password changed successfully");
//       window.location.href = "/login";
//     } else {
//       alert(res.data.message);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto font-display">
//       <h2 className="text-2xl font-bold mb-4 mt-32">Forgot Password</h2>

//       {step === 1 && (
//         <>
//           <input
//             className="border p-2 w-full"
//             placeholder="Enter registered email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button
//             onClick={sendOtp}
//             className="mt-3 bg-pink-600 text-white px-4 py-2 rounded"
//           >
//             Send OTP
//           </button>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <input
//             className="border p-2 w-full"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button
//             onClick={verifyOtp}
//             className="mt-3 bg-pink-600 text-white px-4 py-2 rounded"
//           >
//             Verify OTP
//           </button>
//         </>
//       )}

//       {step === 3 && (
//         <>
//           <input
//             className="border p-2 w-full"
//             placeholder="Enter new password"
//             type="password"
//             value={newPass}
//             onChange={(e) => setNewPass(e.target.value)}
//           />
//           <button
//             onClick={resetPassword}
//             className="mt-3 bg-pink-600 text-white px-4 py-2 rounded"
//           >
//             Change Password
//           </button>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ---------------- SEND OTP ----------------
  const sendOtp = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/send-otp`,
        { email }
      );

      if (res.data.success) {
        setMsg("OTP sent to your email ✔️");
        setStep(2);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to send OTP");
    }

    setLoading(false);
  };

  // ---------------- VERIFY OTP ----------------
  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/verify-otp`,
        { email, otp }
      );

      if (res.data.success) {
        setMsg("OTP verified successfully ✔️");
        setStep(3);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("OTP verification failed");
    }

    setLoading(false);
  };

  // const verifyOtp = async () => {
  //   setLoading(true);
  //   setError("");
  //   setMsg("");

  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/verify-otp`,
  //       { email, otp }
  //     );

  //     if (res.data.success) {
  //       setMsg("OTP verified successfully ✔️");

  //       // Redirect after short delay
  //       setTimeout(() => {
  //         window.location.href = "/login";
  //       }, 1200);
  //     } else {
  //       setError(res.data.message);
  //     }
  //   } catch (err) {
  //     setError("OTP verification failed");
  //   }

  //   setLoading(false);
  // };


  // ---------------- RESET PASSWORD ----------------
  const resetPassword = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/forgot-password/reset-password`,
        { email, newPassword: newPass }
      );

      if (res.data.success) {
        setMsg("Password changed successfully ✔️");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to update password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-amber-50 px-4 py-10 font-display">
      <div className="bg-white shadow-2xl border border-pink-200 rounded-3xl p-10 w-full max-w-lg text-center mt-14">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Forgot Password 🔐
        </h2>
        <p className="text-gray-600 mb-8">
          Reset your{" "}
          <span className="text-pink-600 font-semibold">Matrimony</span>{" "}
          password
        </p>

        {/* SUCCESS */}
        {msg && <p className="text-green-600 text-sm mb-3">{msg}</p>}

        {/* ERROR */}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        {/* STEP 1: ENTER EMAIL */}
        {step === 1 && (
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Enter Registered Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-lg font-semibold hover:scale-105 hover:shadow-md transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 2 && (
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Enter OTP from Email
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-lg font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Enter New Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                placeholder="New password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-lg font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
