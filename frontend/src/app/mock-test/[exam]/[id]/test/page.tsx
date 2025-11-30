"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MockTestPage() {
  const [mock, setMock] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("currentMock");
    const startTime = localStorage.getItem("mockStartTime");
    
    if (!saved || !startTime) {
      router.push("/mock-test/jee");
      return;
    }

    const mockData = JSON.parse(saved);
    setMock(mockData);

    const duration = (mockData.duration || 180) * 60 * 1000;
    const elapsed = Date.now() - parseInt(startTime);
    const remaining = duration - elapsed;

    if (remaining <= 0) {
      handleSubmit();
      return;
    }

    setTimeLeft(Math.floor(remaining / 1000));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    localStorage.removeItem("currentMock");
    localStorage.removeItem("mockStartTime");
    router.push("/mock-test/result");
  };

  if (!mock) {
    return <div>Loading test...</div>;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const question = mock.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{mock.title}</h1>
          <div className="text-3xl font-mono text-red-500">
            {formatTime(timeLeft)}
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur p-8">
          <p className="text-2xl mb-8">Q{currentQuestion + 1}. {question.question}</p>

          <div className="space-y-4">
            {question.options.map((opt: string, i: number) => (
              <Button
                key={i}
                variant={answers[currentQuestion] === i ? "default" : "outline"}
                className="w-full text-left text-lg py-6"
                onClick={() => {
                  setAnswers(prev => ({ ...prev, [currentQuestion]: i }));
                }}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </Button>
            ))}
          </div>

          <div className="flex justify-between mt-12">
            <Button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === mock.questions.length - 1 ? (
              <Button onClick={handleSubmit} className="bg-red-600">
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(mock.questions.length - 1, prev + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}