// src/socket.js
import { io } from "socket.io-client";
import { API } from "./config/api";

let socket = null;
const url = process.env.REACT_APP_SOCKET_URL || undefined;

const NOTIF_BASE_KEY = "app_notifications_v1";
const CLEARED_BASE_KEY = "app_notifications_cleared_at_v1";
const SYNC_MIN_GAP_MS = 5000; // don't hammer the server when many components call connectSocket()
const READ_AFTER_DAYS = 14; // server-side history older than this is added as "already read"

/* ------------------------------------------------------------------ */
/* Who is logged in                                                    */
/* ------------------------------------------------------------------ */

function currentUser() {
  try {
    const u = JSON.parse(localStorage.getItem("userData") || "null");
    const id = (u?.MatriID || u?.matid || u?.email || "").toString().trim();
    return { id, key: id.toLowerCase(), email: u?.ConfirmEmail || u?.email };
  } catch {
    return { id: "", key: "", email: undefined };
  }
}

/* ------------------------------------------------------------------ */
/* Notification storage — PER USER                                     */
/* Two accounts used in the same browser must not see each other's     */
/* notifications, so the storage key includes the logged-in user.      */
/* ------------------------------------------------------------------ */

export function getNotificationsKey() {
  const { key } = currentUser();
  return key ? `${NOTIF_BASE_KEY}:${key}` : NOTIF_BASE_KEY;
}

function getClearedKey() {
  const { key } = currentUser();
  return key ? `${CLEARED_BASE_KEY}:${key}` : CLEARED_BASE_KEY;
}

export function readNotifications() {
  try {
    const arr = JSON.parse(localStorage.getItem(getNotificationsKey()) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Save the list and tell the UI (header bell, notifications page) it changed. */
export function writeNotifications(out) {
  try {
    localStorage.setItem(getNotificationsKey(), JSON.stringify(out));
  } catch (e) {
    console.warn("writeNotifications error", e);
  }
  try {
    window.dispatchEvent(
      new CustomEvent("app_notifications_updated", { detail: out })
    );
  } catch {}
}

/** "Clear" pressed: empty the list and remember when, so history is not re-imported. */
export function markNotificationsCleared() {
  try {
    localStorage.setItem(getClearedKey(), String(Date.now()));
  } catch {}
  writeNotifications([]);
}

const toSec = (t) => {
  const ms = new Date(t).getTime();
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : 0;
};

/**
 * Stable identity of a notification. The same event can reach us twice — once
 * as a live socket push and once from the server feed — and this key lets us
 * keep just one of them.
 */
export function notificationKey(n) {
  const i = n?.interest;
  if (i && n.type === "response") {
    return `response:${i.id}:${i.status}:${toSec(i.updated_at)}`;
  }
  if (i && n.type === "received") {
    return `received:${i.id}:${toSec(i.updated_at || i.created_at)}`;
  }
  return n?.id;
}

function pushNotification(n) {
  const list = readNotifications();
  const key = notificationKey(n);
  if (key && list.some((x) => notificationKey(x) === key)) return;
  writeNotifications([n, ...list].slice(0, 200));
}

/* ------------------------------------------------------------------ */
/* Durable feed: catch up on what happened while we were offline       */
/* ------------------------------------------------------------------ */

function mergeServerNotifications(serverList) {
  const existing = readNotifications();
  const have = new Set(existing.map(notificationKey));
  const clearedAt = Number(localStorage.getItem(getClearedKey()) || 0);
  const readBefore = Date.now() - READ_AFTER_DAYS * 24 * 60 * 60 * 1000;

  const fresh = [];
  for (const s of serverList) {
    const i = s?.interest;
    if (!i) continue;

    const created = new Date(s.createdAt).getTime();
    if (created <= clearedAt) continue; // happened before the user cleared the list

    const n = {
      id: `srv_${s.type}_${i.id}_${i.status}_${toSec(i.updated_at)}`,
      type: s.type,
      interest: i,
      fromName: s.otherName,
      message:
        s.type === "response"
          ? `Your interest to ${s.otherName} was ${i.status}`
          : `New interest from ${s.otherName}`,
      createdAt: s.createdAt,
      read: created < readBefore,
    };

    const key = notificationKey(n);
    if (have.has(key)) continue;
    have.add(key);
    fresh.push(n);
  }

  if (!fresh.length) return 0;

  const out = [...fresh, ...existing]
    .sort(
      (a, b) =>
        (new Date(b.createdAt).getTime() || 0) -
        (new Date(a.createdAt).getTime() || 0)
    )
    .slice(0, 200);
  writeNotifications(out);
  return fresh.length;
}

let lastSync = { key: "", at: 0 };

/**
 * Pull accepted / rejected responses (to interests I sent) and unanswered
 * interests (sent to me) from the server and merge them into the local list.
 * Safe to call often: it is throttled and de-duplicated.
 */
export async function syncInterestNotifications({ force = false } = {}) {
  const { id, key } = currentUser();
  if (!id) return 0;

  const now = Date.now();
  if (!force && lastSync.key === key && now - lastSync.at < SYNC_MIN_GAP_MS) {
    return 0;
  }
  lastSync = { key, at: now };

  try {
    const res = await fetch(
      `${API}/auth/interest/notifications?matriid=${encodeURIComponent(id)}`
    );
    if (!res.ok) return 0;
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.notifications)) return 0;

    // Someone else may have logged in while the request was in flight.
    if (currentUser().key !== key) return 0;

    return mergeServerNotifications(data.notifications);
  } catch (e) {
    console.warn("syncInterestNotifications failed", e);
    return 0;
  }
}

/* ------------------------------------------------------------------ */
/* Live socket events                                                  */
/* ------------------------------------------------------------------ */

function attachHandlers(s) {
  if (!s || s.__notificationHandlersAttached) return;
  // A socket.io Socket keeps its listeners across reconnects, so these must be
  // attached exactly once per socket (attaching on every "connect" made every
  // event fire several times after each reconnect).
  s.__notificationHandlersAttached = true;

  s.on("interest_received", (payload) => {
    try {
      const interest = payload?.interest;
      if (!interest) return;
      const fromName =
        payload?.fromName || interest.from_matriid || interest.fromMatriID;
      pushNotification({
        id: `received_${interest.id}_${Date.now()}`,
        type: "received",
        interest,
        fromName,
        message: `New interest from ${fromName}`,
        createdAt: interest.updated_at || interest.created_at || new Date().toISOString(),
        read: false,
      });
      window.dispatchEvent(new CustomEvent("incoming_interest_update"));
    } catch (e) {
      console.error("interest_received handler error", e);
    }
  });

  // Someone ACCEPTED / REJECTED an interest I sent.
  s.on("interest_response", (payload) => {
    try {
      const interest = payload?.interest;
      const action = payload?.action || interest?.status;
      if (!interest) return;
      const fromName =
        payload?.fromName || interest.to_matriid || interest.toMatriID;
      pushNotification({
        id: `response_${interest.id}_${Date.now()}`,
        type: "response",
        interest,
        fromName,
        message: `Your interest to ${fromName} was ${action}`,
        createdAt: interest.updated_at || new Date().toISOString(),
        read: false,
      });
      // lets the Interests page / header counters refresh
      window.dispatchEvent(new CustomEvent("incoming_interest_update"));
    } catch (e) {
      console.error("interest_response handler error", e);
    }
  });

  // NOTE: "interest_update" is only sent to the person who just answered, as a
  // confirmation of their own click. It is not a notification, so we don't store one.

  s.on("chat_message", (payload) => {
    try {
      const msg = payload?.message;
      if (!msg) return;
      pushNotification({
        id: `chat_${msg.id}_${Date.now()}`,
        type: "chat",
        message: `New message from ${msg.from_matriid}: ${msg.message?.substring(0, 50)}${
          msg.message?.length > 50 ? "..." : ""
        }`,
        from_matriid: msg.from_matriid,
        createdAt: msg.created_at || new Date().toISOString(),
        read: false,
      });
    } catch (e) {
      console.error("chat_message handler error", e);
    }
  });

  s.on("chat_request_received", (payload) => {
    try {
      const chatInterest = payload?.chatInterest;
      if (!chatInterest) return;
      pushNotification({
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
    } catch (e) {
      console.error("chat_request_received handler error", e);
    }
  });

  s.on("chat_request_response", (payload) => {
    try {
      const chatInterest = payload?.chatInterest;
      const action = payload?.status || chatInterest?.status;
      if (!chatInterest) return;
      pushNotification({
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
    } catch (e) {
      console.error("chat_request_response handler error", e);
    }
  });
}

/** Tell the server which user this socket belongs to (needed to receive events). */
function registerSocket(s) {
  const { id, email } = currentUser();
  if (!id) return;
  try {
    s.emit("register", { matriid: id, email });
  } catch (e) {
    console.warn("socket register failed", e);
  }
}

export function getSocket() {
  return socket;
}

/**
 * Get (or create) the ONE shared socket. Safe to call from any component, any
 * number of times:
 *  - it never opens a second connection while one exists / is connecting;
 *  - if the socket is already connected it re-registers the CURRENT user, which
 *    is what makes real-time work right after logging in without a page reload;
 *  - it also refreshes the notification list from the server (throttled).
 */
export function connectSocket() {
  if (!socket) {
    socket = io(url, { autoConnect: true, transports: ["websocket", "polling"] });
    attachHandlers(socket);

    // "connect" fires on the first connection AND after every automatic reconnect.
    socket.on("connect", () => {
      registerSocket(socket);
      syncInterestNotifications();
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("socket connection error:", err.message);
    });
  } else if (socket.connected) {
    registerSocket(socket);
  }

  // Works even when the socket is down: the feed comes over plain HTTP.
  syncInterestNotifications();
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
