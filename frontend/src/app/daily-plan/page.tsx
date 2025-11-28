'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTodayPlan();
  }, []);

  async function fetchTodayPlan() {
    const res = await fetch("http://localhost:5000/api/daily-plan/today", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlan(data.plan?.plan_json);
  }

  async function generatePlan() {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const res = await fetch("http://localhost:5000/api/daily-plan/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exam: user.exam,
        examDate: `${user.target_year}-04-02`,
      }),
    });

    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  }

  async function markDone(i: number) {
    const res = await fetch("http://localhost:5000/api/daily-plan/done", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ taskIndex: i }),
    });

    const data = await res.json();
    setPlan(data.plan);
    setStreak(data.streak);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-10 text-white">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6">
        Daily Study Target 📘
      </h1>

      <div className="flex justify-center mb-6">
        <Button
          className="bg-emerald-600 hover:bg-emerald-500"
          onClick={generatePlan}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Today's Plan"}
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-xl border border-white/20">
        {!plan ? (
          <p className="text-gray-300 text-center">No plan yet. Generate one.</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Today's Tasks</h2>

            {plan.today.map((task: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/5 p-4 mb-3 rounded-xl border border-white/10"
              >
                <div>
                  <p className="text-xl font-bold">{task.subject}</p>
                  <p className="text-gray-300">{task.topic}</p>
                  <p className="text-gray-400 text-sm">Time: {task.time}</p>
                </div>

                <Button
                  className={task.done ? "bg-green-600" : "bg-blue-600"}
                  onClick={() => markDone(i)}
                >
                  {task.done ? "Completed ✓" : "Mark Done"}
                </Button>
              </div>
            ))}

            <h2 className="text-xl font-bold text-emerald-400 mt-6">
              Streak: {streak} 🔥
            </h2>
          </>
        )}
      </Card>
    </div>
  );
}
