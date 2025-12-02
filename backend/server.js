// server.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as IOServer } from "socket.io";
import db from "./config/db.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import interestRoutes from "./routes/interest.js";
import paymentRoutes from "./routes/payment.js";
import registerRoutes from "./routes/register.js";
import searchRoutes from "./routes/search.js";
import idSearchRoutes from "./routes/searchByMatriID.js";

const app = express();
const PORT = process.env.PORT || 5000;

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL Database");
});

// app.use(cors());
const corsOptions = {
  origin: "*", // allow any origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/gallery", express.static("gallery")); // <-- corrected folder path
app.use("/kundli", express.static("kundli"));

app.use("/api", searchRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", idSearchRoutes);
app.use("/api/auth", interestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("Matrimony API running..."));

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// in-memory map: matriid/email -> socketId (simple)
const onlineMap = new Map();

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // client should emit 'register' with { matriid, email } after connecting
  socket.on("register", (payload) => {
    try {
      const key = (payload?.matriid || payload?.email)?.toString().trim();
      if (key) {
        onlineMap.set(key.toLowerCase(), socket.id);
        socket.data.userKey = key.toLowerCase();
        console.log("registered socket for", key, socket.id);
      }
    } catch (e) {}
  });

  socket.on("disconnect", () => {
    // cleanup map entries with this socket id
    for (const [k, v] of onlineMap.entries()) {
      if (v === socket.id) onlineMap.delete(k);
    }
    console.log("socket disconnected", socket.id);
  });
});

// make io and map useful to routes
app.set("io", io);
app.set("onlineMap", onlineMap);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("SMTP_USER present:", !!process.env.SMTP_USER);
  console.log("SMTP_PASS present:", !!process.env.SMTP_PASS);
});
