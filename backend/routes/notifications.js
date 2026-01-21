// routes/notifications.js
import express from "express";
import db from "../config/db.js";
import notificationService from "../services/notificationService.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/notifications/register-token
 * Register a device token for push notifications
 * Body: { token, platform, deviceName? }
 */
router.post("/register-token", auth, async (req, res) => {
  try {
    const { token, platform, deviceName } = req.body;

    if (!token || !platform) {
      return res.status(400).json({
        success: false,
        message: "Token and platform are required",
      });
    }

    if (!["ios", "android"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Platform must be ios or android",
      });
    }

    await notificationService.registerToken(req.user.id, {
      token,
      platform,
      deviceName,
    });

    res.status(201).json({
      success: true,
      message: "Device registered for push notifications",
    });
  } catch (error) {
    console.error("Register token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register device",
    });
  }
});

/**
 * POST /api/notifications/unregister-token
 * Unregister a device token from push notifications
 * Body: { token }
 */
router.post("/unregister-token", auth, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    await notificationService.unregisterToken(req.user.id, token);

    res.json({
      success: true,
      message: "Device unregistered from push notifications",
    });
  } catch (error) {
    console.error("Unregister token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unregister device",
    });
  }
});

/**
 * GET /api/notifications/tokens
 * Get all registered tokens for the authenticated user
 */
router.get("/tokens", auth, async (req, res) => {
  try {
    const conn = db.promise();
    const [tokens] = await conn.query(
      "SELECT id, token, platform, device_name, is_active, created_at FROM device_tokens WHERE user_id = ?",
      [req.user.id]
    );

    res.json({
      success: true,
      tokens,
    });
  } catch (error) {
    console.error("Get tokens error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get device tokens",
    });
  }
});

/**
 * DELETE /api/notifications/tokens/:tokenId
 * Delete a specific device token
 */
router.delete("/tokens/:tokenId", auth, async (req, res) => {
  try {
    const { tokenId } = req.params;
    const conn = db.promise();

    await conn.query(
      "DELETE FROM device_tokens WHERE id = ? AND user_id = ?",
      [tokenId, req.user.id]
    );

    res.json({
      success: true,
      message: "Device token deleted",
    });
  } catch (error) {
    console.error("Delete token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete device token",
    });
  }
});

export default router;
