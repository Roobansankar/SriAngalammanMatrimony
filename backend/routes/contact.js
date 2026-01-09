import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "Contact route working" });
});

export default router;
