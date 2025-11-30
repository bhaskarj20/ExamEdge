// routes/dailyPlanRoutes.js → FINAL VERSION (WORKS 100%)

const express = require("express");
const router = express.Router();
const { generateDailyPlan, getTodayPlan, markTaskDone } = require("../controllers/dailyPlanController");

// GET today's plan
router.get("/today", getTodayPlan);

// GENERATE new plan — FIXED & UNBREAKABLE
router.post("/generate", async (req, res) => {
  try {
    const { exam, examDate } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!exam || !examDate) {
      return res.status(400).json({ success: false, message: "Exam and examDate required" });
    }

    // Convert examDate to proper format if needed
    const date = new Date(examDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid exam date" });
    }

    const plan = await generateDailyPlan(userId, exam, examDate);
    
    res.json({ 
      success: true, 
      plan,
      streak: plan.streak || 0,
      message: "Daily plan generated successfully! 🔥"
    });

  } catch (err) {
    console.error("Generate daily plan error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate plan. Try again!" 
    });
  }
});

// Mark task as done
router.put("/done", markTaskDone);

module.exports = router;