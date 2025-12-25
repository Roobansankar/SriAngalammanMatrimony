import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const Api = process.env.REACT_APP_API_BASE || "";

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${Api}/api/admin/login`, {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          type: "admin",
          username: data.admin.username,
          id: data.admin.id,
          role: data.admin.role, // Store role
        })
      );

      navigate("/admin/homedashboard", { replace: true });
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin/homedashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Sri Angalamman Matrimony
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Secure Admin Control Panel
          </p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-1">
            Admin Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>

        {/* Password */}
        {/* <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div> */}

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
            >
              {showPassword ? (
                /* Eye Off */
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M3 3l18 18M10.6 10.6a3 3 0 004.24 4.24M9.88 5.08A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-0.64 1.43-1.57 2.7-2.73 3.73M6.61 6.61C4.54 7.86 2.86 9.8 2 12c1.73 3.89 6 7 10 7 1.15 0 2.26-0.26 3.3-0.72"
                  />
                </svg>
              ) : (
                /* Eye */
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg transition-all duration-300"
        >
          Sign In Securely
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Sri Angalamman Matrimony · Admin Access
          Only
        </p>
      </div>
    </div>
  );
}
