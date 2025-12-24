
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import db from "./backend/config/db.js";

const sql = "DESCRIBE admin";
db.query(sql, (err, results) => {
  if (err) {
    console.error("Error describing admin table:", err);
  } else {
    console.log("Admin Table Schema:", results);
  }
  process.exit();
});
