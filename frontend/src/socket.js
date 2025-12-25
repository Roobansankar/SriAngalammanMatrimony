// src/socket.js
import { io } from "socket.io-client";

let socket = null;
let url = process.env.REACT_APP_SOCKET_URL || undefined; // default: same origin (socket.io client connects to current host)

const STORAGE_KEY = "app_notifications_v1";
let handlersAttached = false;

function pushNotificationToLocalStorage(n) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const out = [n, ...arr].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    // notify other parts of app (header badge, pages)
    try {
      window.dispatchEvent(
        new CustomEvent("app_notifications_updated", { detail: out })
      );
    } catch {}
  } catch (e) {
    console.warn("pushNotificationToLocalStorage error", e);
  }
}

export function getSocket() {
  return socket;
}

export function connectSocket() {
  if (socket && socket.connected) return socket;

  socket = io(url, { autoConnect: true, transports: ["websocket", "polling"] });

  socket.on("connect", () => {
    console.log("socket connected:", socket.id);

    // auto-register the socket with logged user's matriid/email from localStorage
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const user = JSON.parse(raw);
        const key = (user?.MatriID || user?.matid || user?.email || "")
          .toString()
          .trim();
        if (key) {
          socket.emit("register", {
            matriid: key,
            email: user?.ConfirmEmail || user?.email,
          });
          console.log("socket register emitted for", key);
        }
      }
    } catch (e) {
      console.warn("socket register failed", e);
    }

    // Attach global notification handlers once
    if (!handlersAttached) {
      handlersAttached = true;

      // interest_received => usually recipient receives this
      socket.on("interest_received", (payload) => {
        try {
          const interest = payload?.interest;
          if (!interest) return;
          pushNotificationToLocalStorage({
            id: `received_${interest.id}_${Date.now()}`,
            type: "received",
            interest,
            message: `New interest from ${
              interest.from_matriid || interest.fromMatriID
            }`,
            createdAt: interest.created_at || new Date().toISOString(),
            read: false,
          });
          window.dispatchEvent(new CustomEvent("incoming_interest_update"));
          console.debug("socket: interest_received stored", interest?.id);
        } catch (e) {
          console.error("interest_received handler error", e);
        }
      });

      // interest_response => when recipient ACCEPTS/REJECTS (sender should receive this)
      socket.on("interest_response", (payload) => {
        try {
          const interest = payload?.interest;
          const action = payload?.action || interest?.status;
          if (!interest) return;
          pushNotificationToLocalStorage({
            id: `response_${interest.id}_${Date.now()}`,
            type: "response",
            interest,
            message: `Your interest to ${
              interest.to_matriid || interest.toMatriID
            } was ${action}`,
            createdAt: interest.updated_at || new Date().toISOString(),
            read: false,
          });
          console.debug("socket: interest_response stored", interest?.id);
        } catch (e) {
          console.error("interest_response handler error", e);
        }
      });

      // interest_update => general updates
      socket.on("interest_update", (payload) => {
        try {
          const interest = payload?.interest;
          if (!interest) return;
          pushNotificationToLocalStorage({
            id: `update_${interest.id}_${Date.now()}`,
            type: "update",
            interest,
            message: `Interest updated: ${
              interest.from_matriid || interest.fromMatriID
            } ⇒ ${interest.to_matriid || interest.toMatriID} (${
              interest.status
            })`,
            createdAt: interest.updated_at || new Date().toISOString(),
            read: false,
          });
          console.debug("socket: interest_update stored", interest?.id);
        } catch (e) {
          console.error("interest_update handler error", e);
        }
      });

      // chat_message => real-time chat notification
      socket.on("chat_message", (payload) => {
        try {
          const msg = payload?.message;
          if (!msg) return;
          // Push a chat notification to localStorage
          pushNotificationToLocalStorage({
            id: `chat_${msg.id}_${Date.now()}`,
            type: "chat",
            message: `New message from ${msg.from_matriid}: ${msg.message?.substring(0, 50)}${msg.message?.length > 50 ? '...' : ''}`,
            from_matriid: msg.from_matriid,
            createdAt: msg.created_at || new Date().toISOString(),
            read: false,
          });
          console.debug("socket: chat_message stored", msg?.id);
        } catch (e) {
          console.error("chat_message handler error", e);
        }
      });

      socket.on("chat_request_received", (payload) => {
        try {
          const req = payload?.request;
          if (!req) return;
          pushNotificationToLocalStorage({
            id: `chat_request_${req.id}_${Date.now()}`,
            type: "chat_request",
            request: req,
            message: `New chat request from ${req.from_matriid}`,
            from_matriid: req.from_matriid,
            createdAt: req.created_at || new Date().toISOString(),
            read: false,
          });
          window.dispatchEvent(new CustomEvent("incoming_interest_update"));
          console.debug("socket: chat_request_received stored", req?.id);
        } catch (e) {
          console.error("chat_request_received handler error", e);
        }
      });

      socket.on("chat_request_response", (payload) => {
        try {
          const req = payload?.request;
          const action = payload?.action || req?.status;
          if (!req) return;
          pushNotificationToLocalStorage({
            id: `chat_response_${req.id}_${Date.now()}`,
            type: "chat_response",
            request: req,
            message: `Your chat request to ${req.to_matriid} was ${action}`,
            to_matriid: req.to_matriid,
            createdAt: req.updated_at || new Date().toISOString(),
            read: false,
          });
          console.debug("socket: chat_request_response stored", req?.id);
        } catch (e) {
          console.error("chat_request_response handler error", e);
        }
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", reason);
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
  handlersAttached = false;
}
