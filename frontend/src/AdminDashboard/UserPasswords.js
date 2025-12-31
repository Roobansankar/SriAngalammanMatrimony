import axios from "axios";
import { AlertTriangle, Copy, Eye, EyeOff, KeyRound, Lock, Search, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "";

export default function UserPasswords() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Password verification state
  const [isVerified, setIsVerified] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (isAdmin && isVerified) {
      fetchUserPasswords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isVerified]);

  const verifyAdminPassword = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setVerifying(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/admin/verify-password`,
        { password: adminPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setIsVerified(true);
        setAdminPassword("");
      } else {
        setVerifyError(res.data.message || "Invalid password");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerifyError(err.response?.data?.message || "Failed to verify password");
    } finally {
      setVerifying(false);
    }
  };

  const fetchUserPasswords = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/admin/user-passwords`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search: search.trim() }
      });
      if (res.data.success) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching passwords:", err);
      setError(err.response?.data?.message || "Failed to fetch user passwords");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUserPasswords();
  };

  const togglePasswordVisibility = (matriId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [matriId]: !prev[matriId]
    }));
  };

  const copyToClipboard = (text, matriId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(matriId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLockSession = () => {
    setIsVerified(false);
    setUsers([]);
    setVisiblePasswords({});
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can view this page.</p>
        </div>
      </div>
    );
  }

  // Password verification modal
  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Verification</h2>
            <p className="text-gray-600 mt-2">
              Enter your admin password to access user passwords
            </p>
          </div>

          <form onSubmit={verifyAdminPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            {verifyError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {verifyError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying || !adminPassword}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying..." : "Verify & Access"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                This page contains sensitive user credentials. Access is logged for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Security Warning</h3>
            <p className="text-sm text-red-700 mt-1">
              This page displays user passwords in plain text. This is highly sensitive information.
              Only use this for administrative purposes and never share passwords with unauthorized personnel.
            </p>
          </div>
        </div>
        <button
          onClick={handleLockSession}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
        >
          <Lock className="w-4 h-4" />
          Lock
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">User Passwords</h1>
              <p className="text-sm text-gray-500">View member login credentials (Admin Only)</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by MatriID, Name, Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    MatriID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.MatriID} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{user.MatriID}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.Name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.ConfirmEmail || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{user.Mobile || "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono min-w-[80px]">
                          {visiblePasswords[user.MatriID] 
                            ? (user.ConfirmPassword || "N/A")
                            : "••••••••"}
                        </code>
                        <button
                          onClick={() => togglePasswordVisibility(user.MatriID)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                          title={visiblePasswords[user.MatriID] ? "Hide password" : "Show password"}
                        >
                          {visiblePasswords[user.MatriID] ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => copyToClipboard(user.ConfirmPassword || "", user.MatriID)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                          copiedId === user.MatriID
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedId === user.MatriID ? "Copied!" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
