// src/AdminDashboard/ContactMessages.js
import axios from "axios";
import { Check, Mail, MessageSquare, RefreshCw, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, resolved
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/admin/contact-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      
      await axios.put(
        `${API_BASE}/api/admin/contact-message/${id}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-data": JSON.stringify(currentUser),
          },
        }
      );
      
      // Update local state
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status: "resolved", resolved_at: new Date().toISOString() }
            : m
        )
      );
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error resolving message:", err);
      alert("Failed to resolve message");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/admin/contact-message/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "pending") return m.status === "pending";
    if (filter === "resolved") return m.status === "resolved";
    return true;
  });

  const pendingCount = messages.filter((m) => m.status === "pending").length;
  const resolvedCount = messages.filter((m) => m.status === "resolved").length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage messages from the contact form
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-xl font-bold text-gray-800">{messages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Mail size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Check size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-xl font-bold text-emerald-600">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "pending", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No messages found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                  selectedMessage?.id === msg.id ? "bg-rose-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.status === "resolved"
                          ? "bg-emerald-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <User
                        size={18}
                        className={
                          msg.status === "resolved"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-800">
                          {msg.first_name} {msg.last_name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            msg.status === "resolved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{msg.email}</p>
                      {msg.subject && (
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {msg.subject}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{formatDate(msg.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Message Details
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedMessage.status === "resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium text-gray-800">
                  {selectedMessage.first_name} {selectedMessage.last_name}
                </p>
                <p className="text-sm text-gray-600">{selectedMessage.email}</p>
              </div>

              {selectedMessage.subject && (
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-800">
                    {selectedMessage.subject}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500">Received</p>
                  <p className="text-sm text-gray-800">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
                {selectedMessage.resolved_at && (
                  <div>
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="text-sm text-gray-800">
                      {formatDate(selectedMessage.resolved_at)}
                      {selectedMessage.resolved_by && (
                        <span className="text-gray-500">
                          {" "}
                          by {selectedMessage.resolved_by}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              {selectedMessage.status === "pending" && (
                <button
                  onClick={() => handleResolve(selectedMessage.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition"
                >
                  <Check size={18} />
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
