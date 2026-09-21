// =============================================================================
// Migration: add "Abroad" to the country master list (e_country).
//
// The country dropdown everywhere (registration Step 2, advanced search, admin
// location data) reads from the `e_country` table via /api/countries. Adding
// the row here makes "Abroad" available in all of them.
//
// Idempotent — safe to run again (checks before inserting).
//
// Run locally:  node migrate_add_abroad_country.js
// Run on VPS:   docker compose -f docker-compose.prod.yml exec backend \
//                 node migrate_add_abroad_country.js
// =============================================================================

import "dotenv/config";
import mysql from "mysql2/promise";

const cfg = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "matrimony",
  password: process.env.DB_PASS || "matrimony",
  database: process.env.DB_NAME || "sriang",
  ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
};

const COUNTRY = "Abroad";

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection(cfg);
    console.log(`Connected to "${cfg.database}" on ${cfg.host}.`);

    const [existing] = await conn.query(
      "SELECT id FROM e_country WHERE TRIM(LOWER(country)) = TRIM(LOWER(?)) LIMIT 1",
      [COUNTRY]
    );

    if (existing.length) {
      console.log(`ℹ️  "${COUNTRY}" already exists in e_country (id ${existing[0].id}). Nothing to do.`);
      process.exit(0);
    }

    const [res] = await conn.query("INSERT INTO e_country (country) VALUES (?)", [COUNTRY]);
    console.log(`✅ Added "${COUNTRY}" to e_country (id ${res.insertId}).`);
    console.log("   It now appears in every country dropdown (registration, search, admin).");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main();
