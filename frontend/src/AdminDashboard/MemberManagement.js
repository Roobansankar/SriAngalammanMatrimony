import axios from "axios";
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Filter,
    RefreshCw,
    Save,
    Search,
    Trash2,
    UserCircle,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "";

export default function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';

  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  const fetchMembers = () => {
    setLoading(true);
    axios
      .get(`${API}/api/admin/all-members?page=${page}&search=${search}&gender=${genderFilter}`)
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
  }, [page, genderFilter]);

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
        fetchMembers(); // Refresh the list
        alert("Member updated successfully!");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving changes: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };



  // eslint-disable-next-line no-unused-vars
  const handleVisibilityChange = async (matriId, visibility) => {
    try {
      const res = await axios.put(`${API}/api/admin/member/${matriId}/visibility`, { visibility });
      if (res.data.success) {
        fetchMembers();
        alert(`Member visibility changed to ${visibility}`);
      }
    } catch (err) {
      console.error("Error changing visibility:", err);
      alert("Error changing visibility");
    }
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      const res = await axios.delete(`${API}/api/admin/member/${memberToDelete.MatriID}`);
      if (res.data.success) {
        setShowDeleteModal(false);
        setMemberToDelete(null);
        if (selectedMember?.MatriID === memberToDelete.MatriID) {
          setSelectedMember(null);
        }
        fetchMembers();
        alert("Member deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error deleting member");
    } finally {
      setDeleting(false);
    }
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Member Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage all registered members - Edit, Delete, Ban/Unban
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

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  All Members ({total})
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
                          <th className="px-4 py-3 text-left">Contact</th>
                          <th className="px-4 py-3 text-left">Status</th>
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
                                    {m.MatriID} • {m.Gender} • {m.Age || "-"}{" "}
                                    yrs
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
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  m.Status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : m.Status === "Banned"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {m.Status || "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewMember(m.MatriID);
                                    setIsEditing(true);
                                  }}
                                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </button>
                                {/* <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(
                                      m.MatriID,
                                      m.Status === "Banned"
                                        ? "Active"
                                        : "Banned"
                                    );
                                  }}
                                  className={`p-1.5 rounded ${
                                    m.Status === "Banned"
                                      ? "text-green-500 hover:bg-green-50"
                                      : "text-orange-500 hover:bg-orange-50"
                                  }`}
                                  title={
                                    m.Status === "Banned" ? "Unban" : "Ban"
                                  }
                                >
                                  {m.Status === "Banned" ? (
                                    <Check size={16} />
                                  ) : (
                                    <Ban size={16} />
                                  )}
                                </button> */}
                                {isAdmin && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmDelete(m);
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
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
                  </div>

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
                      label="Gender"
                      field="Gender"
                      type="select"
                      options={["Male", "Female"]}
                      value={
                        isEditing ? editData.Gender : selectedMember.Gender
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Marital Status"
                      field="Maritalstatus"
                      type="select"
                      options={["Unmarried", "Divorced", "Widowed", "Separated"]}
                      value={
                        isEditing ? editData.Maritalstatus : selectedMember.Maritalstatus
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Religion"
                      field="Religion"
                      value={
                        isEditing ? editData.Religion : selectedMember.Religion
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Mother Tongue"
                      field="mother_tounge"
                      value={
                        isEditing ? editData.mother_tounge : selectedMember.mother_tounge
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Country"
                      field="Country"
                      value={
                        isEditing ? editData.Country : selectedMember.Country
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Education"
                      field="Education"
                      value={
                        isEditing
                          ? editData.Education
                          : selectedMember.Education
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Occupation"
                      field="Occupation"
                      value={
                        isEditing
                          ? editData.Occupation
                          : selectedMember.Occupation
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Company"
                      field="company_name"
                      value={
                        isEditing
                          ? editData.company_name
                          : selectedMember.company_name
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Annual Income"
                      field="Annualincome"
                      value={
                        isEditing
                          ? editData.Annualincome
                          : selectedMember.Annualincome
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Height"
                      field="Height"
                      value={
                        isEditing ? editData.Height : selectedMember.Height
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Weight"
                      field="Weight"
                      value={
                        isEditing ? editData.Weight : selectedMember.Weight
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Complexion"
                      field="Complexion"
                      value={
                        isEditing
                          ? editData.Complexion
                          : selectedMember.Complexion
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Height (Text)"
                      field="HeightText"
                      value={
                        isEditing ? editData.HeightText : selectedMember.HeightText
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Handicap Status"
                      field="Handicapt_status"
                      type="select"
                      options={["No", "Yes"]}
                      value={
                        isEditing ? editData.Handicapt_status : selectedMember.Handicapt_status
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Handicap Reason"
                      field="Handicapt_reson"
                      value={
                        isEditing ? editData.Handicapt_reson : selectedMember.Handicapt_reson
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Caste"
                      field="Caste"
                      value={isEditing ? editData.Caste : selectedMember.Caste}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Sub Caste"
                      field="Subcaste"
                      value={
                        isEditing ? editData.Subcaste : selectedMember.Subcaste
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Father's Name"
                      field="Fathername"
                      value={
                        isEditing
                          ? editData.Fathername
                          : selectedMember.Fathername
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Father's Occupation"
                      field="Fathersoccupation"
                      value={
                        isEditing
                          ? editData.Fathersoccupation
                          : selectedMember.Fathersoccupation
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Mother's Name"
                      field="Mothersname"
                      value={
                        isEditing
                          ? editData.Mothersname
                          : selectedMember.Mothersname
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Mother's Occupation"
                      field="Mothersoccupation"
                      value={
                        isEditing
                          ? editData.Mothersoccupation
                          : selectedMember.Mothersoccupation
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
                    <EditField
                      label="City"
                      field="City"
                      value={isEditing ? editData.City : selectedMember.City}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="State"
                      field="State"
                      value={isEditing ? editData.State : selectedMember.State}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Star"
                      field="Star"
                      value={isEditing ? editData.Star : selectedMember.Star}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Rasi (Moon Sign)"
                      field="Moonsign"
                      value={
                        isEditing ? editData.Moonsign : selectedMember.Moonsign
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Blood Group"
                      field="BloodGroup"
                      value={
                        isEditing
                          ? editData.BloodGroup
                          : selectedMember.BloodGroup
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Family Details */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Family Details
                      </h4>
                    </div>
                    <EditField
                      label="No. of Brothers"
                      field="noofbrothers"
                      value={
                        isEditing
                          ? editData.noofbrothers
                          : selectedMember.noofbrothers
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="No. of Sisters"
                      field="noofsisters"
                      value={
                        isEditing
                          ? editData.noofsisters
                          : selectedMember.noofsisters
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Family Wealth"
                      field="family_wealth"
                      value={
                        isEditing
                          ? editData.family_wealth
                          : selectedMember.family_wealth
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Younger Brothers"
                      field="noyubrothers"
                      value={
                        isEditing ? editData.noyubrothers : selectedMember.noyubrothers
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Younger Sisters"
                      field="noyusisters"
                      value={
                        isEditing ? editData.noyusisters : selectedMember.noyusisters
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Unmarried Brothers"
                      field="nb_unmarried"
                      value={
                        isEditing ? editData.nb_unmarried : selectedMember.nb_unmarried
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Unmarried Sisters"
                      field="ns_unmarried"
                      value={
                        isEditing ? editData.ns_unmarried : selectedMember.ns_unmarried
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Parents Stay"
                      field="parents_stay"
                      value={
                        isEditing ? editData.parents_stay : selectedMember.parents_stay
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Village"
                      field="village"
                      value={
                        isEditing ? editData.village : selectedMember.village
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Relatives"
                      field="relatives"
                      type="textarea"
                      value={
                        isEditing ? editData.relatives : selectedMember.relatives
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Professional Details */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Professional Details
                      </h4>
                    </div>
                    <EditField
                      label="Working Location"
                      field="workinglocation"
                      value={
                        isEditing
                          ? editData.workinglocation
                          : selectedMember.workinglocation
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Occupation Details"
                      field="occu_details"
                      type="textarea"
                      value={
                        isEditing
                          ? editData.occu_details
                          : selectedMember.occu_details
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Birth Details */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Birth Details
                      </h4>
                    </div>
                    <EditField
                      label="Time of Birth (TOB)"
                      field="TOB"
                      value={isEditing ? editData.TOB : selectedMember.TOB}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Place of Birth (POB)"
                      field="POB"
                      value={isEditing ? editData.POB : selectedMember.POB}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Horoscope Details */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Horoscope Details
                      </h4>
                    </div>
                    <EditField
                      label="Lagnam"
                      field="Lagnam"
                      value={
                        isEditing ? editData.Lagnam : selectedMember.Lagnam
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Raghu"
                      field="Raghu"
                      value={isEditing ? editData.Raghu : selectedMember.Raghu}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Keethu"
                      field="Keethu"
                      value={
                        isEditing ? editData.Keethu : selectedMember.Keethu
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Sevai (Mars)"
                      field="Sevai"
                      value={isEditing ? editData.Sevai : selectedMember.Sevai}
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Suddham"
                      field="Suddham"
                      value={
                        isEditing ? editData.Suddham : selectedMember.Suddham
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Dasa Balance"
                      field="DasaBalance"
                      value={
                        isEditing
                          ? editData.DasaBalance
                          : selectedMember.DasaBalance
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Kuladeivam"
                      field="Kuladeivam"
                      value={
                        isEditing ? editData.Kuladeivam : selectedMember.Kuladeivam
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Thesai Irupu"
                      field="ThesaiIrupu"
                      value={
                        isEditing ? editData.ThesaiIrupu : selectedMember.ThesaiIrupu
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Thosam"
                      field="thosam"
                      value={
                        isEditing ? editData.thosam : selectedMember.thosam
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Charan"
                      field="charan"
                      value={
                        isEditing ? editData.charan : selectedMember.charan
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Gan"
                      field="Gan"
                      value={
                        isEditing ? editData.Gan : selectedMember.Gan
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Nadi"
                      field="nadi"
                      value={
                        isEditing ? editData.nadi : selectedMember.nadi
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Parigara Sevai"
                      field="parigarasevai"
                      value={
                        isEditing ? editData.parigarasevai : selectedMember.parigarasevai
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Shani"
                      field="shani"
                      value={
                        isEditing ? editData.shani : selectedMember.shani
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Shani Place"
                      field="shaniplace"
                      value={
                        isEditing ? editData.shaniplace : selectedMember.shaniplace
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Dasa Type"
                      field="dasatype"
                      value={
                        isEditing ? editData.dasatype : selectedMember.dasatype
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Dasa Year"
                      field="dasayear"
                      value={
                        isEditing ? editData.dasayear : selectedMember.dasayear
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Dasa Month"
                      field="dasamonth"
                      value={
                        isEditing ? editData.dasamonth : selectedMember.dasamonth
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Dasa Date"
                      field="dasadate"
                      value={
                        isEditing ? editData.dasadate : selectedMember.dasadate
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Rasi Grid (g1-g12) */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Rasi Chart (Birth Chart)
                      </h4>
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        {[12, 1, 2, 3, 11, "", "", 4, 10, 9, 8, 7].map(
                          (pos, idx) => {
                            if (pos === "")
                              return (
                                <div
                                  key={idx}
                                  className="horoscope-grid-cell"
                                ></div>
                              );
                            const field = `g${pos}`;
                            return (
                              <div
                                key={field}
                                className="horoscope-grid-cell border border-gray-300 rounded p-2 bg-gray-50"
                              >
                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                  {pos}
                                </div>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editData[field] || ""}
                                    onChange={(e) =>
                                      handleEditChange(field, e.target.value)
                                    }
                                    className="w-full text-xs border border-gray-200 rounded px-1 py-0.5"
                                    placeholder="Planets"
                                  />
                                ) : (
                                  <div className="text-xs text-gray-800 font-medium">
                                    {selectedMember[field] || "-"}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    {/* Navamsam Grid (a1-a12) */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Navamsam Chart
                      </h4>
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        {[12, 1, 2, 3, 11, "", "", 4, 10, 9, 8, 7].map(
                          (pos, idx) => {
                            if (pos === "")
                              return (
                                <div
                                  key={idx}
                                  className="horoscope-grid-cell"
                                ></div>
                              );
                            const field = `a${pos}`;
                            return (
                              <div
                                key={field}
                                className="horoscope-grid-cell border border-gray-300 rounded p-2 bg-gray-50"
                              >
                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                  {pos}
                                </div>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editData[field] || ""}
                                    onChange={(e) =>
                                      handleEditChange(field, e.target.value)
                                    }
                                    className="w-full text-xs border border-gray-200 rounded px-1 py-0.5"
                                    placeholder="Planets"
                                  />
                                ) : (
                                  <div className="text-xs text-gray-800 font-medium">
                                    {selectedMember[field] || "-"}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    {/* Additional Notes */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Additional Information
                      </h4>
                    </div>
                    <EditField
                      label="Other Notes"
                      field="OtherNotes"
                      type="textarea"
                      value={
                        isEditing
                          ? editData.OtherNotes
                          : selectedMember.OtherNotes
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Partner Expectations"
                      field="PartnerExpectations"
                      type="textarea"
                      value={
                        isEditing
                          ? editData.PartnerExpectations
                          : selectedMember.PartnerExpectations
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="About Us"
                      field="aboutus"
                      type="textarea"
                      value={
                        isEditing ? editData.aboutus : selectedMember.aboutus
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Passport"
                      field="passport"
                      value={
                        isEditing ? editData.passport : selectedMember.passport
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Achievement"
                      field="achievement"
                      type="textarea"
                      value={
                        isEditing ? editData.achievement : selectedMember.achievement
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Medical History"
                      field="medicalhistory"
                      type="textarea"
                      value={
                        isEditing ? editData.medicalhistory : selectedMember.medicalhistory
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Family Medical History"
                      field="familymedicalhistory"
                      type="textarea"
                      value={
                        isEditing ? editData.familymedicalhistory : selectedMember.familymedicalhistory
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Any Other Income"
                      field="anyotherincome"
                      value={
                        isEditing ? editData.anyotherincome : selectedMember.anyotherincome
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Reference"
                      field="reference"
                      value={
                        isEditing ? editData.reference : selectedMember.reference
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Status */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Account Status
                      </h4>
                    </div>
                    <EditField
                      label="Status"
                      field="Status"
                      type="select"
                      options={["Active", "Pending", "Banned"]}
                      value={
                        isEditing ? editData.Status : selectedMember.Status
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Plan"
                      field="Plan"
                      type="select"
                      options={["basic", "premium"]}
                      value={
                        isEditing ? editData.Plan : selectedMember.Plan
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Visibility"
                      field="visibility"
                      type="select"
                      options={["visible", "hidden"]}
                      value={
                        isEditing ? editData.visibility : selectedMember.visibility
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Featured"
                      field="featured"
                      type="select"
                      options={["", "Yes", "No"]}
                      value={
                        isEditing ? editData.featured : selectedMember.featured
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Featured User"
                      field="featured_user"
                      type="select"
                      options={["", "Yes", "No"]}
                      value={
                        isEditing ? editData.featured_user : selectedMember.featured_user
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Photo 1 Approve"
                      field="Photo1Approve"
                      type="select"
                      options={["No", "Yes"]}
                      value={
                        isEditing ? editData.Photo1Approve : selectedMember.Photo1Approve
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Photo 2 Approve"
                      field="Photo2Approve"
                      type="select"
                      options={["No", "Yes"]}
                      value={
                        isEditing ? editData.Photo2Approve : selectedMember.Photo2Approve
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Photo 3 Approve"
                      field="Photo3Approve"
                      type="select"
                      options={["No", "Yes"]}
                      value={
                        isEditing ? editData.Photo3Approve : selectedMember.Photo3Approve
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Photo Visibility"
                      field="photo_visibility"
                      type="select"
                      options={["", "visible", "hidden"]}
                      value={
                        isEditing ? editData.photo_visibility : selectedMember.photo_visibility
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Phone Visibility"
                      field="phone_visibility"
                      type="select"
                      options={["", "visible", "hidden"]}
                      value={
                        isEditing ? editData.phone_visibility : selectedMember.phone_visibility
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Horoscope Approve"
                      field="HorosApprove"
                      type="select"
                      options={["", "Yes", "No"]}
                      value={
                        isEditing ? editData.HorosApprove : selectedMember.HorosApprove
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Horoscope Visibility"
                      field="horoscope_visibility"
                      type="select"
                      options={["", "visible", "hidden"]}
                      value={
                        isEditing ? editData.horoscope_visibility : selectedMember.horoscope_visibility
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="ID Proof Approve"
                      field="idproof_approve"
                      type="select"
                      options={["", "Yes", "No"]}
                      value={
                        isEditing ? editData.idproof_approve : selectedMember.idproof_approve
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    <EditField
                      label="Biodata Approve"
                      field="Biodata_approve"
                      type="select"
                      options={["", "Yes", "No"]}
                      value={
                        isEditing ? editData.Biodata_approve : selectedMember.Biodata_approve
                      }
                      isEditing={isEditing}
                      onChange={handleEditChange}
                    />
                    {/* Quick Actions */}
                    {!isEditing && (
                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Quick Actions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {/* 
                        <button
                          onClick={() =>
                            handleStatusChange(
                              selectedMember.MatriID,
                              selectedMember.Status === "Banned" ? "Active" : "Banned"
                            )
                          }
                          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                            selectedMember.Status === "Banned"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                        >
                          {selectedMember.Status === "Banned" ? (
                            <>
                              <Check size={14} /> Unban
                            </>
                          ) : (
                            <>
                              <Ban size={14} /> Ban
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleVisibilityChange(
                              selectedMember.MatriID,
                              selectedMember.visibility === "hidden" ? "visible" : "hidden"
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                        >
                          {selectedMember.visibility === "hidden" ? (
                            <>
                              <Eye size={14} /> Show
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} /> Hide
                            </>
                          )}
                        </button> */}
                          {isAdmin && (
                            <button
                              onClick={() => confirmDelete(selectedMember)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    Delete Member
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{memberToDelete?.Name}</span> (
                {memberToDelete?.MatriID})? All their data will be permanently
                removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMemberToDelete(null);
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
    </>
  );
}

// Reusable Edit Field Component
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
