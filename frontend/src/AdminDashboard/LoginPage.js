import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

   const Api = "http://localhost:5000";


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
        })
      );

      // Directly go to the correct dashboard route
      navigate("/admin/homedashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin/homedashboard", { replace: true });
  }, [navigate]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative Bag Logo */}
        <div className="absolute -top-10 -right-10 bg-yellow-400 w-32 h-32 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute -bottom-10 -left-10 bg-orange-400 w-32 h-32 rounded-full blur-2xl opacity-40"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-700">
            Sri AngalammannMatrimony
          </h1>
          <p className="text-gray-600 mt-1">Admin Login Portal</p>
        </div>

        <div className="mb-5">
          <label
            className="block text-sm font-semibold text-gray-700 mb-1"
            htmlFor="username"
          >
            Admin Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
            className="w-full px-4 py-2 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-semibold text-gray-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold shadow-md transition duration-300"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
}
