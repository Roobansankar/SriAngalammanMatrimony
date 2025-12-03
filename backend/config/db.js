import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // refactor the password
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

export default db;
