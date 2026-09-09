// =============================================================================
// Migration: create `member_validity` table + set one row per member.
//
// Every membership is valid for 1 YEAR from the member's REGISTRATION DATE
// (register.Regdate). This table holds the expiry date and block state
// separately from the (already very wide) `register` table.
//
// When a membership expires the member CANNOT LOG IN, but the profile stays
// fully visible on the site (search / matches / profile page). register.Status
// is never changed by this feature.
//
// Members whose Regdate is missing / invalid fall back to "1 year from now".
//
// Idempotent — safe to run again. Re-running also REPAIRS rows that were
// created by an earlier version of this script, but never touches a row an
// admin has already edited (note / updated_by set, or blocked / unlimited).
//
// Run locally:   node migrate_member_validity.js   (uses backend/.env)
// Run on VPS:    docker compose -f docker-compose.prod.yml exec backend \
//                  node migrate_member_validity.js
// =============================================================================

import "dotenv/config";
import mysql from "mysql2/promise";

const cfg = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "matrimony",
  password: process.env.DB_PASS || "matrimony",
  database: process.env.DB_NAME || "sriang",
  // No port key -> mysql2 defaults to 3306 (matches config/db.js and the
  // Docker `db` service). Set DB_PORT only if your MySQL listens elsewhere.
  ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
  multipleStatements: false,
};

// Effective validity start for a member: their Regdate when it looks valid,
// otherwise "now" (covers NULL and legacy 0000-00-00 zero dates).
const EFF_START = "COALESCE(CASE WHEN r.Regdate > '1971-01-01' THEN r.Regdate END, NOW())";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS member_validity (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  matri_id      VARCHAR(50)  NOT NULL,
  register_id   INT          NULL,
  starts_at     DATETIME     NOT NULL,
  expires_at    DATETIME     NOT NULL,
  unlimited     TINYINT(1)   NOT NULL DEFAULT 0,
  is_blocked    TINYINT(1)   NOT NULL DEFAULT 0,
  blocked_at    DATETIME     NULL,
  block_reason  VARCHAR(32)  NULL,
  prev_status   VARCHAR(20)  NULL,
  note          VARCHAR(255) NULL,
  updated_by    VARCHAR(64)  NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_matri_id (matri_id),
  KEY idx_expires_at (expires_at),
  KEY idx_is_blocked (is_blocked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

// Insert a row for every member that has none yet.
const BACKFILL = `
INSERT INTO member_validity (matri_id, register_id, starts_at, expires_at)
SELECT r.MatriID, r.ID, ${EFF_START}, DATE_ADD(${EFF_START}, INTERVAL 1 YEAR)
FROM register r
WHERE r.MatriID IS NOT NULL AND r.MatriID <> ''
  AND NOT EXISTS (SELECT 1 FROM member_validity v WHERE v.matri_id = r.MatriID)
`;

// Re-align pristine rows (never edited by an admin) to Regdate + 1 year.
// This fixes rows written by an older version of the script.
const REPAIR = `
UPDATE member_validity v
JOIN register r ON r.MatriID = v.matri_id
SET v.starts_at  = ${EFF_START},
    v.expires_at = DATE_ADD(${EFF_START}, INTERVAL 1 YEAR),
    v.register_id = COALESCE(v.register_id, r.ID)
WHERE v.unlimited = 0
  AND v.is_blocked = 0
  AND v.note IS NULL
  AND v.updated_by IS NULL
  AND v.expires_at <> DATE_ADD(${EFF_START}, INTERVAL 1 YEAR)
`;

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection(cfg);
    console.log(`Connected to database "${cfg.database}" on ${cfg.host}.`);

    await conn.query(CREATE_TABLE);
    console.log("✅ member_validity table ready.");

    const [ins] = await conn.query(BACKFILL);
    console.log(`✅ Inserted ${ins.affectedRows} new validity row(s) (Regdate + 1 year).`);

    const [upd] = await conn.query(REPAIR);
    console.log(`✅ Re-aligned ${upd.affectedRows} existing row(s) to Regdate + 1 year.`);

    const [[{ total }]] = await conn.query("SELECT COUNT(*) AS total FROM member_validity");
    const [[{ expired }]] = await conn.query(
      "SELECT COUNT(*) AS expired FROM member_validity WHERE unlimited = 0 AND expires_at <= NOW()"
    );
    console.log(`ℹ️  member_validity holds ${total} row(s); ${expired} already past expiry.`);
    console.log("   Those members are already login-blocked automatically (no button to press).");
    console.log("   Their profiles stay visible on the site. Extend them from the admin page.");

    console.log("Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main();
