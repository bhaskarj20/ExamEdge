require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { OpenAI } = require('openai');

const app = express();

// CORS — allows your live frontend + localhost
app.use(cors({
  origin: ["http://localhost:3000", "https://examedge-mr-sk534.vercel.app", "*.vercel.app", "*.railway.app"],
  credentials: true
}));

app.use(express.json());

// DATABASE — works everywhere (Railway, Render, local, Vercel)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JWT_SECRET = process.env.JWT_SECRET || "nexathon-win-2025";

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ message: "ExamEdge Backend LIVE", time: new Date().toISOString() });
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, targetExam = "JEE Main & Advanced" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, target_exam) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, target_exam`,
      [name, email, hashed, targetExam]
    );

    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(400).json({ success: false, error: err.message.includes("duplicate key") ? "Email already exists" : "Server error" });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, target_exam: user.target_exam }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// AI DOUBT SOLVER
app.post('/api/doubt', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are ExamEdge AI — India's smartest exam tutor. Answer clearly, step-by-step, in English + Hindi if needed." },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ error: "AI is busy, try again!" });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ExamEdge Backend LIVE on port ${PORT}`);
  console.log(`→ http://localhost:${PORT}`);
});

module.exports = app; // for Vercel/Render