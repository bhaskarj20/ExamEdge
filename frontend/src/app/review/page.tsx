"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function ReviewPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("http://localhost:5000/api/mock-history/history", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          },
        });

        const data = await res.json();

        if (data.success) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-slate-950 via-blue-900 to-slate-800 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Mock Test Review</h1>

      {loading ? (
        <p className="text-center text-gray-300">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">You have not attempted any mock tests yet.</p>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {history.map((mock, i) => (
            <Card
              key={i}
              className="p-6 bg-white/10 border border-white/20 rounded-xl"
            >
              <h2 className="text-2xl font-semibold text-emerald-300">{mock.mock_name}</h2>
              <p className="mt-3 text-lg">Score: <span className="font-bold">{mock.score}/{mock.total_marks}</span></p>
              <p className="text-lg">Accuracy: <span className="font-bold">{mock.accuracy}%</span></p>
              <p className="text-sm text-gray-400 mt-2">
                Attempted on: {new Date(mock.created_at).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

