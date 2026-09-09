// src/components/InterestsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API, API_BASE } from "../config/api";
import { connectSocket, getSocket } from "../socket";

const FALLBACK_PHOTO = "nophoto.jpg";

function makePhotoUrl(photo, photoApprove) {
  const hasPhoto =
    photo &&
    photo !== "no-photo.jpg" &&
    photo !== "nophoto.jpg" &&
    String(photoApprove).toLowerCase() === "yes";
  const file = hasPhoto ? photo : FALLBACK_PHOTO;
  return `${API_BASE}/gallery/${encodeURIComponent(file)}`;
}

export default function InterestsPage() {
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [chatRequests, setChatRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outgoingLoading, setOutgoingLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [busyMap, setBusyMap] = useState({});
  const [chatBusyMap, setChatBusyMap] = useState({});
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("received");

  const logged = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();

  const loggedId = (logged?.MatriID || logged?.matid || "").toString().trim() || null;

  const fetchProfileSummary = async (matriid) => {
    try {
      const res = await axios.get(`${API}/auth/searchByMatriID`, { params: { matriid } });
      if (res.data?.success && res.data.user) return res.data.user;
      return null;
    } catch (e) {
      console.error("fetchProfileSummary error", e);
      return null;
    }
  };

  const loadChatRequests = async () => {
    if (!loggedId) return;
    setChatLoading(true);
    try {
      const res = await axios.get(`${API}/chat/requests`, { params: { matriid: loggedId } });
      if (res.data?.success) {
        setChatRequests(Array.isArray(res.data.requests) ? res.data.requests : []);
      }
    } catch (e) {
      console.warn("Failed to fetch chat requests:", e);
    } finally {
      setChatLoading(false);
    }
  };

  const loadOutgoing = async () => {
    if (!loggedId) return;
    setOutgoingLoading(true);
    try {
      const res = await axios.get(`${API}/auth/interest/outgoing`, { params: { from: loggedId } });
      if (res.data?.success) {
        setOutgoing(Array.isArray(res.data.outgoing) ? res.data.outgoing : []);
      } else {
        setOutgoing([]);
      }
    } catch (e) {
      console.warn("Failed to fetch outgoing interests:", e);
      setOutgoing([]);
    } finally {
      setOutgoingLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadIncoming = async () => {
      if (!loggedId) {
        setError("Please log in to view your interests");
        setLoading(false);
        setChatLoading(false);
        setOutgoingLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/auth/interest/incoming`, { params: { to: loggedId } });
        if (!mounted) return;
        if (res.data?.success) {
          setIncoming(Array.isArray(res.data.incoming) ? res.data.incoming : []);
        } else {
          setIncoming([]);
        }
      } catch (e) {
        console.warn("Failed to fetch incoming interests:", e);
        setIncoming([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadIncoming();
    loadOutgoing();
    loadChatRequests();
    return () => { mounted = false; };
  }, [loggedId]);

  // Socket listeners
  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const onReceived = (payload) => {
      try {
        const interest = payload?.interest;
        if (!interest) return;
        const to = (interest.to_matriid || interest.toMatriID || "").toString().trim().toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;
        setIncoming((prev) => {
          const exists = prev.some((p) => String(p.id) === String(interest.id));
          if (exists) return prev.map((p) => String(p.id) === String(interest.id) ? { ...interest, senderName: payload?.fromName || interest.senderName } : p);
          return [{ ...interest, senderName: payload?.fromName || interest.senderName }, ...prev];
        });
      } catch (e) { console.error("onReceived error", e); }
    };

    const onUpdate = (payload) => {
      try {
        const interest = payload?.interest;
        if (!interest) return;
        const to = (interest.to_matriid || interest.toMatriID || "").toString().trim().toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;
        setIncoming((prev) => prev.map((p) => String(p.id) === String(interest.id) ? { ...p, ...interest } : p));
      } catch (e) { console.error("onUpdate error", e); }
    };

    const onResponse = (payload) => {
      try {
        const interest = payload?.interest;
        if (!interest) return;
        const from = (interest.from_matriid || interest.fromMatriID || "").toString().trim().toLowerCase();
        if (!loggedId || from !== loggedId.toLowerCase()) return;
        setOutgoing((prev) => prev.map((p) => String(p.id) === String(interest.id) ? { ...p, ...interest } : p));
      } catch (e) { console.error("onResponse error", e); }
    };

    const onChatRequestReceived = (payload) => {
      try {
        const chatInterest = payload?.chatInterest;
        if (!chatInterest) return;
        const to = (chatInterest.to_matriid || "").toString().trim().toLowerCase();
        if (!loggedId || to !== loggedId.toLowerCase()) return;
        setChatRequests((prev) => {
          const exists = prev.some((p) => String(p.id) === String(chatInterest.id));
          if (exists) return prev;
          return [{ ...chatInterest, Name: payload?.fromName || chatInterest.from_matriid }, ...prev];
        });
      } catch (e) { console.error("onChatRequestReceived error", e); }
    };

    const onChatRequestResponse = (payload) => {
      try {
        const chatInterest = payload?.chatInterest;
        if (!chatInterest) return;
        setChatRequests((prev) => prev.filter((p) => String(p.id) !== String(chatInterest.id)));
      } catch (e) { console.error("onChatRequestResponse error", e); }
    };

    socket?.on("interest_received", onReceived);
    socket?.on("interest_update", onUpdate);
    socket?.on("interest_response", onResponse);
    socket?.on("chat_request_received", onChatRequestReceived);
    socket?.on("chat_request_response", onChatRequestResponse);

    return () => {
      socket?.off("interest_received", onReceived);
      socket?.off("interest_update", onUpdate);
      socket?.off("interest_response", onResponse);
      socket?.off("chat_request_received", onChatRequestReceived);
      socket?.off("chat_request_response", onChatRequestResponse);
    };
  }, [loggedId]);

  // Respond to incoming interest
  const respond = async (interestId, action) => {
    if (!interestId || !["accepted", "rejected"].includes(action)) return;
    setBusyMap((b) => ({ ...b, [interestId]: true }));
    try {
      const res = await axios.post(`${API}/auth/interest/respond`, { interestId, action });
      if (res.data?.success && res.data.interest) {
        setIncoming((prev) =>
          prev.map((p) => String(p.id) === String(res.data.interest.id) ? { ...p, ...res.data.interest } : p)
        );
        window.dispatchEvent(new CustomEvent("incoming_interest_update"));
        if (res.data.interest.status === "accepted") {
          const updated = res.data.interest;
          const senderMatri = updated.from_matriid || updated.fromMatriID;
          if (senderMatri) {
            const profile = await fetchProfileSummary(senderMatri);
            setIncoming((prev) =>
              prev.map((p) => String(p.id) === String(updated.id) ? { ...p, senderProfile: profile, ...updated } : p)
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

  const respondToChatRequest = async (chatRequestId, action) => {
    if (!chatRequestId || !["accepted", "rejected"].includes(action)) return;
    setChatBusyMap((b) => ({ ...b, [chatRequestId]: true }));
    try {
      const res = await axios.post(`${API}/chat/respond`, { id: chatRequestId, status: action });
      if (res.data?.success) {
        setChatRequests((prev) => prev.filter((p) => String(p.id) !== String(chatRequestId)));
        window.dispatchEvent(new CustomEvent("incoming_interest_update"));
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
          <div className="text-red-500">Please log in to view incoming interests.</div>
        </div>
      </div>
    );
  }

  const receivedCount = incoming.filter((i) => i.status === "pending").length;
  const sentPendingCount = outgoing.filter((i) => i.status === "pending").length;

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-display">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 mt-20">
          <h1 className="text-2xl font-bold">Interests</h1>
          <div className="text-sm text-gray-500">Logged in as {loggedId}</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === "received" ? "border-rose-500 text-rose-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Received
            {receivedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-rose-100 text-rose-600 rounded-full">{receivedCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === "sent" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sent
            {sentPendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">{sentPendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === "chat" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Chat Requests
            {chatRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">{chatRequests.length}</span>
            )}
          </button>
        </div>

        {/* Received Interests Tab */}
        {activeTab === "received" && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-6 bg-white rounded shadow">Loading...</div>
            ) : incoming.length === 0 ? (
              <div className="p-6 bg-white rounded shadow text-gray-600">
                No incoming interests yet. When someone sends interest, you'll see it here in real-time.
              </div>
            ) : null}

            {incoming.map((item) => {
              const id = item.id;
              const from = item.from_matriid || item.fromMatriID || "Unknown";
              const name = item.senderName || from;
              const created = item.created_at || item.createdAt || "";
              const status = item.status || "pending";
              const photo = item.senderPhoto;
              const photoApprove = item.senderPhotoApprove;
              const photoUrl = makePhotoUrl(photo, photoApprove);

              return (
                <div key={id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={photoUrl}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-200"
                      onError={(e) => { e.currentTarget.src = `${API_BASE}/gallery/nophoto.jpg`; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{name}</div>
                        <div className="text-sm text-gray-500">{from}</div>
                        {item.senderCity && <div className="text-xs text-gray-400">{item.senderCity}</div>}
                        <div className="text-xs text-gray-400 mt-1">
                          Sent: {created ? new Date(created).toLocaleString() : "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          status === "pending" ? "bg-yellow-100 text-yellow-800" : ""
                        } ${status === "accepted" ? "bg-green-100 text-green-800" : ""} ${
                          status === "rejected" ? "bg-red-100 text-red-800" : ""
                        }`}>
                          {status.toUpperCase()}
                        </div>
                        <div className="mt-2">
                          <Link to={`/profile/view/${from}`} className="text-blue-600 text-sm hover:underline">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {status === "pending" && (
                      <>
                        <button onClick={() => respond(id, "accepted")} disabled={!!busyMap[id]}
                          className="px-4 py-2 rounded bg-green-600 text-white hover:opacity-90 disabled:opacity-60">
                          {busyMap[id] ? "Please wait..." : "Accept"}
                        </button>
                        <button onClick={() => respond(id, "rejected")} disabled={!!busyMap[id]}
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60">
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

        {/* Sent Interests Tab */}
        {activeTab === "sent" && (
          <div className="space-y-4">
            {outgoingLoading ? (
              <div className="p-6 bg-white rounded shadow">Loading...</div>
            ) : outgoing.length === 0 ? (
              <div className="p-6 bg-white rounded shadow text-gray-600">
                You haven't sent any interests yet. Browse profiles and send interest to start connecting.
              </div>
            ) : null}

            {outgoing.map((item) => {
              const id = item.id;
              const to = item.to_matriid || "Unknown";
              const name = item.recipientName || to;
              const created = item.created_at || "";
              const status = item.status || "pending";
              const photo = item.recipientPhoto;
              const photoApprove = item.recipientPhotoApprove;
              const photoUrl = makePhotoUrl(photo, photoApprove);

              return (
                <div key={id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={photoUrl}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-200"
                      onError={(e) => { e.currentTarget.src = `${API_BASE}/gallery/nophoto.jpg`; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{name}</div>
                        <div className="text-sm text-gray-500">{to}</div>
                        {item.recipientCity && <div className="text-xs text-gray-400">{item.recipientCity}</div>}
                        <div className="text-xs text-gray-400 mt-1">
                          Sent: {created ? new Date(created).toLocaleString() : "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          status === "pending" ? "bg-yellow-100 text-yellow-800" : ""
                        } ${status === "accepted" ? "bg-green-100 text-green-800" : ""} ${
                          status === "rejected" ? "bg-red-100 text-red-800" : ""
                        }`}>
                          {status.toUpperCase()}
                        </div>
                        <div className="mt-2">
                          <Link to={`/profile/view/${to}`} className="text-blue-600 text-sm hover:underline">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {status === "pending" && (
                      <div className="text-sm text-gray-500">Awaiting response</div>
                    )}
                    {status === "accepted" && (
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-green-600">✓ Accepted</div>
                        <Link to={`/chat/${to}`}
                          className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:opacity-90">
                          Message
                        </Link>
                      </div>
                    )}
                    {status === "rejected" && (
                      <div className="text-sm text-red-500">✗ Rejected</div>
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
                No incoming chat requests yet. When someone wants to chat with you, you'll see it here in real-time.
              </div>
            ) : null}

            {chatRequests.map((item) => {
              const id = item.id;
              const from = item.from_matriid || "Unknown";
              const name = item.Name || from;
              const created = item.created_at || "";
              const photoURL = item.PhotoURL || null;

              return (
                <div key={id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    {photoURL ? (
                      <img src={photoURL} alt={name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-green-200"
                        onError={(e) => { e.currentTarget.src = `${API_BASE}/gallery/nophoto.jpg`; }}
                      />
                    ) : (
                      <img
                        src={`${API_BASE}/gallery/nophoto.jpg`}
                        alt={name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-green-200"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{name}</div>
                        <div className="text-sm text-gray-500">{from}</div>
                        {item.City && <div className="text-xs text-gray-400">{item.City}</div>}
                        <div className="text-xs text-gray-400 mt-1">
                          Sent: {created ? new Date(created).toLocaleString() : "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          💬 CHAT REQUEST
                        </div>
                        <div className="mt-2">
                          <Link to={`/profile/view/${from}`} className="text-blue-600 text-sm hover:underline">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button onClick={() => respondToChatRequest(id, "accepted")} disabled={!!chatBusyMap[id]}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:opacity-90 disabled:opacity-60 flex items-center gap-1">
                      {chatBusyMap[id] ? "Please wait..." : (<><span>Accept</span><span className="text-lg">💬</span></>)}
                    </button>
                    <button onClick={() => respondToChatRequest(id, "rejected")} disabled={!!chatBusyMap[id]}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60">
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
