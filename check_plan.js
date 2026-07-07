import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Secure@12345",
  database: "sriang",
  waitForConnections: true,
  connectionLimit: 1
});

const conn = pool.promise();

async function main() {
  // Check premium profiles (SAMP prefix)
  const [premium] = await conn.query(
    "SELECT MatriID, Plan, Status, visibility FROM register WHERE MatriID LIKE 'SAMP%' LIMIT 50"
  );
  console.log("=== PREMIUM PROFILES (MatriID starts with SAMP) ===");
  console.table(premium);

  // Check how many basic profiles have Plan NULL or empty
  const [nullPlan] = await conn.query(
    "SELECT MatriID, Plan, Status FROM register WHERE TRIM(LOWER(Plan)) IS NULL OR TRIM(LOWER(Plan)) = '' OR TRIM(LOWER(Plan)) NOT IN ('basic','premium') LIMIT 20"
  );
  console.log("\n=== PROFILES WITH NULL/EMPTY/INVALID PLAN ===");
  console.table(nullPlan);

  // Count plans
  const [counts] = await conn.query(
    "SELECT TRIM(LOWER(Plan)) as plan, COUNT(*) as count FROM register GROUP BY TRIM(LOWER(Plan))"
  );
  console.log("\n=== PLAN DISTRIBUTION ===");
  console.table(counts);

  // Check all unique plan values (including casing)
  const [raw] = await conn.query(
    "SELECT DISTINCT Plan FROM register"
  );
  console.log("\n=== ALL DISTINCT PLAN VALUES (raw) ===");
  console.table(raw);

  // Check basic users - are they stored as 'basic' or 'Basic' or something else?
  const [basic] = await conn.query(
    "SELECT MatriID, Plan FROM register WHERE MatriID LIKE 'SAMM%' OR MatriID LIKE 'SAMF%' LIMIT 20"
  );
  console.log("\n=== BASIC PROFILES (SAMM/SAMF prefix) ===");
  console.table(basic);

  pool.end();
}

main().catch(err => { console.error(err); pool.end(); });
