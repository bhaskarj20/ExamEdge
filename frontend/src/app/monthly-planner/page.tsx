"use client";

import { useState } from "react";

export default function MonthlyPlannerPage() {
  const [exam, setExam] = useState("JEE");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  // ===============================
  // Generate Plan (Fetch from Backend)
  // ===============================
  async function generatePlan() {
    if (!examDate) {
      alert("Please select exam date!");
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-monthly-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exam, examDate }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed to generate plan");
        setLoading(false);
        return;
      }

      setPlan(data.plan);
    } catch (err) {
      alert("Server error, please try again.");
    }

    setLoading(false);
  }

  // ===============================
  // DOWNLOAD PLAN AS TEXT FILE
  // ===============================
  function downloadPlan() {
    if (!plan) return;

    const element = document.createElement("a");
    const file = new Blob([plan], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Monthly_Plan_${exam}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 to-blue-900">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-cyan-300 mb-10 drop-shadow-lg">
          Monthly Planner
        </h1>

        {/* INPUT CARD */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg space-y-4">

          {/* Exam Selector */}
          <div>
            <label className="text-lg text-gray-200 font-semibold">Target Exam</label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="w-full mt-2 p-3 rounded-lg bg-white/5 text-white border border-white/10"
            >
              <option value="" disabled>Select Your Target Exam</option>
                  <option value="JEE" className="bg-green-900 text-white">JEE Main + Advanced</option>
                  <option value="NEET" className="bg-green-900 text-white">NEET</option>
                  <option value="VITEEE" className="bg-green-900 text-white">VITEEE</option>
                  <option value="BITSAT" className="bg-green-900 text-white">BITSAT</option>
            </select>
          </div>

          {/* Exam Date */}
          <div>
            <label className="text-lg text-gray-200 font-semibold">Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full mt-2 p-3 rounded-lg bg-white/5 text-white border border-white/10"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Monthly Plan"}
          </button>
        </div>

        {/* PLAN OUTPUT */}
        <div className="mt-8 bg-white/10 border border-white/10 rounded-xl p-6 shadow-xl min-h-[200px]">

          {!plan && !loading && (
            <p className="text-center text-gray-400 text-lg">
              Your AI-generated monthly plan will appear here.
            </p>
          )}

          {loading && (
            <p className="text-center text-cyan-300 text-lg animate-pulse">
              Preparing your personalized study plan…
            </p>
          )}

          {plan && (
            <>
              <pre className="whitespace-pre-wrap text-gray-200 text-lg leading-relaxed">
                {plan}
              </pre>

              {/* Download Button */}
              <button
                onClick={downloadPlan}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition"
              >
                Download Plan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
