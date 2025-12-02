// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate, Link } from "react-router-dom";

// const API_URL = "http://localhost/matrimony2/login_submit.php";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     txtusername: "",
//     txtpassword: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.txtusername || !form.txtpassword) {
//       toast.error("Please enter both fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("txtusername", form.txtusername);
//       formData.append("txtpassword", form.txtpassword);

//       const res = await axios.post(API_URL, formData, {
//         withCredentials: true,
//       });

//       const data = res.data;
//       if (data.status === "success") {
//         toast.success("Login successful!");

//         const step = data.reg_step;
//         const matriid = data.MatriID;

//         switch (step) {
//           case "1":
//             navigate(`/register_success/${matriid}`);
//             break;
//           case "2":
//             navigate(`/horoscope/${matriid}`);
//             break;
//           case "3":
//             navigate(`/contact/${matriid}`);
//             break;
//           case "4":
//             navigate(`/education_site/${matriid}`);
//             break;
//           case "5":
//             navigate(`/physical/${matriid}`);
//             break;
//           case "6":
//             navigate(`/family/${matriid}`);
//             break;
//           case "7":
//             navigate(`/upload_photo/${matriid}`);
//             break;
//           case "8":
//             navigate(`/upload_idproof/${matriid}`);
//             break;
//           case "9":
//             navigate(`/partner_preference/${matriid}`);
//             break;
//           default:
//             navigate(`/pageloader1`);
//         }
//       } else if (data.status === "otp_verify") {
//         toast("Please verify OTP before login");
//         navigate("/verify-otp");
//       } else {
//         toast.error("Wrong Username or Password");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Login failed. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-amber-50 px-4 py-10 font-display ">
//       <div className="bg-white shadow-2xl border border-pink-200 rounded-3xl p-10 w-full max-w-lg text-center">
//         {/* Header */}
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">
//           Welcome Back 👋
//         </h2>
//         <p className="text-gray-600 mb-8">
//           Login to your{" "}
//           <span className="text-pink-600 font-semibold">Matrimony</span> account
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6 text-left">
//           {/* Username */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">
//               Email / Username / Mobile No.
//             </label>
//             <input
//               type="text"
//               name="txtusername"
//               value={form.txtusername}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
//               placeholder="Enter your username"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               name="txtpassword"
//               value={form.txtpassword}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-between text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-pink-600 hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-lg font-semibold hover:scale-105 hover:shadow-md transition-all duration-300"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           {/* Register Link */}
//           <p className="text-center text-gray-700 mt-6">
//             Don’t have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-pink-600 font-semibold hover:underline"
//             >
//               Create New Account
//             </Link>
//           </p>
//         </form>

//         {/* Footer */}
//         <p className="text-xs text-gray-500 mt-8">
//           By logging in, you agree to our{" "}
//           <Link to="/terms" className="text-pink-600 hover:underline">
//             Terms & Conditions
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// export default function LoginPage() {
//   const [form, setForm] = useState({
//     txtusername: "",
//     txtpassword: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("This is just a UI demo. API not connected yet!");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-amber-50 px-4 py-10 font-display">
//       <div className="bg-white shadow-2xl border border-pink-200 rounded-3xl p-10 w-full max-w-lg text-center">
//         {/* Header */}
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">
//           Welcome Back 👋
//         </h2>
//         <p className="text-gray-600 mb-8">
//           Login to your{" "}
//           <span className="text-pink-600 font-semibold">Matrimony</span> account
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6 text-left">
//           {/* Username */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">
//               Email / Username / Mobile No.
//             </label>
//             <input
//               type="text"
//               name="txtusername"
//               value={form.txtusername}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
//               placeholder="Enter your username"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               name="txtpassword"
//               value={form.txtpassword}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-between text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-pink-600 hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-lg font-semibold hover:scale-105 hover:shadow-md transition-all duration-300"
//           >
//             Login
//           </button>

//           {/* Register Link */}
//           <p className="text-center text-gray-700 mt-6">
//             Don’t have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-pink-600 font-semibold hover:underline"
//             >
//               Create New Account
//             </Link>
//           </p>
//         </form>

//         {/* Footer */}
//         <p className="text-xs text-gray-500 mt-8">
//           By logging in, you agree to our{" "}
//           <Link to="/terms" className="text-pink-600 hover:underline">
//             Terms & Conditions
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// export default function LoginPage() {
export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({
    txtusername: "",
    txtpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        email: form.txtusername,
        password: form.txtpassword,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload
      );

      if (res.data?.success) {
        localStorage.setItem("loggedInEmail", payload.email);
        localStorage.setItem("userData", JSON.stringify(res.data.user || {}));
        setUser(res.data.user); // 👈 add this line
        navigate("/profile");
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Login error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-amber-50 px-4 py-10 font-display">
      <div className="bg-white shadow-2xl border border-pink-200 rounded-3xl p-10 w-full max-w-lg text-center mt-14">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-gray-600 mb-8">
          Login to your{" "}
          <span className="text-pink-600 font-semibold">Matrimony</span> account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email / Username / Mobile No.
            </label>
            <input
              type="text"
              name="txtusername"
              value={form.txtusername}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              name="txtpassword"
              value={form.txtpassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-pink-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-lg font-semibold hover:scale-105 hover:shadow-md transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-700 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-600 font-semibold hover:underline"
            >
              Create New Account
            </Link>
          </p>
        </form>

        <p className="text-xs text-gray-500 mt-8">
          By logging in, you agree to our{" "}
          <Link to="/terms" className="text-pink-600 hover:underline">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}
