// src/socket.js
import { io } from "socket.io-client";

let socket = null;
let url = process.env.REACT_APP_SOCKET_URL || undefined;

const STORAGE_KEY = "app_notifications_v1";

function pushNotificationToLocalStorage(n) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const out = [n, ...arr].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    try {
      window.dispatchEvent(
        new CustomEvent("app_notifications_updated", { detail: out })
      );
    } catch {}
  } catch (e) {
    console.warn("pushNotificationToLocalStorage error", e);
  }
}

function attachHandlers(s) {
  if (!s) return;

  s.on("interest_received", (payload) => {
    try {
      const interest = payload?.interest;
      if (!interest) return;
      const fromName = payload?.fromName || interest.from_matriid || interest.fromMatriID;
      pushNotificationToLocalStorage({
        id: `received_${interest.id}_${Date.now()}`,
        type: "received",
        interest,
        fromName,
        message: `New interest from ${fromName}`,
        createdAt: interest.created_at || new Date().toISOString(),
        read: false,
      });
      window.dispatchEvent(new CustomEvent("incoming_interest_update"));
      console.debug("socket: interest_received stored", interest?.id);
    } catch (e) {
      console.error("interest_received handler error", e);
    }
  });

  s.on("interest_response", (payload) => {
    try {
      const interest = payload?.interest;
      const action = payload?.action || interest?.status;
      if (!interest) return;
      const fromName = payload?.fromName || interest.to_matriid || interest.toMatriID;
      pushNotificationToLocalStorage({
        id: `response_${interest.id}_${Date.now()}`,
        type: "response",
        interest,
        fromName,
        message: `Your interest to ${fromName} was ${action}`,
        createdAt: interest.updated_at || new Date().toISOString(),
        read: false,
      });
      console.debug("socket: interest_response stored", interest?.id);
    } catch (e) {
      console.error("interest_response handler error", e);
    }
  });

  s.on("interest_update", (payload) => {
    try {
      const interest = payload?.interest;
      if (!interest) return;
      pushNotificationToLocalStorage({
        id: `update_${interest.id}_${Date.now()}`,
        type: "update",
        interest,
        message: `Interest updated: ${interest.from_matriid || interest.fromMatriID} => ${interest.to_matriid || interest.toMatriID} (${interest.status})`,
        createdAt: interest.updated_at || new Date().toISOString(),
        read: false,
      });
      console.debug("socket: interest_update stored", interest?.id);
    } catch (e) {
      console.error("interest_update handler error", e);
    }
  });

  s.on("chat_message", (payload) => {
    try {
      const msg = payload?.message;
      if (!msg) return;
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

  s.on("chat_request_received", (payload) => {
    try {
      const chatInterest = payload?.chatInterest;
      if (!chatInterest) return;
      pushNotificationToLocalStorage({
        id: `chat_request_${chatInterest.id}_${Date.now()}`,
        type: "chat_request",
        chatInterest,
        message: `New chat request from ${payload?.fromName || chatInterest.from_matriid}`,
        from_matriid: chatInterest.from_matriid,
        fromName: payload?.fromName,
        createdAt: chatInterest.created_at || new Date().toISOString(),
        read: false,
      });
      window.dispatchEvent(new CustomEvent("incoming_interest_update"));
      console.debug("socket: chat_request_received stored", chatInterest?.id);
    } catch (e) {
      console.error("chat_request_received handler error", e);
    }
  });

  s.on("chat_request_response", (payload) => {
    try {
      const chatInterest = payload?.chatInterest;
      const action = payload?.status || chatInterest?.status;
      if (!chatInterest) return;
      pushNotificationToLocalStorage({
        id: `chat_response_${chatInterest.id}_${Date.now()}`,
        type: "chat_response",
        chatInterest,
        message: `Your chat request was ${action}`,
        from_matriid: payload?.from_matriid || chatInterest.to_matriid,
        fromName: payload?.fromName,
        to_matriid: chatInterest.to_matriid,
        createdAt: chatInterest.updated_at || new Date().toISOString(),
        read: false,
      });
      console.debug("socket: chat_request_response stored", chatInterest?.id);
    } catch (e) {
      console.error("chat_request_response handler error", e);
    }
  });
}

function registerSocket(s) {
  try {
    const raw = localStorage.getItem("userData");
    if (raw) {
      const user = JSON.parse(raw);
      const key = (user?.MatriID || user?.matid || user?.email || "").toString().trim();
      if (key) {
        s.emit("register", { matriid: key, email: user?.ConfirmEmail || user?.email });
        console.log("socket register emitted for", key);
      }
    }
  } catch (e) {
    console.warn("socket register failed", e);
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
    registerSocket(socket);
    attachHandlers(socket);
  });

  socket.on("reconnect", () => {
    console.log("socket reconnected:", socket.id);
    registerSocket(socket);
    attachHandlers(socket);
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("socket connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
