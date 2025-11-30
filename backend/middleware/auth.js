
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await pool.query(
        "SELECT id, name, email, phone, exam, target_year, role, xp, streak FROM users WHERE id = $1",
        [decoded.id]
      );

      if (!result.rows[0]) {
        return res.status(401).json({ success: false, message: "Not authorized – user not found" });
      }

      req.user = result.rows[0];
      next();
    } catch (err) {
      console.error("Token error:", err.message);
      return res.status(401).json({ success: false, message: "Not authorized – invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized – no token" });
  }
};

module.exports = protect;
