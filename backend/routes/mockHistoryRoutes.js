const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { saveMockHistory, getMockHistory } = require("../controllers/mockHistoryController");


router.post("/save", protect, saveMockHistory);


router.get("/history", protect, getMockHistory);

module.exports = router;
