// routes/validity.js
// -----------------------------------------------------------------------------
// Admin API for the 1-year membership validity feature.
// Mounted at /api/admin/validity (see server.js). Admin-only.
//
// Data lives in the `member_validity` table (see migrate_member_validity.js).
// "Blocked" = member cannot LOG IN. Their profile stays fully visible on the
// site (search / matches / profile page). register.Status is never changed.
// -----------------------------------------------------------------------------

import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = express.Router();
const conn = db.promise();
const BASE_URL = process.env.BASE_URL || "";

router.use(verifyToken);

// Every validity endpoint is admin-only (the sidebar entry is adminOnly too).
router.use((req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ success: false, message: "Require Admin Role!" });
  }
  next();
});

function adminName(req) {
  return req.userName || "Admin";
}

// Friendly error when the migration has not been run yet.
function handleErr(res, err, where) {
  console.error(`${where} error:`, err);
  if (err && err.code === "ER_NO_SUCH_TABLE") {
    return res.status(503).json({
      success: false,
      message:
        "member_validity table not found. Run the migration first: node migrate_member_validity.js",
    });
  }
  return res.status(500).json({ success: false, message: "Server error" });
}

// Effective validity start for a member: their Regdate when it looks valid,
// otherwise "now" (covers NULL and legacy 0000-00-00 zero dates).
const EFF_START = "COALESCE(CASE WHEN r.Regdate > '1971-01-01' THEN r.Regdate END, NOW())";

// Effective expiry for a member that has no member_validity row yet.
const EFF_EXPIRES = `COALESCE(v.expires_at, DATE_ADD(${EFF_START}, INTERVAL 1 YEAR))`;

// Expired == blocked, automatically (no manual step). The only difference is
// the reason: 'manual' block by admin vs. membership lapsed. That reason is
// derived on the client from block_reason + expires_at.
const STATE_CASE = `
  CASE
    WHEN COALESCE(v.unlimited, 0) = 1 THEN 'unlimited'
    WHEN COALESCE(v.is_blocked, 0) = 1 THEN 'blocked'
    WHEN ${EFF_EXPIRES} <= NOW() THEN 'blocked'
    WHEN ${EFF_EXPIRES} <= DATE_ADD(NOW(), INTERVAL 30 DAY) THEN 'expiring'
    ELSE 'active'
  END`;

const INNER = `
  SELECT
    r.MatriID, r.Name, r.Gender, r.Regdate, r.Photo1, r.Photo1Approve,
    r.Status AS register_status,
    v.starts_at, COALESCE(v.unlimited, 0) AS unlimited,
    COALESCE(v.is_blocked, 0) AS is_blocked,
    v.blocked_at, v.block_reason, v.note, v.updated_by, v.updated_at,
    ${EFF_EXPIRES} AS expires_at,
    DATEDIFF(${EFF_EXPIRES}, NOW()) AS days_left,
    ${STATE_CASE} AS state
  FROM register r
  LEFT JOIN member_validity v ON v.matri_id = r.MatriID
  WHERE r.MatriID IS NOT NULL AND r.MatriID <> ''
`;

const VALID_FILTERS = ["active", "expiring", "blocked", "unlimited"];

// =========================================================================
// GET /api/admin/validity?page=&search=&filter=
// =========================================================================
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const filter = (req.query.filter || "all").trim().toLowerCase();
    const genderRaw = (req.query.gender || "").trim().toLowerCase();
    const gender =
      genderRaw === "male" ? "Male" : genderRaw === "female" ? "Female" : "";

    let inner = INNER;
    const innerParams = [];
    if (search) {
      inner += " AND (r.Name LIKE ? OR r.MatriID LIKE ? OR r.ConfirmEmail LIKE ?)";
      const s = `%${search}%`;
      innerParams.push(s, s, s);
    }
    if (gender) {
      inner += " AND r.Gender = ?";
      innerParams.push(gender);
    }

    let outerWhere = "";
    const outerParams = [];
    if (VALID_FILTERS.includes(filter)) {
      outerWhere = " WHERE t.state = ?";
      outerParams.push(filter);
    }

    // Summary respects the gender scope (but not search / state filter).
    let summaryInner = INNER;
    const summaryParams = [];
    if (gender) {
      summaryInner += " AND r.Gender = ?";
      summaryParams.push(gender);
    }

    const [countRows] = await conn.query(
      `SELECT COUNT(*) AS total FROM (${inner}) t${outerWhere}`,
      [...innerParams, ...outerParams]
    );
    const total = countRows[0]?.total || 0;

    const [rows] = await conn.query(
      `SELECT * FROM (${inner}) t${outerWhere} ORDER BY t.expires_at ASC LIMIT ?, ?`,
      [...innerParams, ...outerParams, offset, limit]
    );

    // Summary for the header cards (ignores search + state filter).
    const [summaryRows] = await conn.query(
      `SELECT t.state, COUNT(*) AS c FROM (${summaryInner}) t GROUP BY t.state`,
      summaryParams
    );
    const summary = { active: 0, expiring: 0, expired: 0, blocked: 0, unlimited: 0 };
    summaryRows.forEach((r) => {
      if (summary[r.state] !== undefined) summary[r.state] = r.c;
    });

    const results = rows.map((u) => ({
      MatriID: u.MatriID,
      Name: u.Name,
      Gender: u.Gender,
      Regdate: u.Regdate,
      starts_at: u.starts_at,
      expires_at: u.expires_at,
      days_left: u.days_left,
      state: u.state,
      unlimited: !!u.unlimited,
      is_blocked: !!u.is_blocked,
      block_reason: u.block_reason,
      register_status: u.register_status,
      note: u.note,
      updated_by: u.updated_by,
      updated_at: u.updated_at,
      PhotoURL:
        u.Photo1 && String(u.Photo1Approve).toLowerCase() === "yes"
          ? `${BASE_URL}/gallery/${encodeURIComponent(u.Photo1)}`
          : null,
    }));

    res.json({ success: true, total, page, per_page: limit, summary, results });
  } catch (err) {
    handleErr(res, err, "validity list");
  }
});

// Load the member + its validity row, creating the row (from Regdate + 1yr)
// if it does not exist yet. Returns null when the member does not exist.
async function ensureRow(matriId) {
  const [rows] = await conn.query(
    `SELECT v.*, r.ID AS live_register_id, r.Status AS register_status, r.Regdate AS reg_date
       FROM register r
       LEFT JOIN member_validity v ON v.matri_id = r.MatriID
      WHERE r.MatriID = ? LIMIT 1`,
    [matriId]
  );
  if (!rows.length) return null;
  const row = rows[0];
  if (row.id) return row;

  let start = row.reg_date ? new Date(row.reg_date) : new Date();
  if (Number.isNaN(start.getTime()) || start.getFullYear() < 1972) start = new Date();
  const exp = new Date(start);
  exp.setFullYear(exp.getFullYear() + 1);
  await conn.query(
    `INSERT INTO member_validity (matri_id, register_id, starts_at, expires_at)
     VALUES (?, ?, ?, ?)`,
    [matriId, row.live_register_id, start, exp]
  );
  const [again] = await conn.query(
    `SELECT v.*, r.ID AS live_register_id, r.Status AS register_status, r.Regdate AS reg_date
       FROM register r
       JOIN member_validity v ON v.matri_id = r.MatriID
      WHERE r.MatriID = ? LIMIT 1`,
    [matriId]
  );
  return again[0];
}

// Clear an "expired" auto-block when the admin extends / lifts validity.
async function liftExpiredBlock(matriId, row) {
  if (row.is_blocked && row.block_reason === "expired") {
    await conn.query(
      `UPDATE member_validity
          SET is_blocked = 0, blocked_at = NULL, block_reason = NULL
        WHERE matri_id = ?`,
      [matriId]
    );
  }
}

// =========================================================================
// PUT /api/admin/validity/:matriId   body: { action, date?, years?, note? }
// actions: extend | set_date | unlimited | reenable | block | unblock
// =========================================================================
router.put("/:matriId", async (req, res) => {
  try {
    const { matriId } = req.params;
    const { action, date, years, note } = req.body || {};
    const allowed = ["extend", "set_date", "unlimited", "reenable", "block", "unblock"];
    if (!allowed.includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const row = await ensureRow(matriId);
    if (!row) return res.status(404).json({ success: false, message: "Member not found" });

    const by = adminName(req);
    const noteVal = typeof note === "string" && note.trim() ? note.trim() : null;

    switch (action) {
      case "extend": {
        const n = Math.min(Math.max(parseInt(years, 10) || 1, 1), 10);
        await conn.query(
          `UPDATE member_validity
              SET expires_at = DATE_ADD(GREATEST(expires_at, NOW()), INTERVAL ? YEAR),
                  unlimited = 0,
                  note = COALESCE(?, note),
                  updated_by = ?
            WHERE matri_id = ?`,
          [n, noteVal, by, matriId]
        );
        await liftExpiredBlock(matriId, row);
        break;
      }
      case "set_date": {
        if (!date || Number.isNaN(new Date(date).getTime())) {
          return res.status(400).json({ success: false, message: "Invalid date" });
        }
        await conn.query(
          `UPDATE member_validity
              SET expires_at = ?, unlimited = 0,
                  note = COALESCE(?, note), updated_by = ?
            WHERE matri_id = ?`,
          [new Date(date), noteVal, by, matriId]
        );
        await liftExpiredBlock(matriId, row);
        break;
      }
      case "unlimited": {
        await conn.query(
          `UPDATE member_validity
              SET unlimited = 1, note = COALESCE(?, note), updated_by = ?
            WHERE matri_id = ?`,
          [noteVal, by, matriId]
        );
        await liftExpiredBlock(matriId, row);
        break;
      }
      case "reenable": {
        await conn.query(
          `UPDATE member_validity
              SET unlimited = 0,
                  expires_at = DATE_ADD(NOW(), INTERVAL 1 YEAR),
                  note = COALESCE(?, note), updated_by = ?
            WHERE matri_id = ?`,
          [noteVal, by, matriId]
        );
        break;
      }
      case "block": {
        // Login-only block. register.Status is not touched.
        await conn.query(
          `UPDATE member_validity
              SET is_blocked = 1, blocked_at = NOW(), block_reason = 'manual',
                  note = COALESCE(?, note), updated_by = ?
            WHERE matri_id = ?`,
          [noteVal, by, matriId]
        );
        break;
      }
      case "unblock": {
        // If still expired (and not unlimited), give a fresh 1-year window so
        // the member is not re-blocked on their next login.
        const stillExpired =
          !row.unlimited && row.expires_at && new Date(row.expires_at).getTime() <= Date.now();
        await conn.query(
          `UPDATE member_validity
              SET is_blocked = 0, blocked_at = NULL, block_reason = NULL,
                  ${stillExpired ? "expires_at = DATE_ADD(NOW(), INTERVAL 1 YEAR)," : ""}
                  note = COALESCE(?, note), updated_by = ?
            WHERE matri_id = ?`,
          [noteVal, by, matriId]
        );
        break;
      }
      default:
        return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const [fresh] = await conn.query(
      `SELECT * FROM (${INNER}) t WHERE t.MatriID = ? LIMIT 1`,
      [matriId]
    );
    res.json({ success: true, message: "Validity updated", row: fresh[0] || null });
  } catch (err) {
    handleErr(res, err, "validity update");
  }
});

export default router;
