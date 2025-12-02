import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // refactor the password
  password: "Secure@12345",
  database: "sriang",
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
