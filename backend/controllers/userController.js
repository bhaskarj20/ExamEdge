const pool = require("../config/db");
// or wherever your pool is
const jwt = require("jsonwebtoken");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, exam, target_year } = req.body;

    const query = `
      UPDATE users 
      SET name = $1, phone = $2, exam = $3, target_year = $4 
      WHERE id = $5
      RETURNING id, name, email, phone, exam, target_year;
    `;

    const values = [name, phone, exam, target_year, userId];

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

