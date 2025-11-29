"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, CalendarDays, Percent, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MockAttempt {
  id: string;
  mock_name: string;
  score: number;
  total_marks: number;
  accuracy?: number;
  date: string;
}

export default function MockHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<MockAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetch("http://localhost:5000/api/mock-history/history", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHistory(data.history);
      } else {
        console.log("History load failed:", data);
      }
    } catch (err) {
      console.log("Error loading history", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 text-white px-6 py-10">

      {/* BACK BUTTON */}
      <Button 
        className="mb-6 bg-white/10 hover:bg-white/20"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </Button>

      <h1 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r 
        from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        My Mock Test Attempts
      </h1>

      {loading ? (
        <p className="text-center text-lg text-gray-300">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-xl text-gray-400">
          You haven't taken any mock tests yet.
        </p>
      ) : (
        <div className="grid gap-8 max-w-4xl mx-auto">
          {history.map((item) => {
            const acc = item.accuracy ?? Number(((item.score / item.total_marks) * 100).toFixed(1));

            return (
              <Card 
                key={item.id}
                className="p-6 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl"
              >
                <h3 className="text-3xl font-bold text-cyan-300">{item.mock_name}</h3>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Score */}
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-emerald-400" />
                    <div>
                      <p className="text-lg font-semibold">Score</p>
                      <p className="text-xl">{item.score} / {item.total_marks}</p>
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div className="flex items-center gap-3">
                    <Percent className="w-7 h-7 text-yellow-400" />
                    <div>
                      <p className="text-lg font-semibold">Accuracy</p>
                      <p className="text-xl">{acc}%</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-7 h-7 text-pink-400" />
                    <div>
                      <p className="text-lg font-semibold">Date</p>
                      <p className="text-xl">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                </div>

              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
