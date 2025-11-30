'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This forces the page to be dynamic → no more localStorage prerender error
export const dynamic = 'force-dynamic';
// Optional (extra safety): export const revalidate = 0;

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Safely access localStorage only on client
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  const getUser = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem("user") || "null");
    }
    return null;
  };

  const token = getToken();

  useEffect(() => {
    if (token) {
      fetchTodayPlan();
    }
  }, [token]);

  async function fetchTodayPlan() {
    try {
      const res = await fetch("/api/daily-plan/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch plan");
      const data = await res.json();
      setPlan(data.plan?.plan_json || data.plan);
      setStreak(data.streak || 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function generatePlan() {
    setLoading(true);
    const user = getUser();

    try {
      const res = await fetch("/api/daily-plan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam: user?.exam,
          examDate: `${user?.target_year}-04-02`,
        }),
      });

      const data = await res.json();
      setPlan(data.plan);
      setStreak(data.streak || 0);
      await fetchTodayPlan(); // Refresh streak
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markDone(i: number) {
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

      <div className="flex justify-center mb-6">
        <Button
          className="bg-emerald-600 hover:bg-emerald-500 transition-all"
          onClick={generatePlan}
          disabled={loading || !token}
        >
          {loading ? "Generating Plan..." : "Generate Today's Plan"}
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        {!token ? (
          <p className="text-center text-red-400 text-lg">
            Please log in to use Daily Plan feature.
          </p>
        ) : !plan ? (
          <p className="text-gray-300 text-center text-lg">
            No plan for today. Click the button above to generate one!
          </p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-6 text-center">
              Today's Tasks
            </h2>

            <div className="space-y-4">
              {plan.today?.map((task: any, i: number) => (
                <div
                  key={i}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-xl border transition-all ${
                    task.done
                      ? "bg-green-900/30 border-green-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-xl font-bold text-white">{task.subject}</p>
                    <p className="text-gray-200">{task.topic}</p>
                    <p className="text-gray-400 text-sm mt-1">⏱ {task.time}</p>
                  </div>

                  <Button
                    size="lg"
                    className={
                      task.done
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-blue-600 hover:bg-blue-500"
                    }
                    onClick={() => markDone(i)}
                    disabled={task.done}
                  >
                    {task.done ? "Completed ✓" : "Mark as Done"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-emerald-400">
                Current Streak: {streak} Day{streak !== 1 ? "s" : ""} 🔥
              </h2>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}