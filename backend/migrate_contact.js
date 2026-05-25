import "dotenv/config";
import mysql from "mysql2";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || "matrimony",
  password: process.env.DB_PASS || "matrimony",
  database: process.env.DB_NAME || "sriang",
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
  console.log("Connected to database.");

  const sql = "ALTER TABLE contact_messages ADD COLUMN phone VARCHAR(20) AFTER email";
  
  connection.query(sql, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log("Column 'phone' already exists.");
      } else {
        console.error("Error adding column:", err);
      }
    } else {
      console.log("Column 'phone' added successfully.");
    }
    connection.end();
  });
});
