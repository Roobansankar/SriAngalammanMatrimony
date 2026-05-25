import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Date Filtering States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let result = [...payments];

    // 1. Search Filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.MatriID?.toLowerCase().includes(s) ||
          p.Name?.toLowerCase().includes(s) ||
          p.order_id?.toLowerCase().includes(s) ||
          p.email?.toLowerCase().includes(s) ||
          p.Mobile?.toLowerCase().includes(s),
      );
    }

    // 2. Date Range Filter
    if (startDate) {
      result = result.filter(
        (p) => new Date(p.created_at) >= new Date(startDate),
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the whole end day
      result = result.filter((p) => new Date(p.created_at) <= end);
    }

    setFiltered(result);
  }, [search, payments, startDate, endDate]);

  /* ================= CALCULATIONS ================= */
  const totalSuccessAmount = filtered
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  /* ================= DATE HELPERS ================= */
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB"); // Returns DD/MM/YYYY
  };

  const setQuickFilter = (type) => {
    const now = new Date();
    if (type === "today") {
      const today = now.toISOString().split("T")[0];
      setStartDate(today);
      setEndDate(today);
    } else if (type === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
      setStartDate(firstDay);
      setEndDate(lastDay);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

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

  /* ================= DELETE ================= */
  const deletePayment = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE || ""}/api/payment/admin/payments/${orderId}`,
      );

      fetchPayments(); // refresh list
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= TOGGLE STATUS ================= */
  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Success" ? "Pending" : "Success";

    const confirmChange = window.confirm(
      `Are you sure you want to change status from ${currentStatus} to ${newStatus}?`,
    );

    if (!confirmChange) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE || ""}/api/payment/admin/payments/${orderId}/status`,
        { status: newStatus },
      );

      fetchPayments(); // refresh
    } catch (err) {
      alert("Status update failed");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* HEADER & TOTAL CARD */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h2 className="text-gray-500">
              Manage and track all member payments
            </h2>
          </div>

          <div className="bg-white border-l-4 border-green-500 shadow-sm p-4 rounded-lg w-full lg:w-72">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              Total Success Revenue
            </p>
            <p className="text-2xl font-black text-gray-900">
              ₹{totalSuccessAmount.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Based on current filters
            </p>
          </div>
        </div>

        {/* FILTERS SECTION */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                Search Records
              </label>
              <input
                type="text"
                placeholder="Name, ID, or Order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Date From */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Date To */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setQuickFilter("today")}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded font-bold transition"
            >
              TODAY
            </button>
            <button
              onClick={() => setQuickFilter("month")}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded font-bold transition"
            >
              THIS MONTH
            </button>
            <button
              onClick={() => setQuickFilter("all")}
              className="px-3 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded font-bold transition"
            >
              RESET
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            {/* <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-md border border-gray-200"> */}
            {/* Added overflow-x-auto to handle horizontal table scroll on smaller desktops */}
            <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="p-4 font-semibold uppercase text-xs">
                          S.No
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Order ID
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Email
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Mobile Number
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Member Details
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Plan
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Amount
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs">
                          Status
                        </th>
                        <th className="p-4 font-semibold uppercase text-xs text-right">
                          Date
                        </th>

                        <th className="p-4 font-semibold uppercase text-xs text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan="10"
                            className="p-10 text-center text-gray-500"
                          >
                            No matching records found
                          </td>
                        </tr>
                      ) : (
                        filtered.map((p, i) => (
                          <tr
                            key={p.order_id || i}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-4 text-gray-400 font-medium">
                              {i + 1}
                            </td>
                            <td className="p-4 text-xs font-mono text-blue-600 break-all max-w-[150px]">
                              {p.order_id}
                            </td>
                            <td
                              className="p-4 text-xs text-gray-600 truncate max-w-[200px]"
                              title={p.email}
                            >
                              {p.email}
                            </td>
                            <td className="p-4 text-xs text-gray-600">
                              {p.Mobile || "N/A"}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-800 leading-none">
                                {p.Name || "N/A"}
                              </div>
                              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                                {p.MatriID || "No ID"}
                              </div>
                            </td>
                            <td className="p-4 capitalize text-sm text-gray-700 font-semibold">
                              {p.plan}
                            </td>
                            <td className="p-4 font-bold text-gray-900">
                              ₹{p.amount}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusStyle(p.status)}`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-600 font-medium text-right">
                              {formatDate(p.created_at)}
                            </td>
                            <td className="p-4 text-center space-x-2">
                              <button
                                onClick={() =>
                                  toggleStatus(p.order_id, p.status)
                                }
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded font-bold hover:bg-blue-200 transition"
                              >
                                Toggle
                              </button>

                              <button
                                onClick={() => deletePayment(p.order_id)}
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded font-bold hover:bg-red-200 transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* MOBILE CARD VIEW */}
            {/* <div className="md:hidden space-y-4"> */}
            <div className="md:hidden space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {filtered.map((p, i) => (
                <div
                  key={p.order_id || i}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative"
                >
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-300">
                    #{i + 1}
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 leading-tight">
                        {p.Name || "Unknown"}
                      </h3>
                      <p className="text-xs text-blue-600 font-mono">
                        {p.order_id}
                      </p>
                      <p className="text-xs text-gray-500">{p.email}</p>
                      <p className="text-xs text-gray-500 font-bold">
                        {p.Mobile || "No Mobile"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Plan / Amount
                      </p>
                      <p className="text-sm font-bold text-gray-700 capitalize">
                        {p.plan} - ₹{p.amount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Paid On
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(p.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => toggleStatus(p.order_id, p.status)}
                      className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded font-bold"
                    >
                      Toggle Status
                    </button>

                    <button
                      onClick={() => deletePayment(p.order_id)}
                      className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-700 rounded font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}