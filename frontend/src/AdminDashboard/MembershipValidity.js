import axios from "axios";
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Infinity as InfinityIcon,
  Search,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "";

// Auth header is set globally by index.js / AdminPrivateRoute / admin LoginPage
// (axios.defaults.headers.common.Authorization) — same as every other admin page.
function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
}

const FILTERS = [
  { value: "all", label: "All members" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring ≤ 30 days" },
  { value: "blocked", label: "Blocked (login stopped)" },
  { value: "unlimited", label: "Unlimited" },
];

const STATE_BADGE = {
  active: "bg-green-100 text-green-700",
  expiring: "bg-amber-100 text-amber-700",
  blocked: "bg-gray-800 text-white",
  unlimited: "bg-blue-100 text-blue-700",
};

// Why is this member's login blocked?
function blockReason(row) {
  if (row.state !== "blocked") return null;
  if (row.block_reason === "manual") return "Blocked by admin";
  return `Membership expired ${fmtDate(row.expires_at)}`;
}

function fmtDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
}

function daysLabel(row) {
  if (row.unlimited) return "No expiry";
  const n = Number(row.days_left);
  if (Number.isNaN(n)) return "-";
  if (n < 0) return `Expired ${Math.abs(n)} day${Math.abs(n) === 1 ? "" : "s"} ago`;
  if (n === 0) return "Expires today";
  return `${n} day${n === 1 ? "" : "s"} left`;
}

export default function MembershipValidity() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [gender, setGender] = useState("");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const fetchRows = () => {
    setLoading(true);
    setError("");
    axios
      .get(
        `${API}/api/admin/validity?page=${page}&search=${encodeURIComponent(
          search.trim()
        )}&filter=${filter}&gender=${gender}`,
        authHeaders()
      )
      .then((res) => {
        if (res.data.success) {
          setRows(res.data.results || []);
          setTotal(res.data.total || 0);
          setSummary(res.data.summary || {});
        } else {
          setError(res.data.message || "Could not load members");
        }
      })
      .catch((err) => {
        console.error("validity fetch error:", err);
        setError(err.response?.data?.message || err.message || "Request failed");
      })
      .finally(() => setLoading(false));
  };

  // Any new query jumps back to page 1.
  useEffect(() => {
    setPage(1);
  }, [search, filter, gender]);

  // Fetch on page / filter / search / gender change — debounced while typing.
  useEffect(() => {
    const t = setTimeout(fetchRows, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter, search, gender]);

  const openManage = (row) => {
    setSelected(row);
    setCustomDate("");
    setNote("");
  };

  const doAction = async (action, extra = {}) => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await axios.put(
        `${API}/api/admin/validity/${encodeURIComponent(selected.MatriID)}`,
        { action, note: note || undefined, ...extra },
        authHeaders()
      );
      if (res.data.success) {
        if (res.data.row) setSelected(mapRow(res.data.row));
        fetchRows();
      } else {
        alert(res.data.message || "Action failed");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    const list = [];
    for (let i = start; i <= end; i++) list.push(i);
    return list;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Membership Validity</h1>
        <p className="text-gray-500 text-sm mt-1">
          Every membership is valid for 1 year from the registration date. The moment
          it expires the member can no longer log in — no button to press. Their profile
          stays visible on the site. Use the actions below to extend or lift it.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Active" value={summary.active} color="text-green-600" icon={CheckCircle2} />
        <SummaryCard label="Expiring ≤ 30d" value={summary.expiring} color="text-amber-600" icon={Clock} />
        <SummaryCard label="Blocked (login stopped)" value={summary.blocked} color="text-gray-800" icon={Ban} />
        <SummaryCard label="Unlimited" value={summary.unlimited} color="text-blue-600" icon={InfinityIcon} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, MatriID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="!w-full md:!w-36 flex-none px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
        >
          <option value="">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="!w-full md:!w-56 flex-none px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Members ({total})</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
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
                    <th className="px-4 py-3 text-left">Registered</th>
                    <th className="px-4 py-3 text-left">Valid until</th>
                    <th className="px-4 py-3 text-left">State</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((m) => (
                    <tr key={m.MatriID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {m.PhotoURL ? (
                            <img src={m.PhotoURL} alt={m.Name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                m.Gender === "Male" ? "bg-blue-100" : "bg-pink-100"
                              }`}
                            >
                              <UserCircle
                                size={18}
                                className={m.Gender === "Male" ? "text-blue-500" : "text-pink-500"}
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{m.Name || "-"}</p>
                            <p className="text-xs text-gray-500">
                              {m.MatriID} • {m.Gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{fmtDate(m.Regdate)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-800">
                          {m.unlimited ? "—" : fmtDate(m.expires_at)}
                        </p>
                        <p className="text-xs text-gray-500">{daysLabel(m)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            STATE_BADGE[m.state] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {m.state}
                        </span>
                        {blockReason(m) && (
                          <p className="text-[11px] text-gray-500 mt-1">{blockReason(m)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openManage(m)}
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      page === n ? "bg-rose-500 text-white" : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {n}
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

      {/* Manage modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-gray-800">{selected.Name || selected.MatriID}</h3>
                <p className="text-xs text-gray-500">{selected.MatriID}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Registered" value={fmtDate(selected.Regdate)} />
                <Info label="Validity start" value={fmtDate(selected.starts_at)} />
                <Info
                  label="Valid until"
                  value={selected.unlimited ? "No expiry (unlimited)" : fmtDate(selected.expires_at)}
                />
                <Info label="Time left" value={daysLabel(selected)} />
                <Info
                  label="Login"
                  value={
                    selected.state === "blocked" ? (
                      <span className="text-red-600 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Allowed</span>
                    )
                  }
                />
                <Info
                  label="Site status (separate)"
                  value={selected.register_status || "-"}
                />
              </div>

              {blockReason(selected) && (
                <p className="text-xs text-red-500 -mt-1">{blockReason(selected)}</p>
              )}

              {selected.note && (
                <p className="text-xs text-gray-500">
                  Last note: <span className="text-gray-700">{selected.note}</span>
                  {selected.updated_by ? ` — ${selected.updated_by}` : ""}
                </p>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason / reference..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={busy}
                    onClick={() => doAction("extend", { years: 1 })}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    + Extend 1 year
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => doAction("extend", { years: 2 })}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    + 2 years
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => doAction("extend", { years: 5 })}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    + 5 years
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    disabled={busy || !customDate}
                    onClick={() => doAction("set_date", { date: customDate })}
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Set exact expiry date
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.unlimited ? (
                    <button
                      disabled={busy}
                      onClick={() => doAction("reenable")}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                    >
                      <ShieldCheck size={15} /> Re-enable 1-year validity
                    </button>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => doAction("unlimited")}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <InfinityIcon size={15} /> Remove validity (unlimited)
                    </button>
                  )}

                  {selected.state === "blocked" ? (
                    <button
                      disabled={busy}
                      onClick={() => doAction("unblock")}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle2 size={15} /> Allow login (renew 1 year)
                    </button>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => doAction("block")}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-black disabled:opacity-50"
                    >
                      <Ban size={15} /> Block login now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function mapRow(row) {
  return {
    MatriID: row.MatriID,
    Name: row.Name,
    Gender: row.Gender,
    Regdate: row.Regdate,
    starts_at: row.starts_at,
    expires_at: row.expires_at,
    days_left: row.days_left,
    state: row.state,
    unlimited: !!row.unlimited,
    is_blocked: !!row.is_blocked,
    block_reason: row.block_reason,
    register_status: row.register_status,
    note: row.note,
    updated_by: row.updated_by,
  };
}

function SummaryCard({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
      <Icon size={20} className={color} />
      <div>
        <p className="text-lg font-bold text-gray-800">{value ?? 0}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
