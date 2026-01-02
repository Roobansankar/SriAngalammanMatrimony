import express from "express";

import ccavenueInit from "./ccavenue-init.js";
import ccavenueResponse from "./ccavenue-response.js";

const router = express.Router();

// CCAvenue routes
router.use("/", ccavenueInit);
router.use("/", ccavenueResponse);

export default router;
