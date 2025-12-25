// src/pages/LoginPage.jsx
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        `${process.env.REACT_APP_API_BASE || ""}/api/auth/login`,
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
              to="/register/step/1"
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
