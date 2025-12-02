// import express from "express";
// import db from "../config/db.js";

// const router = express.Router();

// // POST /api/auth/interest/send
// router.post("/interest/send", async (req, res) => {
//   try {
//     const { fromMatriID, toMatriID } = req.body;
//     if (!fromMatriID || !toMatriID)
//       return res.status(400).json({ success: false, message: "Missing ids" });

//     // Insert pending interest (avoid duplicates)
//     const conn = db.promise();
//     // check existing pending or accepted
//     const [exists] = await conn.query(
//       "SELECT * FROM interests WHERE from_matriid=? AND to_matriid=? LIMIT 1",
//       [fromMatriID, toMatriID]
//     );
//     if (exists.length) {
//       // update created_at if desired or return message
//       return res.json({
//         success: true,
//         message: "Interest already sent",
//         interest: exists[0],
//       });
//     }

//     const [insert] = await conn.query(
//       "INSERT INTO interests (from_matriid, to_matriid) VALUES (?, ?)",
//       [fromMatriID, toMatriID]
//     );
//     const [rows] = await conn.query("SELECT * FROM interests WHERE id = ?", [
//       insert.insertId,
//     ]);
//     const interest = rows[0];

//     // send realtime event to recipient if online
//     const io = req.app.get("io");
//     const onlineMap = req.app.get("onlineMap");
//     const recipientSocket = onlineMap.get((toMatriID || "").toLowerCase());
//     if (recipientSocket) {
//       io.to(recipientSocket).emit("interest_received", {
//         interest,
//         fromMatriID,
//         toMatriID,
//       });
//     }

//     return res.json({ success: true, interest });
//   } catch (err) {
//     console.error("interest/send error", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // POST /api/auth/interest/respond
// router.post("/interest/respond", async (req, res) => {
//   try {
//     const { interestId, action } = req.body; // action = 'accepted' | 'rejected'
//     if (!interestId || !["accepted", "rejected"].includes(action))
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid payload" });

//     const conn = db.promise();
//     await conn.query("UPDATE interests SET status=? WHERE id=?", [
//       action,
//       interestId,
//     ]);
//     const [rows] = await conn.query("SELECT * FROM interests WHERE id=?", [
//       interestId,
//     ]);
//     const interest = rows[0];

//     // notify sender via socket
//     const io = req.app.get("io");
//     const onlineMap = req.app.get("onlineMap");
//     const senderSocket = onlineMap.get(
//       (interest.from_matriid || "").toLowerCase()
//     );
//     if (senderSocket) {
//       io.to(senderSocket).emit("interest_response", { interest, action });
//     }

//     // Optionally notify recipient as well that update succeeded
//     const recipientSocket = onlineMap.get(
//       (interest.to_matriid || "").toLowerCase()
//     );
//     if (recipientSocket) {
//       io.to(recipientSocket).emit("interest_update", { interest });
//     }

//     return res.json({ success: true, interest });
//   } catch (err) {
//     console.error("interest/respond error", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // GET /api/auth/interest/status?from=...&to=...
// router.get("/interest/status", async (req, res) => {
//   try {
//     const { from, to } = req.query;
//     if (!from || !to)
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing params" });
//     const conn = db.promise();
//     const [rows] = await conn.query(
//       "SELECT * FROM interests WHERE from_matriid=? AND to_matriid=? LIMIT 1",
//       [from, to]
//     );
//     return res.json({ success: true, interest: rows[0] || null });
//   } catch (err) {
//     console.error("interest/status error", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;

// routes/interest.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * NOTE (important):
 * - This example does not include auth middleware. In production you MUST
 *   verify the caller (e.g. via JWT / session) so users cannot act on behalf of others.
 * - Socket logic relies on `app.set("io", io)` and `app.set("onlineMap", onlineMap)` in server.js
 */

/**
 * POST /api/auth/interest/send
 * Body: { fromMatriID, toMatriID }
 */
router.post("/interest/send", async (req, res) => {
  try {
    const rawFrom = req.body?.fromMatriID;
    const rawTo = req.body?.toMatriID;
    const fromMatriID = rawFrom ? String(rawFrom).trim() : "";
    const toMatriID = rawTo ? String(rawTo).trim() : "";

    if (!fromMatriID || !toMatriID) {
      return res.status(400).json({ success: false, message: "Missing ids" });
    }

    const conn = db.promise();

    // Check existing record (any status)
    const [existsRows] = await conn.query(
      "SELECT * FROM interests WHERE from_matriid=? AND to_matriid=? LIMIT 1",
      [fromMatriID, toMatriID]
    );

    if (existsRows.length) {
      // If already exists, return existing record (caller can decide to show "Interest Sent")
      return res.json({
        success: true,
        message: "Interest already sent",
        interest: existsRows[0],
      });
    }

    // Insert new pending interest
    const [insert] = await conn.query(
      "INSERT INTO interests (from_matriid, to_matriid, status) VALUES (?, ?, 'pending')",
      [fromMatriID, toMatriID]
    );

    const [rows] = await conn.query("SELECT * FROM interests WHERE id = ?", [
      insert.insertId,
    ]);
    const interest = rows[0];

    // Fetch sender's name from register table
    const [senderRows] = await conn.query(
      "SELECT Name FROM register WHERE MatriID = ? LIMIT 1",
      [fromMatriID]
    );
    const senderName = senderRows.length ? senderRows[0].Name : fromMatriID;

    // Emit real-time event to recipient if online
    const io = req.app.get("io");
    const onlineMap = req.app.get("onlineMap");
    try {
      const recipientSocket = onlineMap.get(String(toMatriID).toLowerCase());
      if (recipientSocket && io) {
        io.to(recipientSocket).emit("interest_received", {
          interest,
          fromMatriID,
          toMatriID,
          fromName: senderName,
        });
      }
    } catch (e) {
      console.warn("socket emit (interest_received) failed", e);
    }

    return res.json({ success: true, interest, fromName: senderName });
  } catch (err) {
    console.error("interest/send error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/auth/interest/respond
 * Body: { interestId, action }  // action = 'accepted' | 'rejected'
 */
router.post("/interest/respond", async (req, res) => {
  try {
    const interestId = req.body?.interestId;
    const action = req.body?.action;
    if (!interestId || !["accepted", "rejected"].includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }

    const conn = db.promise();

    // Update the interest status
    await conn.query(
      "UPDATE interests SET status=?, updated_at = CURRENT_TIMESTAMP WHERE id=?",
      [action, interestId]
    );

    const [rows] = await conn.query("SELECT * FROM interests WHERE id=?", [
      interestId,
    ]);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Interest not found" });
    }
    const interest = rows[0];

    // Fetch responder's name from register table
    const [responderRows] = await conn.query(
      "SELECT Name FROM register WHERE MatriID = ? LIMIT 1",
      [interest.to_matriid]
    );
    const responderName = responderRows.length ? responderRows[0].Name : interest.to_matriid;

    // Notify sender via socket
    const io = req.app.get("io");
    const onlineMap = req.app.get("onlineMap");
    try {
      const senderSocket = onlineMap.get(
        String(interest.from_matriid).toLowerCase()
      );
      if (senderSocket && io) {
        io.to(senderSocket).emit("interest_response", { interest, action, fromName: responderName });
      }
    } catch (e) {
      console.warn("socket emit (interest_response) failed", e);
    }

    // Notify recipient (confirmation) as well
    try {
      const recipientSocket = onlineMap.get(
        String(interest.to_matriid).toLowerCase()
      );
      if (recipientSocket && io) {
        io.to(recipientSocket).emit("interest_update", { interest });
      }
    } catch (e) {
      console.warn("socket emit (interest_update) failed", e);
    }

    return res.json({ success: true, interest, fromName: responderName });
  } catch (err) {
    console.error("interest/respond error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/auth/interest/status?from=...&to=...
 * Returns the interest record between two matriids if exists
 */
router.get("/interest/status", async (req, res) => {
  try {
    const from = req.query?.from ? String(req.query.from).trim() : "";
    const to = req.query?.to ? String(req.query.to).trim() : "";
    if (!from || !to) {
      return res
        .status(400)
        .json({ success: false, message: "Missing params" });
    }

    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT * FROM interests WHERE from_matriid=? AND to_matriid=? LIMIT 1",
      [from, to]
    );
    return res.json({ success: true, interest: rows[0] || null });
  } catch (err) {
    console.error("interest/status error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/auth/interest/incoming?to=<matriid>
 * Returns incoming interests for a recipient (optional paging can be added)
 */
router.get("/interest/incoming", async (req, res) => {
  try {
    const to = req.query?.to ? String(req.query.to).trim() : "";
    if (!to) {
      return res
        .status(400)
        .json({ success: false, message: "Missing 'to' param" });
    }

    const conn = db.promise();
    const [rows] = await conn.query(
      "SELECT * FROM interests WHERE to_matriid=? ORDER BY created_at DESC LIMIT 200",
      [to]
    );

    // Optionally you can attach a small sender summary (name/email/phone) by joining the register table.
    // Example:
    // SELECT i.*, r.Name as senderName, r.ConfirmEmail as senderEmail, r.Mobile as senderMobile
    // FROM interests i LEFT JOIN register r ON r.MatriID = i.from_matriid WHERE i.to_matriid = ?

    return res.json({ success: true, incoming: rows || [] });
  } catch (err) {
    console.error("interest/incoming error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
