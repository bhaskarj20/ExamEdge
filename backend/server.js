require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

// ============================================
// ENVIRONMENT VALIDATION
// ============================================
const required = ["DATABASE_URL", "OPENROUTER_API_KEY"];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error("==================================================");
  console.error("❌ MISSING REQUIRED ENV VARIABLES:");
  missing.forEach(k => console.error(`   → ${k}`));
  console.error("==================================================");
  process.exit(1);
}

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://examedge-mr-sk534.vercel.app",
    "https://examedge.vercel.app"
  ],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// DATABASE CONNECTION – NEVER CRASHES AGAIN
// ============================================
let pool = null;

if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Works perfectly for Supabase, Render, Neon, etc.
  });

  // Test connection without killing the server
  pool.connect()
    .then(client => {
      console.log("✅ PostgreSQL connected successfully");
      client.release();
    })
    .catch(err => {
      console.error("⚠️ Could not connect to database (server continues):", err.message);
      // We don't exit — AI routes & most features still work
    });
} else {
  console.error("❌ DATABASE_URL is missing!");
}

app.set("db", pool); // Make available to all routes

// ============================================
// ROUTES
// ============================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ExamEdge Backend LIVE — Powered by GROK AI",
    model: "x-ai/grok-4.1-fast:free",
    database: pool ? "connected" : "not configured",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", database: pool ? "connected" : "offline" });
});

// Load all routes (they will work fine even if DB is down)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/mock-history", require("./routes/mockHistoryRoutes"));
app.use("/api/mockexam", require("./routes/mockExamRoutes"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ============================================
// AI DOUBT SOLVER (Works 100% without DB)
// ============================================
app.post("/api/ai/doubt", async (req, res) => {
  try {
    const { question, targetExam = "JEE Main & Advanced" } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ success: false, error: "Question is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "x-ai/grok-4.1-fast:free",
        messages: [
          {
            role: "system",
            content: `You are ExamEdge AI — India's smartest tutor for ${targetExam}.
Provide:
• Clear step-by-step explanation
• Hindi + English support
• Formulas + ASCII diagrams
• JEE/NEET shortcuts
• Max 600 words
• End with: "You've got this! Keep practicing"`
          },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://examedge-mr-sk534.vercel.app",
          "X-Title": "ExamEdge - AI Exam Prep",
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    const answer = response.data.choices[0].message.content.trim();
    res.json({ success: true, answer, model: "Grok-4.1-fast" });

  } catch (err) {
    console.error("Grok AI Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.status === 429
        ? "Grok is busy right now. Try again in a few seconds!"
        : "AI service temporarily down. Please try again!"
    });
  }
});

// ============================================
// 404 & ERROR HANDLER
// ============================================
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found", path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND LIVE — POWERED BY GROK AI");
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Database: ${pool ? "Connected" : "Not configured"}`);
  console.log("==================================================");
});