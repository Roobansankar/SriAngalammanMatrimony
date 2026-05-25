import "dotenv/config";
import mysql from "mysql2";

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "matrimony",
  password: process.env.DB_PASS || "matrimony",
  database: process.env.DB_NAME || "sriang",
  port: 3306, // Try default port first
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.log("Failed on 3306, trying 3307...");
    config.port = 3307;
    const conn2 = mysql.createConnection(config);
    conn2.connect((err2) => {
      if (err2) {
        console.error("Failed to connect on both ports.");
        process.exit(1);
      }
      checkTable(conn2);
    });
  } else {
    checkTable(connection);
  }
});

function checkTable(conn) {
  conn.query("DESCRIBE contact_messages", (err, results) => {
    if (err) {
      console.error("Error describing table:", err.message);
    } else {
      console.log("Columns in contact_messages:");
      results.forEach(row => {
        console.log(`- ${row.Field} (${row.Type})`);
      });
    }
    conn.end();
  });
}
