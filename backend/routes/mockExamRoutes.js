const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const loadMockTests = require("../utils/loadMocks");

router.get("/available", (req, res) => {
  const mocks = loadMockTests();
  res.json({ success: true, mocks });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, `../mock-data/jee/${id}.json`);

  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      res.json({ success: true, mock: data });
    } else {
      res.status(404).json({ success: false, message: "Mock not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error loading mock" });
  }
});

module.exports = router;