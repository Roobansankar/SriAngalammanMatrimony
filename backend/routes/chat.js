import express from "express";
import db from "../config/db.js";
import config from "../config/env.js";

const router = express.Router();

const BASE_URL = config.baseUrl;
const GALLERY_PATH = "/gallery/";
const FALLBACK = "nophoto.jpg";

function makePhotoUrl(photoFilename, photoApprove) {
  const hasPhoto =
    photoFilename &&
    photoFilename !== "no-photo.gif" &&
    photoFilename !== "nophoto.jpg" &&
    String(photoApprove).toLowerCase() === "yes";

  const file = hasPhoto ? photoFilename : FALLBACK;
  return `${BASE_URL}${GALLERY_PATH}${encodeURIComponent(file)}`;
}

const query = (sql, params) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

// Check if there's an accepted CHAT interest (separate from profile interest)
const checkAcceptedChatInterest = async (matriid1, matriid2) => {
  const sql = `
    SELECT id FROM chat_interests 
    WHERE status = 'accepted' 
      AND ((from_matriid = ? AND to_matriid = ?) OR (from_matriid = ? AND to_matriid = ?))
    LIMIT 1
  `;
  const result = await query(sql, [matriid1, matriid2, matriid2, matriid1]);
  return result.length > 0;
};

// Get existing chat interest between two users
const getChatInterest = async (matriid1, matriid2) => {
  const sql = `
    SELECT * FROM chat_interests 
    WHERE (from_matriid = ? AND to_matriid = ?) OR (from_matriid = ? AND to_matriid = ?)
    LIMIT 1
  `;
  const result = await query(sql, [matriid1, matriid2, matriid2, matriid1]);
  return result.length > 0 ? result[0] : null;
};

/**
 * GET /api/chat/can-chat
 * Check if two users can chat (have accepted chat interest)
 */
router.get("/can-chat", async (req, res) => {
  try {
    const { matriid, partner } = req.query;
    if (!matriid || !partner) {
      return res.status(400).json({ error: "matriid and partner required" });
    }

    const canChat = await checkAcceptedChatInterest(matriid, partner);
    const chatInterest = await getChatInterest(matriid, partner);
    
    res.json({ success: true, canChat, chatInterest });
  } catch (err) {
    console.error("GET /can-chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/chat/request
 * Send a chat request to another user
 * Body: { fromMatriID, toMatriID }
 */
router.post("/request", async (req, res) => {
  try {
    const { fromMatriID, toMatriID } = req.body;
    if (!fromMatriID || !toMatriID) {
      return res.status(400).json({ error: "fromMatriID and toMatriID required" });
    }

    // Check if chat interest already exists
    const existing = await getChatInterest(fromMatriID, toMatriID);
    if (existing) {
      return res.json({ 
        success: true, 
        chatInterest: existing,
        message: existing.status === 'accepted' ? 'Chat already accepted' : 'Chat request already sent'
      });
    }

    // Insert new chat request
    const sql = `INSERT INTO chat_interests (from_matriid, to_matriid, status) VALUES (?, ?, 'pending')`;
    const result = await query(sql, [fromMatriID, toMatriID]);

    const [newRequest] = await query(`SELECT * FROM chat_interests WHERE id = ?`, [result.insertId]);

    // Emit socket event for chat request
    try {
      const io = req.app.get("io");
      const onlineMap = req.app.get("onlineMap");
      
      if (io && onlineMap) {
        const recipientKey = toMatriID.toString().toLowerCase().trim();
        const recipientSocketId = onlineMap.get(recipientKey);
        
        // Fetch sender's name
        const [sender] = await query(`SELECT Name FROM register WHERE MatriID = ?`, [fromMatriID]);
        
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("chat_request_received", {
            chatInterest: newRequest,
            from_matriid: fromMatriID,
            fromName: sender?.Name || fromMatriID
          });
        }
      }
    } catch (socketErr) {
      console.warn("Socket emit error:", socketErr);
    }

    res.json({ success: true, chatInterest: newRequest, message: 'Chat request sent' });
  } catch (err) {
    console.error("POST /request error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/chat/respond
 * Accept or reject a chat request
 * Body: { id (chat_interest id), status ('accepted' or 'rejected') }
 */
router.post("/respond", async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "id and valid status (accepted/rejected) required" });
    }

    // Get the chat interest first
    const [existing] = await query(`SELECT * FROM chat_interests WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: "Chat request not found" });
    }

    // Update the status
    await query(`UPDATE chat_interests SET status = ? WHERE id = ?`, [status, id]);
    
    const [updated] = await query(`SELECT * FROM chat_interests WHERE id = ?`, [id]);

    // Emit socket event for response
    try {
      const io = req.app.get("io");
      const onlineMap = req.app.get("onlineMap");
      
      if (io && onlineMap) {
        const senderKey = existing.from_matriid.toString().toLowerCase().trim();
        const senderSocketId = onlineMap.get(senderKey);
        
        // Fetch responder's name
        const [responder] = await query(`SELECT Name FROM register WHERE MatriID = ?`, [existing.to_matriid]);
        
        if (senderSocketId) {
          io.to(senderSocketId).emit("chat_request_response", {
            chatInterest: updated,
            status,
            from_matriid: existing.to_matriid,
            fromName: responder?.Name || existing.to_matriid
          });
        }
      }
    } catch (socketErr) {
      console.warn("Socket emit error:", socketErr);
    }

    res.json({ success: true, chatInterest: updated });
  } catch (err) {
    console.error("POST /respond error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/chat/requests
 * Get all pending chat requests for a user
 * Query param: matriid
 */
router.get("/requests", async (req, res) => {
  try {
    const { matriid } = req.query;
    if (!matriid) return res.status(400).json({ error: "matriid required" });

    const sql = `
      SELECT ci.*, r.Name, r.Photo1, r.Photo1Approve, r.City, r.Occupation
      FROM chat_interests ci
      LEFT JOIN register r ON ci.from_matriid = r.MatriID
      WHERE ci.to_matriid = ? AND ci.status = 'pending'
      ORDER BY ci.created_at DESC
    `;

    const requests = await query(sql, [matriid]);
    
    const enriched = requests.map(req => ({
      ...req,
      PhotoURL: makePhotoUrl(req.Photo1, req.Photo1Approve)
    }));

    res.json({ success: true, requests: enriched });
  } catch (err) {
    console.error("GET /requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/chat/conversations
 * List all conversations for the logged-in user (distinct partners)
 * Query param: matriid (logged user's matriid)
 */
router.get("/conversations", async (req, res) => {
  try {
    const { matriid } = req.query;
    if (!matriid) return res.status(400).json({ error: "matriid required" });

    // Simpler query: get distinct partners
    const partnersSql = `
      SELECT DISTINCT 
        CASE 
          WHEN from_matriid = ? THEN to_matriid 
          ELSE from_matriid 
        END as partner
      FROM chat_messages
      WHERE from_matriid = ? OR to_matriid = ?
    `;

    const partners = await query(partnersSql, [matriid, matriid, matriid]);
    const enriched = await Promise.all(
      partners.map(async (p) => {
        const partner = p.partner;
        
        const lastMsgSql = `
          SELECT message, created_at 
          FROM chat_messages 
          WHERE (from_matriid = ? AND to_matriid = ?) 
             OR (from_matriid = ? AND to_matriid = ?)
          ORDER BY created_at DESC 
          LIMIT 1
        `;
        const [lastMsg] = await query(lastMsgSql, [matriid, partner, partner, matriid]);

        const unreadSql = `
          SELECT COUNT(*) as cnt 
          FROM chat_messages 
          WHERE from_matriid = ? AND to_matriid = ? AND is_read = 0
        `;
        const [unreadResult] = await query(unreadSql, [partner, matriid]);

        const profileSql = `SELECT MatriID, Name, Photo1, Photo1Approve, City, workinglocation, Occupation FROM register WHERE MatriID = ? LIMIT 1`;
        const [profileRow] = await query(profileSql, [partner]);
        
        let profile = null;
        if (profileRow) {
          profile = {
            MatriID: profileRow.MatriID,
            Name: profileRow.Name,
            PhotoURL: makePhotoUrl(profileRow.Photo1, profileRow.Photo1Approve),
            City: profileRow.City,
            workinglocation: profileRow.workinglocation,
            Occupation: profileRow.Occupation
          };
        }

        return {
          partner,
          last_message: lastMsg?.message || null,
          last_message_time: lastMsg?.created_at || null,
          unread_count: unreadResult?.cnt || 0,
          profile: profile || null
        };
      })
    );

    enriched.sort((a, b) => {
      if (!a.last_message_time) return 1;
      if (!b.last_message_time) return -1;
      return new Date(b.last_message_time) - new Date(a.last_message_time);
    });

    res.json({ success: true, conversations: enriched });
  } catch (err) {
    console.error("GET /conversations error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/chat/messages
 * Get messages between two users
 * Query params: matriid (logged user), partner (other user's matriid)
 */
router.get("/messages", async (req, res) => {
  try {
    const { matriid, partner, limit = 100, offset = 0 } = req.query;
    if (!matriid || !partner) {
      return res.status(400).json({ error: "matriid and partner required" });
    }

    const canChat = await checkAcceptedChatInterest(matriid, partner);
    if (!canChat) {
      return res.status(403).json({ 
        error: "Cannot view messages. Chat request must be accepted first.",
        canChat: false,
        messages: []
      });
    }

    const sql = `
      SELECT id, from_matriid, to_matriid, message, is_read, created_at
      FROM chat_messages
      WHERE (from_matriid = ? AND to_matriid = ?)
         OR (from_matriid = ? AND to_matriid = ?)
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `;

    const messages = await query(sql, [
      matriid, partner, partner, matriid, 
      parseInt(limit), parseInt(offset)
    ]);

    const markReadSql = `
      UPDATE chat_messages 
      SET is_read = 1 
      WHERE from_matriid = ? AND to_matriid = ? AND is_read = 0
    `;
    await query(markReadSql, [partner, matriid]);

    res.json({ success: true, messages });
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/chat/send
 * Send a new message
 * Body: { from_matriid, to_matriid, message }
 */
router.post("/send", async (req, res) => {
  try {
    const { from_matriid, to_matriid, message } = req.body;

    if (!from_matriid || !to_matriid || !message) {
      return res.status(400).json({ error: "from_matriid, to_matriid, and message required" });
    }

    const canChat = await checkAcceptedChatInterest(from_matriid, to_matriid);
    if (!canChat) {
      return res.status(403).json({ 
        error: "Cannot send message. Chat request must be accepted first.",
        canChat: false 
      });
    }

    const sql = `
      INSERT INTO chat_messages (from_matriid, to_matriid, message)
      VALUES (?, ?, ?)
    `;

    const result = await query(sql, [from_matriid, to_matriid, message.trim()]);

    // Fetch the inserted message
    const [newMessage] = await query(
      `SELECT id, from_matriid, to_matriid, message, is_read, created_at 
       FROM chat_messages WHERE id = ?`,
      [result.insertId]
    );

    try {
      const io = req.app.get("io");
      const onlineMap = req.app.get("onlineMap");
      
      if (io && onlineMap) {
        const recipientKey = to_matriid.toString().toLowerCase().trim();
        const recipientSocketId = onlineMap.get(recipientKey);
        
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("chat_message", {
            message: newMessage,
            from_matriid,
            to_matriid,
          });
          console.log(`Chat message emitted to ${recipientKey}`);
        }
      }
    } catch (socketErr) {
      console.warn("Socket emit error:", socketErr);
    }

    res.json({ success: true, message: newMessage });
  } catch (err) {
    console.error("POST /send error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/chat/mark-read
 * Mark all messages from a partner as read
 * Body: { matriid (logged user), partner }
 */
router.post("/mark-read", async (req, res) => {
  try {
    const { matriid, partner } = req.body;
    if (!matriid || !partner) {
      return res.status(400).json({ error: "matriid and partner required" });
    }

    const sql = `
      UPDATE chat_messages 
      SET is_read = 1 
      WHERE from_matriid = ? AND to_matriid = ? AND is_read = 0
    `;

    await query(sql, [partner, matriid]);

    res.json({ success: true });
  } catch (err) {
    console.error("POST /mark-read error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/chat/unread-count
 * Get total unread message count for a user
 * Query param: matriid
 */
router.get("/unread-count", async (req, res) => {
  try {
    const { matriid } = req.query;
    if (!matriid) return res.status(400).json({ error: "matriid required" });

    const sql = `
      SELECT COUNT(*) as count 
      FROM chat_messages 
      WHERE to_matriid = ? AND is_read = 0
    `;

    const [result] = await query(sql, [matriid]);

    res.json({ success: true, count: result?.count || 0 });
  } catch (err) {
    console.error("GET /unread-count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/chat/partner-profile/:matriid
 * Get profile info for chat partner (path param version)
 */
router.get("/partner-profile/:matriid", async (req, res) => {
  try {
    const { matriid } = req.params;
    if (!matriid) return res.status(400).json({ error: "matriid required" });

    const sql = `
      SELECT MatriID, Name, Photo1, Photo1Approve, Gender, Age, City, workinglocation, Occupation
      FROM register 
      WHERE MatriID = ? 
      LIMIT 1
    `;

    const [row] = await query(sql, [matriid]);

    if (!row) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const partner = {
      MatriID: row.MatriID,
      Name: row.Name,
      PhotoURL: makePhotoUrl(row.Photo1, row.Photo1Approve),
      Gender: row.Gender,
      Age: row.Age,
      City: row.City,
      workinglocation: row.workinglocation,
      Occupation: row.Occupation
    };

    res.json({ success: true, partner });
  } catch (err) {
    console.error("GET /partner-profile/:matriid error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/chat/partner-profile
 * Get profile info for chat partner
 * Query param: matriid (partner's matriid)
 */
router.get("/partner-profile", async (req, res) => {
  try {
    const { matriid } = req.query;
    if (!matriid) return res.status(400).json({ error: "matriid required" });

    const sql = `
      SELECT MatriID, Name, Photo1, Photo1Approve, Gender, Age, City, workinglocation, Occupation
      FROM register 
      WHERE MatriID = ? 
      LIMIT 1
    `;

    const [row] = await query(sql, [matriid]);

    if (!row) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const profile = {
      MatriID: row.MatriID,
      Name: row.Name,
      PhotoURL: makePhotoUrl(row.Photo1, row.Photo1Approve),
      Gender: row.Gender,
      Age: row.Age,
      City: row.City,
      workinglocation: row.workinglocation,
      Occupation: row.Occupation
    };

    res.json({ success: true, profile });
  } catch (err) {
    console.error("GET /partner-profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
