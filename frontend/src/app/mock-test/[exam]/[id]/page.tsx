"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MockTestPage() {
  const router = useRouter();
  const [mock, setMock] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentMock");
    const startTime = localStorage.getItem("mockStartTime");

    if (!saved || !startTime) {
      toast.error("No active test found!");
      router.push("/mock-test");
      return;
    }

    const mockData = JSON.parse(saved);
    setMock(mockData);

    const totalSeconds = (mockData.duration || 180) * 60;
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    const remaining = Math.max(0, totalSeconds - elapsed);
    setTimeLeft(remaining);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleFinalSubmit = () => {
    if (isFinished) return;
    setIsFinished(true);

    let correct = 0;
    mock.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const totalQ = mock.questions.length;
    const wrong = Object.keys(answers).length - correct;
    const marks = correct * 4 - wrong * 1;

    const result = {
      mockId: mock.id || "unknown",
      mockTitle: mock.title || "JEE Mock Test",
      marks,
      correct,
      wrong,
      unattempted: totalQ - Object.keys(answers).length,
      percentage: ((correct / totalQ) * 100).toFixed(2),
      timeTaken: (mock.duration * 60) - timeLeft,
      total: totalQ,
    };

    localStorage.setItem("lastMockResult", JSON.stringify(result));
    localStorage.removeItem("currentMock");
    localStorage.removeItem("mockStartTime");

    toast.success("Test Submitted Successfully! 🔥", { duration: 2000 });
    setTimeout(() => router.push("/mock-test/result"), 2000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (!mock) return null;

  const q = mock.questions[currentQuestion];
  const isLastQuestion = currentQuestion === mock.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-cyan-400">
              {mock.title}
            </h1>
            <p className="text-gray-300 mt-1">
              Question {currentQuestion + 1} of {mock.questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Time Left</p>
            <p className="text-5xl font-mono font-bold text-red-500 animate-pulse">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <div className="p-10 md:p-16">

            {/* Question */}
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-12 leading-relaxed">
              Q{currentQuestion + 1}. {q.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {q.options.map((opt: string, i: number) => (
                <Button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQuestion]: i })}
                  variant={answers[currentQuestion] === i ? "default" : "outline"}
                  className={`h-28 text-left text-xl font-medium transition-all ${
                    answers[currentQuestion] === i
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 border-2 border-cyan-300 shadow-xl"
                      : "border-2 border-white/30 hover:border-cyan-400 hover:bg-white/10"
                  }`}
                >
                  <span className="font-bold text-2xl mr-5">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </Button>
              ))}
            </div>

            {/* VERTICAL BUTTONS BELOW QUESTION — ALL ON RIGHT SIDE */}
            <div className="flex justify-end">
              <div className="space-y-6 w-80">
                {/* Previous Button */}
                {currentQuestion > 0 && (
                  <Button
                    onClick={() => setCurrentQuestion(c => c - 1)}
                    size="lg"
                    variant="outline"
                    className="w-full py-7 text-xl font-bold border-2"
                  >
                    <ChevronLeft className="w-6 h-6 mr-3" />
                    Previous Question
                  </Button>
                )}

                {/* Next Button */}
                {!isLastQuestion && (
                  <Button
                    onClick={() => setCurrentQuestion(c => c + 1)}
                    size="lg"
                    className="w-full py-7 text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-xl"
                  >
                    Next Question
                    <ChevronRight className="w-6 h-6 ml-3" />
                  </Button>
                )}

                {/* Submit Button */}
                {isLastQuestion && (
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isFinished}
                    size="lg"
                    className="w-full py-10 text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <Send className="w-8 h-8 mr-4" />
                    {isFinished ? "Submitting Test..." : "FINAL SUBMIT TEST"}
                  </Button>
                )}
              </div>
            </div>

            {/* Question Palette - Bottom */}
            <div className="mt-20 pt-10 border-t border-white/20">
              <p className="text-center text-gray-400 mb-6 text-lg font-semibold">Question Palette</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {mock.questions.map((_: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer transition-all shadow-lg ${
                      i === currentQuestion
                        ? "bg-yellow-500 text-black scale-125"
                        : answers[i] !== undefined
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}