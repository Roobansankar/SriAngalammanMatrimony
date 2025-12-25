import axios from "axios";
import {
    AlertTriangle,
    Ban,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Eye,
    EyeOff,
    Filter,
    RefreshCw,
    Save,
    Search,
    Trash2,
    UserCircle,
    X,
    UserCheck
} from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function NewMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [modal, setModal] = useState({ show: false, title: "", message: "", onConfirm: null });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';

  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  const fetchMembers = () => {
    setLoading(true);
    // Use the new endpoint for pending members
    axios
      .get(`${API}/api/admin/new-members?page=${page}&search=${search}`)
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.results);
          setTotal(res.data.total);
        }
      })
      .catch((err) => console.error(err))
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

  const viewMember = async (matriId) => {
    try {
      const res = await axios.get(`${API}/api/admin/profile/${matriId}`);
      if (res.data.success) {
        setSelectedMember(res.data.user);
        setEditData(res.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching member:", err);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editData || !selectedMember) return;
    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/admin/member/${selectedMember.MatriID}`, editData);
      if (res.data.success) {
        setSelectedMember(editData);
        setIsEditing(false);
        fetchMembers();
        showToast("Member updated successfully!", "success");
      }
    } catch (err) {
      console.error("Error saving:", err);
      showToast("Error saving changes: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = (matriId) => {
    setModal({
      show: true,
      title: "Verify Member",
      message: "Are you sure you want to verify this user? They will become Active and visible to everyone.",
      onConfirm: async () => {
        setProcessing(true);
        try {
          const res = await axios.put(`${API}/api/admin/member/${matriId}/status`, { status: "Active" });
          if (res.data.success) {
            showToast("Member verified successfully!", "success");
            fetchMembers(); // Refresh list
            if (selectedMember?.MatriID === matriId) {
              setSelectedMember(null); // Deselect as they might disappear from this list
            }
          }
        } catch (err) {
          console.error("Error verifying:", err);
          showToast("Error verifying member", "error");
        } finally {
          setProcessing(false);
          setModal({ show: false, title: "", message: "", onConfirm: null });
        }
      }
    });
  };

  const handleDelete = (matriId) => {
    setModal({
      show: true,
      title: "Delete Member",
      message: "Are you sure you want to delete this user? This cannot be undone.",
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/api/admin/member/${matriId}`);
          if (res.data.success) {
            fetchMembers();
            if (selectedMember?.MatriID === matriId) {
              setSelectedMember(null);
            }
            showToast("Member deleted successfully", "success");
          }
        } catch (err) {
          console.error("Error deleting:", err);
          showToast("Error deleting member", "error");
        } finally {
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
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .horoscope-grid-cell {
          aspect-ratio: 1;
          min-height: 60px;
        }
      `}</style>

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
              <h3 className={`text-xl font-bold mb-2 ${modal.isDestructive ? 'text-red-600' : 'text-gray-800'}`}>
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
                  className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-sm transition-colors flex items-center gap-2 ${
                    modal.isDestructive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
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
              New Members (Pending)
            </h1>
            <p className="text-gray-500 text-sm">
              Verify new registrations manually
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  Pending Members ({total})
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
                  <p>No new members to verify</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Member</th>
                          <th className="px-4 py-3 text-left">Contact</th>
                          <th className="px-4 py-3 text-left">Registered</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {members.map((m) => (
                          <tr
                            key={m.MatriID}
                            className={`hover:bg-gray-50 cursor-pointer ${
                              selectedMember?.MatriID === m.MatriID
                                ? "bg-rose-50"
                                : ""
                            }`}
                            onClick={() => viewMember(m.MatriID)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {m.PhotoURL &&
                                !m.PhotoURL.includes("nophoto") ? (
                                  <img
                                    src={m.PhotoURL}
                                    alt={m.Name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                      m.Gender === "Male"
                                        ? "bg-blue-100"
                                        : "bg-pink-100"
                                    }`}
                                  >
                                    <UserCircle
                                      size={20}
                                      className={
                                        m.Gender === "Male"
                                          ? "text-blue-500"
                                          : "text-pink-500"
                                      }
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {m.Name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {m.MatriID} • {m.Gender}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-gray-700">
                                {m.Mobile || "-"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {m.Email || "-"}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {m.Regdate ? new Date(m.Regdate).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerify(m.MatriID);
                                  }}
                                  className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded"
                                  title="Verify & Activate"
                                  disabled={processing}
                                >
                                  <UserCheck size={16} />
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(m.MatriID);
                                    }}
                                    className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Showing {(page - 1) * perPage + 1} to{" "}
                      {Math.min(page * perPage, total)} of {total}
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

          {/* Member Details / Edit Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-4">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {selectedMember
                    ? isEditing
                      ? "Edit Member"
                      : "Member Details"
                    : "Select a Member"}
                </h2>
                {selectedMember && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm disabled:opacity-50"
                        >
                          <Save size={14} />
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditData(selectedMember);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>

              {selectedMember ? (
                <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
                  {/* Photo & Basic Info */}
                  <div className="text-center mb-4">
                    {selectedMember.PhotoURL &&
                    !selectedMember.PhotoURL.includes("nophoto") ? (
                      <img
                        src={selectedMember.PhotoURL}
                        alt={selectedMember.Name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                      />
                    ) : (
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          selectedMember.Gender === "Male"
                            ? "bg-blue-100"
                            : "bg-pink-100"
                        }`}
                      >
                        <UserCircle
                          size={48}
                          className={
                            selectedMember.Gender === "Male"
                              ? "text-blue-500"
                              : "text-pink-500"
                          }
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-lg">{selectedMember.Name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedMember.MatriID}
                    </p>
                    <div className="mt-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                            {selectedMember.Status}
                        </span>
                    </div>
                  </div>

                   {/* Quick Verify Button in Details Panel */}
                   {!isEditing && (
                      <div className="mb-4">
                        <button
                          onClick={() => handleVerify(selectedMember.MatriID)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                        >
                          <UserCheck size={18} />
                          Verify & Activate
                        </button>
                      </div>
                    )}

                  {/* Edit Form */}
                  <div className="space-y-3">
                    <EditField
                      label="Name"
                      field="Name"
                      value={isEditing ? editData.Name : selectedMember.Name}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                     <EditField
                      label="Plan"
                      field="Plan"
                      value={isEditing ? editData.Plan : selectedMember.Plan}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Email"
                      field="ConfirmEmail"
                      value={
                        isEditing
                          ? editData.ConfirmEmail
                          : selectedMember.ConfirmEmail
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Mobile"
                      field="Mobile"
                      value={
                        isEditing ? editData.Mobile : selectedMember.Mobile
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Simplified for brevity, same fields as MemberManagement */}
                    <EditField
                      label="Date of Birth"
                      field="DOB"
                      type="date"
                      value={
                        isEditing
                          ? editData.DOB?.slice(0, 10)
                          : selectedMember.DOB?.slice(0, 10)
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                     <EditField
                      label="Address"
                      field="Address"
                      type="textarea"
                      value={
                        isEditing ? editData.Address : selectedMember.Address
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <UserCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Select a member to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EditField({ label, field, value, type = "text", options = [], isEditing, onChange }) {
  if (type === "select") {
    return (
      <div>
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        {isEditing ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Select...</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-800">{value || "-"}</p>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        {isEditing ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
          />
        ) : (
          <p className="text-sm text-gray-800">{value || "-"}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
        />
      ) : (
        <p className="text-sm text-gray-800">{value || "-"}</p>
      )}
    </div>
  );
}
