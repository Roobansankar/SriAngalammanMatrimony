// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminPayments() {
//   const [payments, setPayments] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   /* ================= FETCH ================= */

//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_BASE || ""}/api/payment/admin/payments`,
//       );

//       setPayments(res.data);
//       setFiltered(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SEARCH ================= */

//   useEffect(() => {
//     const s = search.toLowerCase();

//     const f = payments.filter(
//       (p) =>
//         p.MatriID?.toLowerCase().includes(s) ||
//         p.Name?.toLowerCase().includes(s),
//     );

//     setFiltered(f);
//   }, [search, payments]);

//   /* ================= UI ================= */

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

//       {/* 🔎 SEARCH */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by Name or MatriID..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border p-2 rounded w-full md:w-80"
//         />
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="overflow-auto">
//           <table className="w-full border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Order ID</th>
//                 <th className="p-2 border">MatriID</th>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">Plan</th>
//                 <th className="p-2 border">Amount</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Created At</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="p-4 text-center">
//                     No payments found
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((p, i) => (
//                   <tr key={i} className="text-center">
//                     <td className="p-2 border">{p.order_id}</td>

//                     <td className="p-2 border">{p.MatriID || "-"}</td>

//                     <td className="p-2 border">{p.Name || "-"}</td>

//                     <td className="p-2 border">{p.email}</td>

//                     <td className="p-2 border capitalize">{p.plan}</td>

//                     <td className="p-2 border">₹{p.amount}</td>

//                     <td className="p-2 border">
//                       <span
//                         className={`px-2 py-1 rounded text-white text-sm ${
//                           p.status === "Success"
//                             ? "bg-green-500"
//                             : p.status === "Pending"
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                         }`}
//                       >
//                         {p.status}
//                       </span>
//                     </td>

//                     <td className="p-2 border">
//                       {new Date(p.created_at).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE || ""}/api/payment/admin/payments`,
      );
      setPayments(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = search.toLowerCase();
    const f = payments.filter(
      (p) =>
        p.MatriID?.toLowerCase().includes(s) ||
        p.Name?.toLowerCase().includes(s) ||
        p.order_id?.toLowerCase().includes(s),
    );
    setFiltered(f);
  }, [search, payments]);

  // Helper to style status badges
  const getStatusStyle = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Payment Transactions
          </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Name, ID, or Order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-4 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW (Visible on md and up) */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-md border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 font-semibold uppercase text-sm">
                      S.No
                    </th>
                    <th className="p-4 font-semibold uppercase text-sm">
                      Order ID
                    </th>
                    <th className="p-4 font-semibold uppercase text-sm">
                      Member
                    </th>
                    <th className="p-4 font-semibold uppercase text-sm">
                      Plan
                    </th>
                    <th className="p-4 font-semibold uppercase text-sm">
                      Amount
                    </th>
                    <th className="p-4 font-semibold uppercase text-sm">
                      Status
                    </th>
                    <th className="p-4 font-semibold uppercase text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-10 text-center text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p, i) => (
                      <tr
                        key={p.order_id || i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-600 font-medium">
                          {i + 1}
                        </td>
                        <td className="p-4 text-sm font-mono text-blue-600">
                          {p.order_id}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-800">
                            {p.Name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.MatriID || "No ID"}
                          </div>
                        </td>
                        <td className="p-4 capitalize text-gray-700">
                          {p.plan}
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          ₹{p.amount}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW (Visible on small screens) */}
            <div className="md:hidden space-y-4">
              {filtered.map((p, i) => (
                <div
                  key={p.order_id || i}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative"
                >
                  <div className="absolute top-4 right-4 text-xs font-bold text-gray-300">
                    #{i + 1}
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {p.Name || "Unknown"}
                      </h3>
                      <p className="text-sm text-blue-600 font-mono">
                        {p.order_id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Plan</p>
                      <p className="font-medium capitalize">{p.plan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Amount</p>
                      <p className="font-bold text-green-600">₹{p.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">MatriID</p>
                      <p className="font-medium text-gray-700">
                        {p.MatriID || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Date</p>
                      <p className="font-medium text-gray-700 text-sm">
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center py-10 text-gray-500">
                  No records found
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}