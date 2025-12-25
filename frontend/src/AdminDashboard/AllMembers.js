import axios from "axios";
import { ChevronLeft, ChevronRight, Search, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "";

export default function AllMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);

  const fetchMembers = () => {
    setLoading(true);
    axios
      .get(
        `${API}/api/admin/all-members?page=${page}&search=${search}&gender=${genderFilter}`
      )
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.results);
          setTotal(res.data.total);
        }
      })
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

  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Members</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all registered members
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent w-64"
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

      {/* Gender Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setGenderFilter("");
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            genderFilter === ""
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <UserCircle size={18} />
            All Members
          </span>
        </button>
        <button
          onClick={() => {
            setGenderFilter("Male");
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            genderFilter === "Male"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <UserCircle size={18} />
            Male Members
          </span>
        </button>
        <button
          onClick={() => {
            setGenderFilter("Female");
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            genderFilter === "Female"
              ? "bg-pink-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <UserCircle size={18} />
            Female Members
          </span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Members</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Current Page</p>
          <p className="text-2xl font-bold text-gray-800">
            {page} / {totalPages || 1}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Filter</p>
          <p className="text-2xl font-bold text-gray-800">
            {genderFilter || "All"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Profile ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name / Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p
                          className="font-medium text-rose-600 hover:text-rose-700"
                        >
                          {m.MatriID}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {m.PhotoURL && !m.PhotoURL.includes("nophoto") ? (
                          <img
                            src={m.PhotoURL}
                            alt={m.Name || "Member"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center ${m.PhotoURL && !m.PhotoURL.includes("nophoto") ? "hidden" : "flex"}`}
                        >
                          <UserCircle size={24} className="text-gray-500" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">
                          {m.Name}
                        </div>
                        <div className="text-xs text-gray-500">{m.Email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            m.Gender === "Male"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {m.Gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.Age}</td>
                      <td className="px-4 py-3 text-gray-600">{m.Mobile}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            m.Status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {m.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {m.Regdate
                          ? new Date(m.Regdate).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, total)} of {total} entries
              </p>

              <div className="flex items-center gap-1">
                <button
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      page === num
                        ? "bg-rose-500 text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
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
  );
}
