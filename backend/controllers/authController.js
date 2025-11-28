const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ======================== REGISTER ========================
const register = async (req, res) => {
  try {
    const { name, email, phone, password, targetExam, targetYear } = req.body;

    // Required fields validation
    if (!name || !email || !password || !targetExam || !targetYear) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: Name, Email, Password, Target Exam, Target Year"
      });
    }

    // Check if user already exists
    const check = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Supabase (exact match with your columns)
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password, exam, target_year) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, phone, exam, target_year`,
      [name, email, phone || null, hashedPassword, targetExam, targetYear]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        exam: user.exam,
        target_year: user.target_year
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};

// ======================== LOGIN ========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Success login
    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        exam: user.exam,
        target_year: user.target_year
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};

module.exports = { register, login };