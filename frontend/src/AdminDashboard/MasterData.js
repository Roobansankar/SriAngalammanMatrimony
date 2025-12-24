import axios from "axios";
import {
    AlertTriangle,
    BookOpen,
    ChevronDown,
    Edit3,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function MasterData() {
  const [activeTab, setActiveTab] = useState("religion");
  const [religions, setReligions] = useState([]);
  const [castes, setCastes] = useState([]);
  const [subcastes, setSubcastes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedReligion, setSelectedReligion] = useState("");
  const [selectedCaste, setSelectedCaste] = useState("");

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", religion: "", casteId: "" });
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';

  // Fetch data
  const fetchReligions = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/master/religions`);
      if (res.data.success) setReligions(res.data.data);
    } catch (err) {
      console.error("Error fetching religions:", err);
    }
  };

  const fetchCastes = async (religion = "") => {
    try {
      const url = religion
        ? `${API}/api/admin/master/castes?religion=${encodeURIComponent(religion)}`
        : `${API}/api/admin/master/castes`;
      const res = await axios.get(url);
      if (res.data.success) setCastes(res.data.data);
    } catch (err) {
      console.error("Error fetching castes:", err);
    }
  };

  const fetchSubcastes = async (casteId = "") => {
    try {
      const url = casteId
        ? `${API}/api/admin/master/subcastes?casteId=${casteId}`
        : `${API}/api/admin/master/subcastes`;
      const res = await axios.get(url);
      if (res.data.success) setSubcastes(res.data.data);
    } catch (err) {
      console.error("Error fetching subcastes:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchReligions();
    await fetchCastes(selectedReligion);
    await fetchSubcastes(selectedCaste);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "caste") {
      fetchCastes(selectedReligion);
    }
  }, [selectedReligion, activeTab]);

  useEffect(() => {
    if (activeTab === "subcaste") {
      fetchSubcastes(selectedCaste);
    }
  }, [selectedCaste, activeTab]);

  // Modal handlers
  const openAddModal = () => {
    setModalMode("add");
    setEditItem(null);
    setFormData({ name: "", religion: selectedReligion, casteId: selectedCaste });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditItem(item);
    if (activeTab === "religion") {
      setFormData({ name: item.Religion, religion: "", casteId: "" });
    } else if (activeTab === "caste") {
      setFormData({ name: item.Caste, religion: item.Religion, casteId: "" });
    } else {
      setFormData({ name: item.Subcaste, religion: "", casteId: item.CasteID });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    setSaving(true);
    try {
      let res;
      if (activeTab === "religion") {
        if (modalMode === "add") {
          res = await axios.post(`${API}/api/admin/master/religions`, { religion: formData.name });
        } else {
          res = await axios.put(`${API}/api/admin/master/religions/${editItem.ID}`, { religion: formData.name });
        }
        if (res.data.success) {
          await fetchReligions();
        }
      } else if (activeTab === "caste") {
        if (!formData.religion) {
          alert("Please select a religion");
          setSaving(false);
          return;
        }
        if (modalMode === "add") {
          res = await axios.post(`${API}/api/admin/master/castes`, {
            religion: formData.religion,
            caste: formData.name,
          });
        } else {
          res = await axios.put(`${API}/api/admin/master/castes/${editItem.ID}`, {
            religion: formData.religion,
            caste: formData.name,
          });
        }
        if (res.data.success) {
          await fetchCastes(selectedReligion);
        }
      } else {
        if (!formData.casteId) {
          alert("Please select a caste");
          setSaving(false);
          return;
        }
        if (modalMode === "add") {
          res = await axios.post(`${API}/api/admin/master/subcastes`, {
            casteId: formData.casteId,
            subcaste: formData.name,
          });
        } else {
          res = await axios.put(`${API}/api/admin/master/subcastes/${editItem.ID}`, {
            casteId: formData.casteId,
            subcaste: formData.name,
          });
        }
        if (res.data.success) {
          await fetchSubcastes(selectedCaste);
        }
      }

      if (res.data.success) {
        setShowModal(false);
        alert(res.data.message);
      } else {
        alert(res.data.message || "Error saving data");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.message || "Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);

    try {
      let res;
      if (activeTab === "religion") {
        res = await axios.delete(`${API}/api/admin/master/religions/${itemToDelete.ID}`);
        if (res.data.success) await fetchReligions();
      } else if (activeTab === "caste") {
        res = await axios.delete(`${API}/api/admin/master/castes/${itemToDelete.ID}`);
        if (res.data.success) await fetchCastes(selectedReligion);
      } else {
        res = await axios.delete(`${API}/api/admin/master/subcastes/${itemToDelete.ID}`);
        if (res.data.success) await fetchSubcastes(selectedCaste);
      }

      if (res.data.success) {
        setShowDeleteModal(false);
        setItemToDelete(null);
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Error deleting item");
    } finally {
      setDeleting(false);
    }
  };

  const getTabLabel = () => {
    if (activeTab === "religion") return "Religion";
    if (activeTab === "caste") return "Caste";
    return "Sub Caste";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Data Management</h1>
          <p className="text-gray-500 text-sm">Add and manage Religion, Caste, and Sub Caste options</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            <Plus size={18} />
            Add {getTabLabel()}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("religion")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === "religion"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <BookOpen size={18} />
          Religion
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {religions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("caste")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === "caste"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Users size={18} />
          Caste
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {castes.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("subcaste")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === "subcaste"
              ? "bg-purple-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Users size={18} />
          Sub Caste
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {subcastes.length}
          </span>
        </button>
      </div>

      {/* Filters */}
      {activeTab === "caste" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Religion:</label>
            <div className="relative">
              <select
                value={selectedReligion}
                onChange={(e) => setSelectedReligion(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Religions</option>
                {religions.map((r) => (
                  <option key={r.ID} value={r.Religion}>
                    {r.Religion}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "subcaste" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Religion:</label>
              <div className="relative">
                <select
                  value={selectedReligion}
                  onChange={(e) => {
                    setSelectedReligion(e.target.value);
                    setSelectedCaste("");
                    fetchCastes(e.target.value);
                  }}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 appearance-none bg-white min-w-[180px]"
                >
                  <option value="">Select Religion</option>
                  {religions.map((r) => (
                    <option key={r.ID} value={r.Religion}>
                      {r.Religion}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Caste:</label>
              <div className="relative">
                <select
                  value={selectedCaste}
                  onChange={(e) => setSelectedCaste(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 appearance-none bg-white min-w-[180px]"
                  disabled={!selectedReligion}
                >
                  <option value="">All Castes</option>
                  {castes.map((c) => (
                    <option key={c.ID} value={c.ID}>
                      {c.Caste}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading...
          </div>
        ) : (
          <>
            {/* Religion Tab */}
            {activeTab === "religion" && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Religion Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {religions.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-400">
                        No religions found. Click "Add Religion" to add one.
                      </td>
                    </tr>
                  ) : (
                    religions.map((item) => (
                      <tr key={item.ID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.ID}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.Religion}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(item)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Caste Tab */}
            {activeTab === "caste" && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Religion</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Caste Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {castes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                        No castes found. Click "Add Caste" to add one.
                      </td>
                    </tr>
                  ) : (
                    castes.map((item) => (
                      <tr key={item.ID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.ID}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.Religion}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.Caste}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(item)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Subcaste Tab */}
            {activeTab === "subcaste" && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Religion</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Caste</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sub Caste Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subcastes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                        No sub castes found. Select a caste and click "Add Sub Caste" to add one.
                      </td>
                    </tr>
                  ) : (
                    subcastes.map((item) => (
                      <tr key={item.ID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.ID}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.Religion || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.Caste || "-"}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.Subcaste}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(item)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                {modalMode === "add" ? "Add" : "Edit"} {getTabLabel()}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Religion selector for Caste */}
              {activeTab === "caste" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select Religion</option>
                    {religions.map((r) => (
                      <option key={r.ID} value={r.Religion}>
                        {r.Religion}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Caste selector for Subcaste */}
              {activeTab === "subcaste" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Religion
                    </label>
                    <select
                      value={formData.religion || selectedReligion}
                      onChange={(e) => {
                        setFormData({ ...formData, religion: e.target.value, casteId: "" });
                        fetchCastes(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Religion</option>
                      {religions.map((r) => (
                        <option key={r.ID} value={r.Religion}>
                          {r.Religion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Caste <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.casteId}
                      onChange={(e) => setFormData({ ...formData, casteId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Caste</option>
                      {castes.map((c) => (
                        <option key={c.ID} value={c.ID}>
                          {c.Caste}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTabLabel()} Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`Enter ${getTabLabel().toLowerCase()} name`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Delete {getTabLabel()}</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {activeTab === "religion"
                  ? itemToDelete?.Religion
                  : activeTab === "caste"
                  ? itemToDelete?.Caste
                  : itemToDelete?.Subcaste}
              </span>
              ? This may affect existing member records.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
