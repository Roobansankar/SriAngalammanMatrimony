// services/notificationService.js
import fetch from "node-fetch";
import db from "../config/db.js";
import NotificationType from "../constants/notificationTypes.js";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Chunk array into smaller arrays
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Send push notifications via Expo Push API
 */
async function sendPushNotifications(messages) {
  if (!messages || messages.length === 0) return;

  const chunks = chunkArray(messages, 100);
  const conn = db.promise();

  for (const chunk of chunks) {
    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();

      // Handle errors and deactivate invalid tokens
      if (result.data) {
        for (let i = 0; i < result.data.length; i++) {
          const pushResult = result.data[i];
          if (pushResult.status === "error") {
            console.warn(`Push error: ${pushResult.message}`);
            // Deactivate invalid tokens
            if (pushResult.details?.error === "DeviceNotRegistered") {
              try {
                await conn.query(
                  "UPDATE device_tokens SET is_active = FALSE WHERE token = ?",
                  [chunk[i].to]
                );
                console.log(`Deactivated invalid token: ${chunk[i].to}`);
              } catch (dbErr) {
                console.error("Failed to deactivate token:", dbErr);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send push notifications:", error);
    }
  }
}

/**
 * Get active tokens for a user by user_id (primary key from register table)
 */
async function getActiveTokensForUser(userId) {
  const conn = db.promise();
  try {
    const [tokens] = await conn.query(
      "SELECT token FROM device_tokens WHERE user_id = ? AND is_active = TRUE",
      [userId]
    );
    return tokens.map((t) => t.token);
  } catch (error) {
    console.error("Failed to get tokens for user:", error);
    return [];
  }
}

/**
 * Get active tokens for a user by MatriID
 */
async function getActiveTokensForMatriId(matriId) {
  const conn = db.promise();
  try {
    // First get the user_id from register table using MatriID
    const [users] = await conn.query(
      "SELECT id FROM register WHERE MatriID = ? LIMIT 1",
      [matriId]
    );
    if (!users.length) return [];

    const userId = users[0].id;
    return await getActiveTokensForUser(userId);
  } catch (error) {
    console.error("Failed to get tokens for MatriID:", error);
    return [];
  }
}

/**
 * Send notification to a single user by user_id
 */
async function sendToUser(userId, title, body, data = {}) {
  const tokens = await getActiveTokensForUser(userId);
  const messages = tokens.map((token) => ({
    to: token,
    title,
    body,
    data,
    sound: "default",
    priority: "high",
    channelId: "default",
  }));
  await sendPushNotifications(messages);
}

/**
 * Send notification to a single user by MatriID
 */
async function sendToMatriId(matriId, title, body, data = {}) {
  const tokens = await getActiveTokensForMatriId(matriId);
  const messages = tokens.map((token) => ({
    to: token,
    title,
    body,
    data,
    sound: "default",
    priority: "high",
    channelId: "default",
  }));
  await sendPushNotifications(messages);
}

/**
 * Send notification to multiple users by user_id
 */
async function sendToMultipleUsers(userIds, title, body, data = {}) {
  const conn = db.promise();
  try {
    if (!userIds.length) return;

    const placeholders = userIds.map(() => "?").join(",");
    const [tokens] = await conn.query(
      `SELECT token FROM device_tokens WHERE user_id IN (${placeholders}) AND is_active = TRUE`,
      userIds
    );

    const messages = tokens.map((t) => ({
      to: t.token,
      title,
      body,
      data,
      sound: "default",
      priority: "high",
      channelId: "default",
    }));

    await sendPushNotifications(messages);
  } catch (error) {
    console.error("Failed to send to multiple users:", error);
  }
}

/**
 * Send notification to multiple users by MatriID
 */
async function sendToMultipleMatriIds(matriIds, title, body, data = {}) {
  const conn = db.promise();
  try {
    if (!matriIds.length) return;

    const placeholders = matriIds.map(() => "?").join(",");
    const [users] = await conn.query(
      `SELECT id FROM register WHERE MatriID IN (${placeholders})`,
      matriIds
    );

    const userIds = users.map((u) => u.id);
    await sendToMultipleUsers(userIds, title, body, data);
  } catch (error) {
    console.error("Failed to send to multiple MatriIDs:", error);
  }
}

// ========== TOKEN MANAGEMENT ==========

async function registerToken(userId, { token, platform, deviceName }) {
  const conn = db.promise();
  try {
    // Check if token already exists
    const [existing] = await conn.query(
      "SELECT id, user_id FROM device_tokens WHERE token = ? LIMIT 1",
      [token]
    );

    if (existing.length) {
      // Update existing token
      await conn.query(
        `UPDATE device_tokens
         SET user_id = ?, platform = ?, device_name = ?, is_active = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE token = ?`,
        [userId, platform, deviceName || null, token]
      );
      return { id: existing[0].id, updated: true };
    } else {
      // Insert new token
      const [result] = await conn.query(
        `INSERT INTO device_tokens (user_id, token, platform, device_name, is_active)
         VALUES (?, ?, ?, ?, TRUE)`,
        [userId, token, platform, deviceName || null]
      );
      return { id: result.insertId, created: true };
    }
  } catch (error) {
    console.error("Failed to register token:", error);
    throw error;
  }
}

async function unregisterToken(userId, token) {
  const conn = db.promise();
  try {
    await conn.query(
      "UPDATE device_tokens SET is_active = FALSE WHERE token = ? AND user_id = ?",
      [token, userId]
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to unregister token:", error);
    throw error;
  }
}

async function unregisterAllTokensForUser(userId) {
  const conn = db.promise();
  try {
    await conn.query(
      "UPDATE device_tokens SET is_active = FALSE WHERE user_id = ?",
      [userId]
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to unregister all tokens for user:", error);
    throw error;
  }
}

// ========== PHONE REQUEST NOTIFICATIONS ==========

async function notifyPhoneRequest(recipientMatriId, requesterName, requesterMatriId) {
  await sendToMatriId(
    recipientMatriId,
    "📞 Phone Number Request",
    `${requesterName} has requested your phone number`,
    {
      type: NotificationType.PHONE_REQUEST,
      profileId: String(requesterMatriId),
    }
  );
}

async function notifyPhoneAccepted(requesterMatriId, accepterName, accepterMatriId) {
  await sendToMatriId(
    requesterMatriId,
    "✅ Phone Request Accepted!",
    `${accepterName} has shared their phone number with you`,
    {
      type: NotificationType.PHONE_ACCEPTED,
      profileId: String(accepterMatriId),
    }
  );
}

async function notifyPhoneRejected(requesterMatriId, rejecterName) {
  await sendToMatriId(
    requesterMatriId,
    "❌ Phone Request Declined",
    `${rejecterName} has declined your phone number request`,
    {
      type: NotificationType.PHONE_REJECTED,
    }
  );
}

// ========== CHAT REQUEST NOTIFICATIONS ==========

async function notifyChatRequest(recipientMatriId, requesterName, requesterMatriId) {
  await sendToMatriId(
    recipientMatriId,
    "💬 New Chat Request",
    `${requesterName} wants to chat with you`,
    {
      type: NotificationType.CHAT_REQUEST,
      profileId: String(requesterMatriId),
    }
  );
}

async function notifyChatAccepted(requesterMatriId, accepterName, chatId) {
  await sendToMatriId(
    requesterMatriId,
    "✅ Chat Request Accepted!",
    `${accepterName} accepted your chat request. Start chatting now!`,
    {
      type: NotificationType.CHAT_ACCEPTED,
      chatId: String(chatId),
    }
  );
}

async function notifyChatRejected(requesterMatriId, rejecterName) {
  await sendToMatriId(
    requesterMatriId,
    "❌ Chat Request Declined",
    `${rejecterName} has declined your chat request`,
    {
      type: NotificationType.CHAT_REJECTED,
    }
  );
}

// ========== MESSAGE NOTIFICATIONS ==========

async function notifyNewMessage(recipientMatriId, senderName, chatId, messagePreview) {
  const preview =
    messagePreview && messagePreview.length > 50
      ? messagePreview.substring(0, 47) + "..."
      : messagePreview || "New message";

  await sendToMatriId(
    recipientMatriId,
    `💬 ${senderName}`,
    preview,
    {
      type: NotificationType.NEW_MESSAGE,
      chatId: String(chatId),
    }
  );
}

// ========== PROFILE NOTIFICATIONS ==========

async function notifyProfileView(viewedMatriId, viewerName, viewerMatriId) {
  await sendToMatriId(
    viewedMatriId,
    "👀 Profile Viewed",
    `${viewerName} viewed your profile`,
    {
      type: NotificationType.PROFILE_VIEW,
      profileId: String(viewerMatriId),
    }
  );
}

async function notifyInterestReceived(recipientMatriId, senderName, senderMatriId) {
  await sendToMatriId(
    recipientMatriId,
    "❤️ New Interest",
    `${senderName} is interested in your profile`,
    {
      type: NotificationType.INTEREST_RECEIVED,
      profileId: String(senderMatriId),
    }
  );
}

async function notifyInterestAccepted(senderMatriId, accepterName, accepterMatriId) {
  await sendToMatriId(
    senderMatriId,
    "🎉 Interest Accepted!",
    `${accepterName} accepted your interest. It's a match!`,
    {
      type: NotificationType.INTEREST_ACCEPTED,
      profileId: String(accepterMatriId),
    }
  );
}

// ========== ADMIN NOTIFICATIONS ==========

async function notifyProfileApproved(matriId) {
  await sendToMatriId(
    matriId,
    "✅ Profile Approved",
    "Your profile has been approved and is now visible to others",
    {
      type: NotificationType.PROFILE_APPROVED,
    }
  );
}

async function notifyProfileRejected(matriId, reason) {
  await sendToMatriId(
    matriId,
    "❌ Profile Needs Changes",
    reason || "Please update your profile and submit again",
    {
      type: NotificationType.PROFILE_REJECTED,
    }
  );
}

// ========== BROADCAST NOTIFICATIONS ==========

async function broadcastToAllUsers(title, body, data = {}) {
  const conn = db.promise();
  try {
    const [tokens] = await conn.query(
      "SELECT DISTINCT token FROM device_tokens WHERE is_active = TRUE"
    );

    const messages = tokens.map((t) => ({
      to: t.token,
      title,
      body,
      data,
      sound: "default",
      priority: "high",
      channelId: "default",
    }));

    await sendPushNotifications(messages);
  } catch (error) {
    console.error("Failed to broadcast to all users:", error);
  }
}

export default {
  // Token management
  registerToken,
  unregisterToken,
  unregisterAllTokensForUser,

  // Phone requests
  notifyPhoneRequest,
  notifyPhoneAccepted,
  notifyPhoneRejected,

  // Chat requests
  notifyChatRequest,
  notifyChatAccepted,
  notifyChatRejected,

  // Messages
  notifyNewMessage,

  // Profile
  notifyProfileView,
  notifyInterestReceived,
  notifyInterestAccepted,

  // Admin
  notifyProfileApproved,
  notifyProfileRejected,

  // Broadcast
  broadcastToAllUsers,

  // Generic
  sendToUser,
  sendToMatriId,
  sendToMultipleUsers,
  sendToMultipleMatriIds,
};
