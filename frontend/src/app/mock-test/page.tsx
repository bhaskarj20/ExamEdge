// frontend/src/app/mock-test/page.tsx   ← REPLACE OR CREATE THIS FILE

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Timer, ChevronLeft, ChevronRight, Flag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const mockQuestions = [
  {
    id: 1,
    question: "The unit of electric field intensity is:",
    options: ["N/C", "V/m", "Both A & B", "None"],
    correct: 2,
    subject: "Physics"
  },
  {
    id: 2,
    question: "Which of the following is NOT a greenhouse gas?",
    options: ["CO₂", "CH₄", "O₂", "N₂O"],
    correct: 2,
    subject: "Chemistry"
  },
  {
    id: 3,
    question: "If log₍₁₀₎2 = 0.3010, then log₍₁₀₎20 = ?",
    options: ["1.3010", "0.3010", "2.3010", "1.6020"],
    correct: 0,
    subject: "Mathematics"
  },
  // Add more questions or load from API later
].concat(Array.from({ length: 87 }, (_, i) => ({
  id: i + 4,
  question: `Question ${i + 4} from previous year JEE/NEET`,
  options: ["Option A", "Option B", "Option C", "Option D"],
  correct: Math.floor(Math.random() * 4),
  subject: ["Physics", "Chemistry", "Mathematics"][i % 3]
})));

export default function MockTest() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQ]: parseInt(value) });
  };

  const handleSubmit = () => {
    let correct = 0;
    mockQuestions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const score = (correct / mockQuestions.length) * 100;

    toast.success(`Test Submitted! Score: ${correct}/${mockQuestions.length} (${score.toFixed(1)}%)`);
    setShowResult(true);
  };

  if (showResult) {
    const correct = mockQuestions.filter((q, i) => answers[i] === q.correct).length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border-white/20 p-12 text-center">
          <CheckCircle2 className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Test Completed!</h1>
          <div className="text-7xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {correct} / {mockQuestions.length}
          </div>
          <p className="text-2xl mt-4 text-gray-300">
            Accuracy: {((correct / mockQuestions.length) * 100).toFixed(1)}%
          </p>
          <Button size="lg" className="mt-8" onClick={() => window.location.reload()}>
            Attempt Again
          </Button>
        </Card>
      </div>
    );
  }

  const q = mockQuestions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold">JEE Main 2025 Mock Test</h2>
            <div className="flex items-center gap-3 bg-red-500/20 px-4 py-2 rounded-lg">
              <Timer className="w-6 h-6" />
              <span className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => toast.info("Review coming soon!")}>
              <Flag className="w-5 h-5 mr-2" /> Flag
            </Button>
            <Button size="lg" onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8">
              <div className="flex justify-between items-start mb-8">
                <span className="text-sm text-emerald-400 font-medium">Question {currentQ + 1} of {mockQuestions.length}</span>
                <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">{q.subject}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-10 leading-relaxed">{q.question}</h3>

              <RadioGroup onValueChange={handleAnswer} value={answers[currentQ]?.toString()}>
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center space-x-4 p-5 rounded-xl border border-white/20 hover:border-emerald-500/50 hover:bg-white/5 cursor-pointer transition-all mb-4">
                    <RadioGroupItem value={i.toString()} />
                    <span className="text-lg">{opt}</span>
                  </label>
                ))}
              </RadioGroup>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <h3 className="text-xl font-bold mb-4">Question Palette</h3>
              <div className="grid grid-cols-6 gap-3">
                {mockQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-12 h-12 rounded-lg font-medium transition-all ${
                      i === currentQ
                        ? "bg-emerald-500 text-white scale-110"
                        : answers[i] !== undefined
                        ? "bg-green-500/30 text-green-300 border border-green-500"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                size="lg"
                variant="outline"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ(currentQ - 1)}
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </Button>
              <Button
                size="lg"
                disabled={currentQ === mockQuestions.length - 1}
                onClick={() => setCurrentQ(currentQ + 1)}
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}