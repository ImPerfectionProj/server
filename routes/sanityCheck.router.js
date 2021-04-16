const express = require("express");
const router = express.Router();

// sanity check
router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world" });
});

// sanity check
router.post("/", (req, res) => {
  res.status(200).json({ message: req.body });
});

module.exports = router;
