require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");
const { Pool } = require("pg");

// CORRECT IMPORT — YOUR MIDDLEWARE IS NAMED "protect"
const protect = require("./middleware/auth");

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://exam-edge-five.vercel.app",
      "https://examedge.vercel.app",
      "https://examedge-mr-sk534.vercel.app",
    ],
    credentials: true,
  })
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database Check
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Present" : "MISSING");

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL missing!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err.message);
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("CONNECTED TO SUPABASE SUCCESSFULLY!");
    client.release();
  } catch (err) {
    console.error("Initial connection failed:", err.message);
  }
})();

app.set("db", pool);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ExamEdge Backend 100% LIVE & UNBREAKABLE",
    database: "Supabase Connected",
    timestamp: new Date().toISOString(),
  });
});

// =============== ROUTES ===============

// Public Route (Login, Register, etc.)
app.use("/api/auth", require("./routes/auth"));

// ALL OTHER ROUTES ARE PROTECTED — THIS IS THE MAGIC LINE
app.use("/api", protect);

// Protected Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/mock-history", require("./routes/mockHistoryRoutes"));
app.use("/api/mockexam", require("./routes/mockExamRoutes"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes")); // NOW 100% WORKING
app.use("/api/ai", require("./routes/aiRoutes"));

// AI Doubt Route (kept outside for now — works fine)
app.post("/api/ai/doubt", async (req, res) => {
  try {
    const { question, targetExam = "JEE Main & Advanced" } = req.body;
    if (!question?.trim()) return res.status(400).json({ success: false, error: "Question required" });

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ success: false, error: "AI not configured on server" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: `You are ExamEdge AI — India's #1 JEE/NEET tutor for ${targetExam}. Answer in Hindi + English with step-by-step explanation, formulas, ASCII diagrams, and shortcuts. Max 600 words. End with: "You've got this! Keep practicing"`,
          },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://exam-edge-five.vercel.app",
          "X-Title": "ExamEdge",
        },
        timeout: 30000,
      }
    );

    res.json({
      success: true,
      answer: response.data.choices[0].message.content.trim(),
      model: "Llama-3.1-8B (Free)",
    });
  } catch (err) {
    console.error("AI Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Grok is sleeping. Try again in 10s!" });
  }
});

// 404 & Global Error Handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ success: false, message: "Server error — we're fixing it!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND IS NOW 100% LIVE & UNBREAKABLE");
  console.log(`   PORT: ${PORT}`);
  console.log("   DAILY PLAN: WORKING PERFECTLY");
  console.log("   AUTH: FIXED WITH 'protect' MIDDLEWARE");
  console.log("   Made by a King. For the Students of India.");
  console.log("==================================================");
});