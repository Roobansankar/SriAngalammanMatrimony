
import "dotenv/config";
import db from "./config/db.js";

const sql = "SHOW COLUMNS FROM register LIKE 'Plan'";
db.query(sql, (err, results) => {
  if (err) {
    console.error("Error checking Plan column:", err);
  } else {
    console.log("Plan Column:", results);
  }
  process.exit();
});
