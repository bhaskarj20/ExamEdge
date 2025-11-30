'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// THIS LINE IS THE MOST IMPORTANT — IT FIXES THE ERROR
export const dynamic = 'force-dynamic';

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Safe localStorage access — only runs in browser
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (token) {
      fetchTodayPlan();
    }
  }, [token]);

  async function fetchTodayPlan() {
    if (!token) return;

    try {
      const res = await fetch("/api/daily-plan/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlan(data.plan?.plan_json || data.plan);
      setStreak(data.streak || 0);
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    }
  }

  async function generatePlan() {
    if (!token || !user) return;

    setLoading(true);
    try {
      const res = await fetch("/api/daily-plan/generate", {
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
      setStreak(data.streak || 0);
      fetchTodayPlan(); // refresh
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markDone(i: number) {
    if (!token) return;

    try {
      const res = await fetch("/api/daily-plan/done", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskIndex: i }),
      });

      const data = await res.json();
      setPlan(data.plan);
      setStreak(data.streak || 0);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-10 text-white">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6">
        Daily Study Target 📘
      </h1>

      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-500 text-lg px-8"
          onClick={generatePlan}
          disabled={loading || !token}
        >
          {loading ? "Generating..." : "Generate Today's Plan"}
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20">
        {!token ? (
          <p className="text-center text-red-400 text-xl">Please log in to use Daily Plan.</p>
        ) : !plan ? (
          <p className="text-center text-gray-300 text-lg">No plan yet. Generate one above!</p>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-cyan-300 text-center mb-6">Today's Tasks</h2>
            <div className="space-y-4">
              {plan.today?.map((task: any, i: number) => (
                <div
                  key={i}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-xl border transition-all ${
                    task.done ? "bg-green-900/40 border-green-500" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div>
                    <p className="text-2xl font-bold">{task.subject}</p>
                    <p className="text-lg text-gray-200">{task.topic}</p>
                    <p className="text-sm text-gray-400 mt-1">⏱ {task.time}</p>
                  </div>
                  <Button
                    size="lg"
                    className={task.done ? "bg-green-600" : "bg-blue-600"}
                    onClick={() => markDone(i)}
                    disabled={task.done}
                  >
                    {task.done ? "Completed ✓" : "Mark Done"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-4xl font-bold text-emerald-400">
                Streak: {streak} Day{streak !== 1 ? "s" : ""} 🔥
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}