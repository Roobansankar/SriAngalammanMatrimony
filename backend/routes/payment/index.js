import express from "express";
import ccavenueRoutes from "./ccavenue.js";

const router = express.Router();
router.use("/", ccavenueRoutes);

export default router;
