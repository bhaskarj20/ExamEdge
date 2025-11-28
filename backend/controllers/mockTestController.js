// backend/controllers/mockTestController.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get all available mock tests (public list)
const getAllMocks = async (req, res) => {
  try {
    // For now, return dummy mocks. Later connect to real mock table
    const mocks = [
      { id: "1", name: "JEE Main 2025 Mock 1", subject: "Full Syllabus", questions: 90, duration: 180 },
      { id: "2", name: "NEET 2025 Mock Test", subject: "PCB", questions: 200, duration: 200 },
      { id: "3", name: "WBJEE 2025 Practice", subject: "PCM", questions: 155, duration: 240 },
    ];
    res.json({ success: true, mocks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single mock with questions
const getMockById = async (req, res) => {
  try {
    const { id } = req.params;
    // Dummy questions – replace with real DB later
    const questions = [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
      },
      // Add 10–20 more...
    ];
    res.json({ success: true, mock: { id, name: "Sample Mock", questions } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Submit mock test
const submitMockTest = async (req, res) => {
  try {
    const { mockId } = req.params;
    const { answers } = req.body; // { 1: 2, 2: 0, ... }

    // Dummy scoring
    const total = 20;
    const correct = Object.values(answers).filter(a => a === 2).length;
    const accuracy = (correct / total) * 100;

    // Save to DB
    await pool.query(
      `INSERT INTO test_history 
       (user_id, test_name, total_marks, scored_marks, accuracy, correct, attempted, time_taken)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [req.user.id, "Sample Mock Test", total * 4, correct * 4, accuracy, correct, Object.keys(answers).length, 3600]
    );

    res.json({
      success: true,
      result: { total, correct, accuracy, marks: correct * 4 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// User mock history
const getUserMockHistory = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM test_history WHERE user_id = $1 ORDER BY submitted_at DESC",
      [req.user.id]
    );
    res.json({ success: true, history: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createMockTest = async (req, res) => {
  res.status(403).json({ success: false, message: "Admin only" });
};

module.exports = {
  createMockTest,
  getAllMocks,
  getMockById,
  submitMockTest,
  getUserMockHistory,
};
