
import "dotenv/config";
import db from "./config/db.js";

const sql = "DESCRIBE register";
db.query(sql, (err, results) => {
  if (err) {
    console.error("Error describing register table:", err);
  } else {
    console.log("Register Table Schema:", results);
  }
  process.exit();
});
