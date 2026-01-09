

// src/pages/LoginPage.jsx
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({
    txtusername: "",
    txtpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
        setUser(res.data.user);
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
              Email
            </label>
            <input
              type="text"
              name="txtusername"
              value={form.txtusername}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="txtpassword"
                value={form.txtpassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye Off (password hidden)
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye (password visible)
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
            Don't have an account?{" "}
            <Link
              to="/register/step/1"
              className="text-pink-600 font-semibold hover:underline"
            >
              Create New Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}