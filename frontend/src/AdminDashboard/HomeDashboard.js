

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function HomeDashboard() {
//   const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

//   const [stats, setStats] = useState({
//     totalCount: 0,
//     maleCount: 0,
//     femaleCount: 0,
//   });

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${API}/api/admin/dashboard-stats`);
//       if (res.data.success) {
//         setStats(res.data.data);
//       }
//     } catch (err) {
//       console.error("Dashboard Error:", err);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* 2 Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* Total Members */}
//         <div
//           className="p-5 text-white rounded shadow"
//           style={{ background: "#3498db" }}
//         >
//           <h2 className="text-4xl font-bold">{stats.totalCount}</h2>
//           <p className="text-lg">Total Members</p>
//         </div>

//         {/* Male & Female Members */}
//         <div
//           className="p-5 text-white rounded shadow"
//           style={{ background: "#9b59b6" }}
//         >
//           <h2 className="text-xl font-bold">Male: {stats.maleCount}</h2>
//           <h2 className="text-xl font-bold mt-2">
//             Female: {stats.femaleCount}
//           </h2>
//           <p className="mt-3 text-sm underline">View Details →</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMale, FaFemale, FaUsers } from "react-icons/fa";

export default function HomeDashboard() {
  const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [stats, setStats] = useState({
    totalCount: 0,
    maleCount: 0,
    femaleCount: 0,
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = currentUser?.username || "";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard-stats`);
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* WELCOME HEADER */}
      <h1 className="text-3xl font-extrabold mb-1">
        Welcome, <span className="text-blue-600">{username}</span> 👋
      </h1>

      <p className="mb-6 text-gray-600 text-[15px] tracking-wide">
        Manage your Matrimony admin panel today 🚀
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Male Members */}
        <div
          className="p-6 text-white rounded-xl shadow-lg flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #16a085 0%, #1abc9c 100%)",
          }}
        >
          <div>
            <p className="text-lg font-semibold">Male Members</p>
            <h2 className="text-4xl font-bold mt-2">{stats.maleCount}</h2>
          </div>
          <FaMale size={50} className="opacity-80" />
        </div>

        {/* Female Members */}
        <div
          className="p-6 text-white rounded-xl shadow-lg flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)",
          }}
        >
          <div>
            <p className="text-lg font-semibold">Female Members</p>
            <h2 className="text-4xl font-bold mt-2">{stats.femaleCount}</h2>
          </div>
          <FaFemale size={50} className="opacity-80" />
        </div>

        {/* Total Members */}
        <div
          className="p-6 text-white rounded-xl shadow-lg flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #2980b9 0%, #3498db 100%)",
          }}
        >
          <div>
            <p className="text-lg font-semibold">Total Members</p>
            <h2 className="text-4xl font-bold mt-2">{stats.totalCount}</h2>
          </div>
          <FaUsers size={50} className="opacity-80" />
        </div>
      </div>
    </div>
  );
}
