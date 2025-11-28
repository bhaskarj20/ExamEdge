// backend/routes/mock.js
const express = require("express");
const router = express.Router();
const {
  createMockTest,
  getAllMocks,
  getMockById,
  submitMockTest,
  getUserMockHistory,
} = require("../controllers/mockTestController");
const { protect } = require("../middleware/auth");

// All mock test routes are protected
router.use(protect); // ← every route below needs login

router.post("/create", createMockTest);           // Admin creates mock
router.get("/", getAllMocks);                     // Get all available mocks
router.get("/history", getUserMockHistory);       // User's past attempts
router.get("/:id", getMockById);                  // Get single mock with questions
router.post("/:id/submit", submitMockTest);       // Submit answers → get result

module.exports = router;