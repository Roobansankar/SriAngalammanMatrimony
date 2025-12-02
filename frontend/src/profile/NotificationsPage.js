// // src/components/NotificationsPage.jsx
// import React, { useEffect, useState } from "react";
// import { connectSocket, getSocket } from "../socket";
// import axios from "axios";

// const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";
// const STORAGE_KEY = "app_notifications_v1";

// function humanTime(ts) {
//   try {
//     const d = new Date(ts);
//     return d.toLocaleString();
//   } catch {
//     return ts;
//   }
// }

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
//     } catch {
//       return [];
//     }
//   });

//   useEffect(() => {
//     connectSocket();
//     const socket = getSocket();

//     const addNotification = (n) => {
//       setNotifications((prev) => {
//         const out = [n, ...prev].slice(0, 200); // limit size
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
//         return out;
//       });
//     };

//     const onInterestReceived = (payload) => {
//       const interest = payload?.interest;
//       if (!interest) return;
//       addNotification({
//         id: `received_${interest.id}_${Date.now()}`,
//         type: "received",
//         interest,
//         message: `New interest from ${
//           interest.from_matriid || interest.fromMatriID
//         }`,
//         createdAt: interest.created_at || new Date().toISOString(),
//         read: false,
//       });
//     };

//     const onInterestResponse = (payload) => {
//       const interest = payload?.interest;
//       const action = payload?.action || interest?.status;
//       if (!interest) return;
//       addNotification({
//         id: `response_${interest.id}_${Date.now()}`,
//         type: "response",
//         interest,
//         message: `Your interest to ${
//           interest.to_matriid || interest.toMatriID
//         } was ${action}`,
//         createdAt: interest.updated_at || new Date().toISOString(),
//         read: false,
//       });
//     };

//     const onInterestUpdate = (payload) => {
//       const interest = payload?.interest;
//       if (!interest) return;
//       addNotification({
//         id: `update_${interest.id}_${Date.now()}`,
//         type: "update",
//         interest,
//         message: `Interest updated: ${
//           interest.from_matriid || interest.fromMatriID
//         } ⇒ ${interest.to_matriid || interest.toMatriID} (${interest.status})`,
//         createdAt: interest.updated_at || new Date().toISOString(),
//         read: false,
//       });
//     };

//     socket?.on("interest_received", onInterestReceived);
//     socket?.on("interest_response", onInterestResponse);
//     socket?.on("interest_update", onInterestUpdate);

//     return () => {
//       socket?.off("interest_received", onInterestReceived);
//       socket?.off("interest_response", onInterestResponse);
//       socket?.off("interest_update", onInterestUpdate);
//     };
//   }, []);

//   const markRead = (id) => {
//     setNotifications((prev) => {
//       const out = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
//       return out;
//     });
//   };

//   const markAllRead = () => {
//     setNotifications((prev) => {
//       const out = prev.map((n) => ({ ...n, read: true }));
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
//       return out;
//     });
//   };

//   const clearAll = () => {
//     setNotifications([]);
//     localStorage.removeItem(STORAGE_KEY);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Notifications</h1>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={markAllRead}
//               className="px-3 py-1 bg-gray-200 rounded"
//             >
//               Mark all read
//             </button>
//             <button onClick={clearAll} className="px-3 py-1 bg-red-100 rounded">
//               Clear
//             </button>
//           </div>
//         </div>

//         {notifications.length === 0 ? (
//           <div className="p-6 bg-white rounded shadow text-gray-600">
//             No notifications yet.
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {notifications.map((n) => (
//               <div
//                 key={n.id}
//                 className={`p-4 bg-white rounded shadow flex justify-between items-start ${
//                   n.read ? "" : "ring-1 ring-yellow-200"
//                 }`}
//               >
//                 <div>
//                   <div className="text-sm text-gray-500">
//                     {n.type.toUpperCase()} • {humanTime(n.createdAt)}
//                   </div>
//                   <div className="font-medium mt-1">{n.message}</div>
//                   {n.interest && (
//                     <div className="mt-2 text-xs text-gray-600">
//                       From: {n.interest.from_matriid || n.interest.fromMatriID}{" "}
//                       • To: {n.interest.to_matriid || n.interest.toMatriID} •
//                       Status: {n.interest.status}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-col items-end gap-2">
//                   {!n.read && (
//                     <button
//                       onClick={() => markRead(n.id)}
//                       className="px-2 py-1 bg-green-600 text-white rounded text-sm"
//                     >
//                       Mark read
//                     </button>
//                   )}
//                   <a
//                     href={`/profile/view/${
//                       n.interest?.from_matriid ||
//                       n.interest?.fromMatriID ||
//                       n.interest?.to_matriid ||
//                       n.interest?.toMatriID ||
//                       ""
//                     }`}
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     View profile
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/NotificationsPage.jsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const STORAGE_KEY = "app_notifications_v1";

function humanTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return ts;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [nameCache, setNameCache] = useState({});
  const fetchedRef = useRef(new Set());

  const logged = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();
  const loggedId =
    (logged?.MatriID || logged?.matid || logged?.email || "")
      .toString()
      .trim()
      .toLowerCase() || null;

  useEffect(() => {
    const fetchNames = async () => {
      const idsToFetch = new Set();
      
      notifications.forEach((n) => {
        if (n.type === 'chat' && n.from_matriid) {
          if (!fetchedRef.current.has(n.from_matriid)) {
            idsToFetch.add(n.from_matriid);
          }
        }
        
        if (n.from_matriid && !fetchedRef.current.has(n.from_matriid)) {
          idsToFetch.add(n.from_matriid);
        }
        
        if (n.interest) {
          const from = n.interest.from_matriid || n.interest.fromMatriID;
          const to = n.interest.to_matriid || n.interest.toMatriID;
          if (from && !fetchedRef.current.has(from)) {
            idsToFetch.add(from);
          }
          if (to && !fetchedRef.current.has(to)) {
            idsToFetch.add(to);
          }
        }
      });

      if (idsToFetch.size === 0) return;

      idsToFetch.forEach(id => fetchedRef.current.add(id));

      const newNames = {};
      for (const matriId of idsToFetch) {
        try {
          const res = await axios.get(`${API}/api/chat/partner-profile/${encodeURIComponent(matriId)}`);
          if (res.data?.success && res.data?.partner?.Name) {
            newNames[matriId] = res.data.partner.Name;
          }
        } catch (err) {
        }
      }

      if (Object.keys(newNames).length > 0) {
        setNameCache(prev => ({ ...prev, ...newNames }));
      }
    };

    if (notifications.length > 0) {
      fetchNames();
    }
  }, [notifications]);

  const getDisplayName = (matriId, fallbackName) => {
    if (fallbackName && !fallbackName.match(/^[A-Z]{2,4}\d+$/i)) {
      return fallbackName;
    }
    return nameCache[matriId] || fallbackName || matriId;
  };

  const getDisplayMessage = (n) => {
    if (n.type === "chat") {
      const fromId = n.from_matriid;
      const name = getDisplayName(fromId, n.fromName);
      const msgMatch = n.message?.match(/New message from [^:]+: (.+)/);
      const content = msgMatch ? msgMatch[1] : n.message;
      return `New message from ${name}: ${content}`;
    }
    
    if (n.type === "chat_request") {
      const fromId = n.from_matriid;
      const name = getDisplayName(fromId, n.fromName);
      return `💬 ${name} wants to chat with you`;
    }
    
    if (n.type === "chat_response") {
      const fromId = n.from_matriid;
      const name = getDisplayName(fromId, n.fromName);
      const status = n.chatInterest?.status || "responded to";
      return `💬 ${name} ${status} your chat request`;
    }
    
    if (!n.interest) return n.message;
    
    const from = n.interest.from_matriid || n.interest.fromMatriID;
    const to = n.interest.to_matriid || n.interest.toMatriID;
    
    if (n.type === "received") {
      const name = getDisplayName(from, n.fromName);
      return `New interest from ${name}`;
    } else if (n.type === "response") {
      const name = getDisplayName(to, n.fromName);
      return `Your interest to ${name} was ${n.interest.status}`;
    } else if (n.type === "update") {
      return `Interest status updated: ${n.interest.status}`;
    }
    return n.message;
  };

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const addNotification = (n) => {
      setNotifications((prev) => {
        const out = [n, ...prev].slice(0, 200);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
        try {
          window.dispatchEvent(
            new CustomEvent("app_notifications_updated", { detail: out })
          );
        } catch {}
        return out;
      });
    };

    const onInterestReceived = (payload) => {
      const interest = payload?.interest;
      if (!interest) return;
      const fromName = payload?.fromName || interest.from_matriid || interest.fromMatriID;
      addNotification({
        id: `received_${interest.id}_${Date.now()}`,
        type: "received",
        interest,
        fromName,
        message: `New interest from ${fromName}`,
        createdAt: interest.created_at || new Date().toISOString(),
        read: false,
      });
    };

    const onInterestResponse = (payload) => {
      const interest = payload?.interest;
      const action = payload?.action || interest?.status;
      if (!interest) return;
      const fromName = payload?.fromName || interest.to_matriid || interest.toMatriID;
      addNotification({
        id: `response_${interest.id}_${Date.now()}`,
        type: "response",
        interest,
        fromName,
        message: `Your interest to ${fromName} was ${action}`,
        createdAt: interest.updated_at || new Date().toISOString(),
        read: false,
      });
    };

    const onInterestUpdate = (payload) => {
      const interest = payload?.interest;
      if (!interest) return;
      addNotification({
        id: `update_${interest.id}_${Date.now()}`,
        type: "update",
        interest,
        message: `Interest status updated: ${interest.status}`,
        createdAt: interest.updated_at || new Date().toISOString(),
        read: false,
      });
    };

    // Chat request received
    const onChatRequestReceived = (payload) => {
      const chatInterest = payload?.chatInterest;
      if (!chatInterest) return;
      const fromName = payload?.fromName || chatInterest.from_matriid;
      addNotification({
        id: `chat_request_${chatInterest.id}_${Date.now()}`,
        type: "chat_request",
        chatInterest,
        from_matriid: chatInterest.from_matriid,
        fromName,
        message: `${fromName} wants to chat with you`,
        createdAt: chatInterest.created_at || new Date().toISOString(),
        read: false,
      });
    };

    // Chat request response (my request was accepted/rejected)
    const onChatRequestResponse = (payload) => {
      const chatInterest = payload?.chatInterest;
      if (!chatInterest) return;
      const fromName = payload?.fromName || chatInterest.to_matriid;
      const status = payload?.status || chatInterest.status;
      addNotification({
        id: `chat_response_${chatInterest.id}_${Date.now()}`,
        type: "chat_response",
        chatInterest,
        from_matriid: chatInterest.to_matriid,
        fromName,
        message: `${fromName} ${status} your chat request`,
        createdAt: chatInterest.updated_at || new Date().toISOString(),
        read: false,
      });
    };

    socket?.on("interest_received", onInterestReceived);
    socket?.on("interest_response", onInterestResponse);
    socket?.on("interest_update", onInterestUpdate);
    socket?.on("chat_request_received", onChatRequestReceived);
    socket?.on("chat_request_response", onChatRequestResponse);

    return () => {
      socket?.off("interest_received", onInterestReceived);
      socket?.off("interest_response", onInterestResponse);
      socket?.off("interest_update", onInterestUpdate);
      socket?.off("chat_request_received", onChatRequestReceived);
      socket?.off("chat_request_response", onChatRequestResponse);
    };
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => {
      const out = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
      try {
        window.dispatchEvent(
          new CustomEvent("app_notifications_updated", { detail: out })
        );
      } catch {}
      return out;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
    try {
      window.dispatchEvent(
        new CustomEvent("app_notifications_updated", { detail: [] })
      );
    } catch {}
  };

  const computeTargetMatriId = (notification) => {
    if (!notification) return "";
    
    // Chat message notification
    if (notification.type === 'chat' && notification.from_matriid) {
      return notification.from_matriid;
    }
    
    // Chat request notification
    if (notification.type === 'chat_request' && notification.from_matriid) {
      return notification.from_matriid;
    }
    
    // Chat response notification
    if (notification.type === 'chat_response' && notification.from_matriid) {
      return notification.from_matriid;
    }
    
    if (notification.from_matriid) {
      return notification.from_matriid;
    }
    
    const interest = notification.interest;
    if (!interest) return "";
    
    const from = (interest.from_matriid || interest.fromMatriID || "")
      .toString()
      .trim();
    const to = (interest.to_matriid || interest.toMatriID || "")
      .toString()
      .trim();

    if (loggedId) {
      try {
        if (from.toLowerCase() === loggedId) {
          return to || from;
        }
        return from || to;
      } catch {
        return from || to;
      }
    }

    return from || to;
  };

  const handleViewProfile = (matriId) => {
    if (matriId) {
      navigate(`/profile/view/${encodeURIComponent(matriId)}`);
    }
  };

  const handleChat = (matriId, notificationId) => {
    setNotifications((prev) => {
      const out = prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
      try {
        window.dispatchEvent(
          new CustomEvent("app_notifications_updated", { detail: out })
        );
      } catch {}
      return out;
    });
    if (matriId) {
      navigate(`/chat/${encodeURIComponent(matriId)}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-display">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Mark all read
            </button>
            <button onClick={clearAll} className="px-3 py-1 bg-red-100 rounded">
              Clear
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-gray-600">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const otherMatriId = computeTargetMatriId(n);
              const displayMessage = getDisplayMessage(n);

              return (
                <div
                  key={n.id}
                  className={`p-4 bg-white rounded shadow flex justify-between items-start ${
                    n.read ? "" : "ring-1 ring-yellow-200"
                  }`}
                >
                  <div>
                    <div className="text-sm text-gray-500">
                      {n.type.toUpperCase()} • {humanTime(n.createdAt)}
                    </div>
                    <div className="font-medium mt-1">{displayMessage}</div>
                    {n.interest && (
                      <div className="mt-2 text-xs text-gray-600">
                        Status: {n.interest.status}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleChat(otherMatriId, n.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewProfile(otherMatriId)}
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                      View profile
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
