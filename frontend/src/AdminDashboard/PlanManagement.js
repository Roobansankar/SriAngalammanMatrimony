import axios from "axios";
import {
    AlertTriangle,
    Check,
    ChevronLeft,
    ChevronRight,
    Crown,
    RefreshCw,
    Search,
    UserCircle
} from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "";

export default function PlanManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // Modal & Toast State
  const [modal, setModal] = useState({ show: false, title: "", message: "", onConfirm: null, isDestructive: false });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchMembers = () => {
    setLoading(true);
    // Reuse all-members endpoint but we can filter further client-side or assume admin sees all
    console.log('PlanManagement: using API base', API || window.__RESOLVED_API_BASE__ || window.location.origin);
    axios
      .get(`${API}/api/admin/all-members?page=${page}&search=${search}`)
      .then((res) => {
        if (res.data.success) {
          // We need the 'Plan' field which might not be in the default 'all-members' select list?
          // Let's verify 'all-members' query in backend. 
          // The 'all-members' query in admin.js DOES NOT fetch 'Plan' by default in the SELECT list.
          // Wait, I should check that. 
          // Checking previous read_file of admin.js...
          // SELECT MatriID, Name, Gender, ConfirmEmail... Photo1Approve FROM register...
          // 'Plan' is NOT selected. 
          // I should update the backend 'all-members' query to include 'Plan' or make a new endpoint.
          // Or I can use 'new-members' which has Plan? No, that's only pending.
          // Let's stick to updating the backend query first, it's safer.
          // Actually, I can just update the backend query for 'all-members' to include 'Plan'.
          // But wait, the user asked to add a new sidebar option.
          // I will use the data I get. If Plan is missing, I might need to fetch it or update backend.
          // Let's assume I will update the backend `all-members` route to include `Plan` first.
          setMembers(res.data.results);
          setTotal(res.data.total);
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("Failed to load members", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const handleUpdatePlan = (member, newPlan) => {
    if (member.Plan === newPlan) return;

    setModal({
      show: true,
      title: "Change Membership Plan",
      message: `Are you sure you want to change ${member.Name}'s plan from ${member.Plan || 'Basic'} to ${newPlan}?`,
      isDestructive: false,
      onConfirm: async () => {
        setProcessing(true);
        try {
          const res = await axios.put(`${API}/api/admin/member/${member.MatriID}/plan`, { plan: newPlan });
          if (res.data.success) {
            showToast(`Plan updated to ${newPlan}`, "success");
            fetchMembers(); // Refresh list to see updated plan (if backend returns it)
          }
        } catch (err) {
          console.error(err);
          showToast(err.response?.data?.message || "Failed to update plan", "error");
        } finally {
          setProcessing(false);
          setModal({ show: false, title: "", message: "", onConfirm: null });
        }
      }
    });
  };

  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "error" ? <AlertTriangle size={20} /> : <Check size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <h3 className={`text-xl font-bold mb-2 text-gray-800`}>
                {modal.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {modal.message}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModal({ show: false, title: "", message: "", onConfirm: null })}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={modal.onConfirm}
                  disabled={processing}
                  className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-sm transition-colors flex items-center gap-2 bg-rose-500 hover:bg-rose-600`}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Plan Management
            </h1>
            <p className="text-gray-500 text-sm">
              Upgrade or downgrade user membership plans
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMembers}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, MatriID, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">
              Members ({total})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading...
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <UserCircle size={48} className="mx-auto mb-3 opacity-50" />
              <p>No members found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Member</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map((m) => (
                      <tr key={m.MatriID} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {m.PhotoURL && !m.PhotoURL.includes("nophoto") ? (
                              <img
                                src={m.PhotoURL}
                                alt={m.Name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.Gender === "Male" ? "bg-blue-100" : "bg-pink-100"}`}>
                                <UserCircle size={20} className={m.Gender === "Male" ? "text-blue-500" : "text-pink-500"} />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{m.Name}</p>
                              <p className="text-xs text-gray-500">{m.MatriID}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                            m.Plan === "premium" 
                              ? "bg-amber-100 text-amber-700 border border-amber-200" 
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}>
                            {m.Plan || "Basic"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {m.Plan === "premium" ? (
                            <button
                              onClick={() => handleUpdatePlan(m, "basic")}
                              className="text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                            >
                              Downgrade to Basic
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdatePlan(m, "premium")}
                              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto transition"
                            >
                              <Crown size={14} />
                              Upgrade to Premium
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 rounded border border-gray-200 disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded text-sm font-medium ${
                        page === num
                          ? "bg-rose-500 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className="p-2 rounded border border-gray-200 disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
