// src/components/InterestsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";

const API = process.env.REACT_APP_API_BASE || "";

export default function InterestsPage() {
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState([]); // profile interests
  const [chatRequests, setChatRequests] = useState([]); // chat interests
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [busyMap, setBusyMap] = useState({}); // id -> boolean (for UI disable)
  const [chatBusyMap, setChatBusyMap] = useState({}); // chat request id -> boolean
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "chat"

  // get logged user
  const logged = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();

  const loggedId =
    (logged?.MatriID || logged?.matid || "").toString().trim() || null;

  // helper to fetch sender profile (used to show contact after accepted)
  const fetchProfileSummary = async (matriid) => {
    try {
      const res = await axios.get(`${API}/api/auth/searchByMatriID`, {
        params: { matriid },
      });
      if (res.data?.success && res.data.user) return res.data.user;
      return null;
    } catch (e) {
      console.error("fetchProfileSummary error", e);
      return null;
    }
  };

  // Load incoming chat requests
  const loadChatRequests = async () => {
    if (!loggedId) return;
    setChatLoading(true);
    try {
      const res = await axios.get(`${API}/api/chat/requests`, {
        params: { matriid: loggedId },
      });
      if (res.data?.success) {
        setChatRequests(Array.isArray(res.data.requests) ? res.data.requests : []);
      }
    } catch (e) {
      console.warn("Failed to fetch chat requests:", e);
    } finally {
      setChatLoading(false);
    }
  };

  // initial load: fetch existing incoming interests for logged user
  useEffect(() => {
    let mounted = true;
    const loadIncoming = async () => {
      if (!loggedId) {
        setError("Please log in to view your interests");
        setLoading(false);
        setChatLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/api/auth/interest/incoming`, {
          params: { to: loggedId },
        });
        if (!mounted) return;
        if (res.data?.success) {
          // incoming array expected: [{ id, from_matriid, to_matriid, status, created_at, ... }, ...]
          setIncoming(
            Array.isArray(res.data.incoming) ? res.data.incoming : []
          );
        } else {
          setIncoming([]);
        }
      } catch (e) {
        console.warn(
          "Failed to fetch incoming interests (endpoint may be missing).",
          e
        );
        setIncoming([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadIncoming();
    loadChatRequests();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedId]);

  // socket: listen for interest_received and updates (real-time)
  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const onReceived = (payload) => {
      try {
        const interest = payload?.interest;
        if (!interest) return;
        // only add if the interest is for this logged user
        const to = (interest.to_matriid || interest.toMatriID || "")
          .toString()
          .trim()
          .toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;

        setIncoming((prev) => {
          // avoid duplicates
          const exists = prev.some((p) => String(p.id) === String(interest.id));
          if (exists)
            return prev.map((p) =>
              String(p.id) === String(interest.id) ? interest : p
            );
          return [interest, ...prev];
        });
      } catch (e) {
        console.error("onReceived error", e);
      }
    };

    const onUpdate = (payload) => {
      try {
        const interest = payload?.interest;
        if (!interest) return;
        const to = (interest.to_matriid || interest.toMatriID || "")
          .toString()
          .trim()
          .toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;

        setIncoming((prev) =>
          prev.map((p) => (String(p.id) === String(interest.id) ? interest : p))
        );
      } catch (e) {
        console.error("onUpdate error", e);
      }
    };

    const onResponse = (payload) => {
      // sender might receive interest_response; but keep updating local list too if it's relevant
      try {
        const interest = payload?.interest;
        if (!interest) return;
        // if this logged user is recipient of the update, update; otherwise ignore
        const to = (interest.to_matriid || interest.toMatriID || "")
          .toString()
          .trim()
          .toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;
        setIncoming((prev) =>
          prev.map((p) => (String(p.id) === String(interest.id) ? interest : p))
        );
      } catch (e) {
        console.error("onResponse error", e);
      }
    };

    socket?.on("interest_received", onReceived);
    socket?.on("interest_update", onUpdate);
    socket?.on("interest_response", onResponse);

    // Chat request socket listeners
    const onChatRequestReceived = (payload) => {
      try {
        const chatInterest = payload?.chatInterest;
        if (!chatInterest) return;
        const to = (chatInterest.to_matriid || "").toString().trim().toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;

        setChatRequests((prev) => {
          const exists = prev.some((p) => String(p.id) === String(chatInterest.id));
          if (exists) return prev;
          return [{
            ...chatInterest,
            Name: payload?.fromName || chatInterest.from_matriid,
          }, ...prev];
        });
      } catch (e) {
        console.error("onChatRequestReceived error", e);
      }
    };

    const onChatRequestResponse = (payload) => {
      try {
        const chatInterest = payload?.chatInterest;
        if (!chatInterest) return;
        // Remove from pending list if accepted/rejected
        setChatRequests((prev) => 
          prev.filter((p) => String(p.id) !== String(chatInterest.id))
        );
      } catch (e) {
        console.error("onChatRequestResponse error", e);
      }
    };

    socket?.on("chat_request_received", onChatRequestReceived);
    socket?.on("chat_request_response", onChatRequestResponse);

    return () => {
      socket?.off("interest_received", onReceived);
      socket?.off("interest_update", onUpdate);
      socket?.off("interest_response", onResponse);
      socket?.off("chat_request_received", onChatRequestReceived);
      socket?.off("chat_request_response", onChatRequestResponse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedId]);

  // Accept / Reject handler
  const respond = async (interestId, action) => {
    if (!interestId || !["accepted", "rejected"].includes(action)) return;
    setBusyMap((b) => ({ ...b, [interestId]: true }));
    try {
      const res = await axios.post(`${API}/api/auth/interest/respond`, {
        interestId,
        action,
      });
      if (res.data?.success && res.data.interest) {
        // update the local list item
        setIncoming((prev) =>
          prev.map((p) =>
            String(p.id) === String(res.data.interest.id)
              ? res.data.interest
              : p
          )
        );

        // Dispatch event to update Header badge
        window.dispatchEvent(new CustomEvent("incoming_interest_update"));

        // If accepted, fetch sender profile to show contact immediately
        if (res.data.interest.status === "accepted") {
          const updated = res.data.interest;
          const senderMatri = updated.from_matriid || updated.fromMatriID;
          if (senderMatri) {
            const profile = await fetchProfileSummary(senderMatri);
            // merge contact into the interest item
            setIncoming((prev) =>
              prev.map((p) =>
                String(p.id) === String(updated.id)
                  ? { ...p, senderProfile: profile, ...updated }
                  : p
              )
            );
          }
        }
      } else {
        alert("Failed to update interest");
      }
    } catch (e) {
      console.error("respond error", e);
      alert("Failed to respond. Try again.");
    } finally {
      setBusyMap((b) => ({ ...b, [interestId]: false }));
    }
  };

  // Accept / Reject chat request handler
  const respondToChatRequest = async (chatRequestId, action) => {
    if (!chatRequestId || !["accepted", "rejected"].includes(action)) return;
    setChatBusyMap((b) => ({ ...b, [chatRequestId]: true }));
    try {
      const res = await axios.post(`${API}/api/chat/respond`, {
        id: chatRequestId,
        status: action,
      });
      if (res.data?.success) {
        // Remove from the list after responding
        setChatRequests((prev) => prev.filter((p) => String(p.id) !== String(chatRequestId)));
        
        // Dispatch event to update Header badge
        window.dispatchEvent(new CustomEvent("incoming_interest_update"));
        
        // If accepted, navigate to chat
        if (action === "accepted" && res.data.chatInterest) {
          const partnerId = res.data.chatInterest.from_matriid;
          navigate(`/chat/${partnerId}`);
        }
      } else {
        alert("Failed to respond to chat request");
      }
    } catch (e) {
      console.error("respondToChatRequest error", e);
      alert("Failed to respond. Try again.");
    } finally {
      setChatBusyMap((b) => ({ ...b, [chatRequestId]: false }));
    }
  };

  if (!loggedId) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-3">Interests</h2>
          <div className="text-red-500">
            Please log in to view incoming interests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-display">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 mt-20">
          <h1 className="text-2xl font-bold">Incoming Requests</h1>
          <div className="text-sm text-gray-500">Logged in as {loggedId}</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === "profile"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile Interests
            {incoming.filter(i => i.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-rose-100 text-rose-600 rounded-full">
                {incoming.filter(i => i.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === "chat"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Chat Requests
            {chatRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                {chatRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Profile Interests Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-6 bg-white rounded shadow">Loading...</div>
            ) : incoming.length === 0 ? (
              <div className="p-6 bg-white rounded shadow text-gray-600">
                No incoming profile interests yet. When someone sends interest, you'll see
                it here in real-time.
              </div>
            ) : null}

            {incoming.map((item) => {
              const id = item.id;
              const from = item.from_matriid || item.fromMatriID || "Unknown";
              const created =
                item.created_at || item.createdAt || item.created || "";
              const status = item.status || "pending";

              return (
                <div
                  key={id}
                  className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">From</div>
                        <div className="font-semibold">{from}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Sent:{" "}
                          {created ? new Date(created).toLocaleString() : "—"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                          } ${
                            status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : ""
                          } ${
                            status === "rejected" ? "bg-red-100 text-red-800" : ""
                          }`}
                        >
                          {status.toUpperCase()}
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/profile/view/${from}`}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Sender Profile
                          </Link>
                        </div>
                      </div>
                    </div>

                    {item.note && (
                      <div className="mt-3 text-sm text-gray-600">
                        {item.note}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {status === "pending" && (
                      <>
                        <button
                          onClick={() => respond(id, "accepted")}
                          disabled={!!busyMap[id]}
                          className="px-4 py-2 rounded bg-green-600 text-white hover:opacity-90 disabled:opacity-60"
                        >
                          {busyMap[id] ? "Please wait..." : "Accept"}
                        </button>
                        <button
                          onClick={() => respond(id, "rejected")}
                          disabled={!!busyMap[id]}
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                        >
                          {busyMap[id] ? "Please wait..." : "Reject"}
                        </button>
                      </>
                    )}

                    {status !== "pending" && (
                      <div className="text-sm text-gray-600">
                        {status === "accepted" ? "✓ Accepted" : "✗ Rejected"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Chat Requests Tab */}
        {activeTab === "chat" && (
          <div className="space-y-4">
            {chatLoading ? (
              <div className="p-6 bg-white rounded shadow">Loading...</div>
            ) : chatRequests.length === 0 ? (
              <div className="p-6 bg-white rounded shadow text-gray-600">
                No incoming chat requests yet. When someone wants to chat with you, 
                you'll see it here in real-time.
              </div>
            ) : null}

            {chatRequests.map((item) => {
              const id = item.id;
              const from = item.from_matriid || "Unknown";
              const name = item.Name || from;
              const created = item.created_at || "";
              const photoURL = item.PhotoURL || null;

              return (
                <div
                  key={id}
                  className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {photoURL ? (
                      <img 
                        src={photoURL} 
                        alt={name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-green-200"
                        onError={(e) => {
                          e.currentTarget.src = "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">👤</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{name}</div>
                        <div className="text-sm text-gray-500">{from}</div>
                        {item.City && (
                          <div className="text-xs text-gray-400">{item.City}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Sent: {created ? new Date(created).toLocaleString() : "—"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          💬 CHAT REQUEST
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/profile/view/${from}`}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => respondToChatRequest(id, "accepted")}
                      disabled={!!chatBusyMap[id]}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:opacity-90 disabled:opacity-60 flex items-center gap-1"
                    >
                      {chatBusyMap[id] ? "Please wait..." : (
                        <>
                          <span>Accept</span>
                          <span className="text-lg">💬</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => respondToChatRequest(id, "rejected")}
                      disabled={!!chatBusyMap[id]}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                    >
                      {chatBusyMap[id] ? "..." : "Decline"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
