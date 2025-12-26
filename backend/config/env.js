// Backend environment configuration
// Centralizes all environment variable access with sensible defaults

export const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // Database
  db: {
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "matrimony",
    password: process.env.DB_PASS || "matrimony",
    database: process.env.DB_NAME || "sriang",
  },

  // Public URLs (for absolute links in emails, images, etc.)
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000",
  baseUrl: process.env.BASE_URL || "http://localhost:5000",

  // Auth
  jwtSecret: process.env.JWT_SECRET || "secret123",

  // SMTP
  smtp: {
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
};

export default config;
