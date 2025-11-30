'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (token && user) {
      fetchTodayPlan();
    }
  }, [token, user]);

  async function fetchTodayPlan() {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/today`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        console.log("No plan yet for today");
        return;
      }

      const data = await res.json();
      if (data.success || data.plan) {
        setPlan(data.plan?.plan_json || data.plan || null);
        setStreak(data.streak || 0);
      }
    } catch (err) {
      console.log("Fetch plan error:", err);
    }
  }

  async function generatePlan() {
    if (!token || !user) {
      toast.error("Please login first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          exam: user.exam || "JEE",
          examDate: user.target_year ? `${user.target_year}-04-02` : "2025-04-02"
        })
      });

      const data = await res.json();

      if (res.ok && (data.success || data.plan)) {
        setPlan(data.plan?.plan_json || data.plan);
        setStreak(data.streak || 0);
        toast.success("Daily plan generated successfully! Let's crush today 🔥");
        fetchTodayPlan(); // refresh immediately
      } else {
        toast.error(data.message || data.error || "Failed to generate plan");
      }
    } catch (err) {
      console.error("Generate plan error:", err);
      toast.error("Server busy. Try again in 10 seconds.");
    } finally {
      setLoading(false);
    }
  }

  async function markDone(i: number) {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/done`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ taskIndex: i })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPlan(data.plan);
        setStreak(data.streak || 0);
        toast.success("Task marked as done! Keep going 🔥");
      }
    } catch (err) {
      console.error("Mark done error:", err);
      toast.error("Failed to update task");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 mb-12 drop-shadow-2xl">
          Daily Study Target 🔥
        </h1>

        <div className="text-center mb-12">
          <Button
            size="lg"
            onClick={generatePlan}
            disabled={loading || !user}
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-2xl px-16 py-8 font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all disabled:opacity-60"
          >
            {loading ? "Generating Your Perfect Plan..." : "Generate Today's Plan"}
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 shadow-3xl rounded-3xl">
          {!user ? (
            <div className="text-center py-20">
              <p className="text-3xl text-red-400 font-bold">Please login to access Daily Target</p>
            </div>
          ) : !plan ? (
            <div className="text-center py-32">
              <p className="text-4xl text-gray-400 mb-6">No plan for today yet</p>
              <p className="text-2xl text-cyan-300">Click the button above to generate your AI-powered daily study plan!</p>
            </div>
          ) : (
            <>
              <h2 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-12">
                Today's Master Plan
              </h2>
              
              <div className="space-y-8">
                {plan.today?.map((task: any, i: number) => (
                  <div
                    key={i}
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center p-10 rounded-3xl border-4 transition-all duration-500 ${
                      task.done 
                        ? "bg-emerald-900/60 border-emerald-500 shadow-2xl shadow-emerald-500/40 scale-105" 
                        : "bg-white/5 border-white/20 hover:border-cyan-500 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-4xl font-bold text-white mb-3">{task.subject}</p>
                      <p className="text-2xl text-gray-200">{task.topic}</p>
                      <p className="text-lg text-gray-400 mt-4">⏱ {task.time || "Flexible timing"}</p>
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={() => markDone(i)}
                      disabled={task.done}
                      className={`text-2xl px-12 py-6 font-bold rounded-2xl ${
                        task.done 
                          ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg" 
                          : "bg-cyan-600 hover:bg-cyan-500 shadow-lg"
                      }`}
                    >
                      {task.done ? "Completed ✓" : "Mark as Done"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 drop-shadow-2xl">
                  Streak: {streak} Day{streak !== 1 ? "s" : ""} 🔥
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}