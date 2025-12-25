import "dotenv/config";
import db from "./config/db.js";

const testUsers = [
  {
    MatriID: "SAMT001",
    Name: "Pending Basic Male",
    Gender: "Male",
    ConfirmEmail: "pending_basic_m@example.com",
    ConfirmPassword: "password123",
    ParentPassword: "password123",
    Mobile: "9876543210",
    DOB: "1995-05-15",
    Status: "Pending",
    Plan: "basic",
    Regdate: new Date(),
    Profilecreatedby: "Self"
  },
  {
    MatriID: "SAFT001",
    Name: "Pending Basic Female",
    Gender: "Female",
    ConfirmEmail: "pending_basic_f@example.com",
    ConfirmPassword: "password123",
    ParentPassword: "password123",
    Mobile: "9876543211",
    DOB: "1997-08-20",
    Status: "Pending",
    Plan: "basic",
    Regdate: new Date(),
    Profilecreatedby: "Self"
  },
  {
    MatriID: "SAMT002",
    Name: "Pending Premium Male",
    Gender: "Male",
    ConfirmEmail: "pending_premium_m@example.com",
    ConfirmPassword: "password123",
    ParentPassword: "password123",
    Mobile: "9876543212",
    DOB: "1992-01-10",
    Status: "Pending",
    Plan: "premium",
    Regdate: new Date(),
    Profilecreatedby: "Self"
  },
  {
    MatriID: "SAMT003",
    Name: "Active Basic Male",
    Gender: "Male",
    ConfirmEmail: "active_basic_m@example.com",
    ConfirmPassword: "password123",
    ParentPassword: "password123",
    Mobile: "9876543213",
    DOB: "1990-12-25",
    Status: "Active",
    Plan: "basic",
    Regdate: new Date(),
    Profilecreatedby: "Self"
  }
];

async function seed() {
  const conn = db.promise();
  console.log("🌱 Seeding test users...");

  const defaults = {
    shani: "",
    Manglik: "",
    parigarasevai: "",
    Sevai: "",
    Raghu: "",
    Keethu: "",
    Horosmatch: "",
    Star: "",
    Moonsign: "",
    Caste: "",
    Religion: "",
    Subcaste: "",
    Education: "",
    Occupation: "",
    Address: "",
    City: "",
    State: "",
    Country: "",
    Maritalstatus: "Unmarried"
  };

  for (const user of testUsers) {
    try {
      const finalUser = { ...defaults, ...user };
      const keys = Object.keys(finalUser);
      const values = Object.values(finalUser);
      const placeholders = keys.map(() => "?").join(", ");
      const sql = `INSERT INTO register (${keys.join(", ")}) VALUES (${placeholders})`;
      
      await conn.query(sql, values);
      console.log(`✅ Inserted: ${finalUser.Name} (${finalUser.MatriID})`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn(`⚠️ User already exists: ${user.MatriID}`);
      } else {
        console.error(`❌ Error inserting ${user.MatriID}:`, err.message);
      }
    }
  }

  console.log("✨ Seeding completed.");
  process.exit(0);
}

seed();
