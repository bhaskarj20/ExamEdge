// backend/server.js → FINAL & PERFECT VERSION (2025 Ready)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Pool } = require("pg");
const { OpenAI } = require("openai");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://examedge-mr-sk534.vercel.app",
    "https://examedge.vercel.app",
    "https://yourdomain.com"
  ],
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== DATABASE ====================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed ❌", err.stack);
    process.exit(1);
  } else {
    console.log("PostgreSQL connected successfully");
  }
});

// ==================== OPENAI ====================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExamEdge Backend is LIVE & Ready for JEE/NEET 2026!",
    timestamp: new Date().toISOString(),
    status: "operational",
    endpoints: {
      auth: "/api/auth/register | /api/auth/login",
      mock: "/api/mock (protected)",
      doubt: "POST /api/doubt"
    }
  });
});

// ==================== ROUTES ====================
// Auth Routes (register, login, me, logout)
app.use("/api/auth", require("./routes/auth"));

// Mock Test Routes (protected by JWT)
app.use("/api/mock", require("./routes/mock"));

// AI Doubt Solver (Public for now – make protected later if needed)
app.post("/api/doubt", async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Question is required"
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are ExamEdge AI — India's smartest JEE & NEET tutor. Answer in clear, simple English + Hindi if helpful. Use bullet points, steps, and diagrams (text-based) when possible. Be encouraging and accurate."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.6,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const answer = completion.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      answer: answer,
      usage: completion.usage
    });

  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({
      success: false,
      error: "AI is busy right now. Please try again in a few seconds!"
    });
  }
});

// ==================== 404 & ERROR HANDLER ====================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND IS LIVE AND RUNNING");
  console.log(`   Local:      http://localhost:${PORT}`);
  console.log(`   Deployed:   Check your platform logs`);
  console.log(`   Time:       ${new Date().toLocaleString("en-IN")}`);
  console.log("==================================================");
});

module.exports = app; // Required for Vercel, Railway, Render