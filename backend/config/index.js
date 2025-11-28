// backend/config/index.js
const pool = require("./database");
const { generateToken, verifyToken } = require("./jwt");
const corsOptions = require("./cors");
const { limiter, authLimiter } = require("./rateLimit");

module.exports = {
  pool,
  generateToken,
  verifyToken,
  corsOptions,
  limiter,
  authLimiter,
};