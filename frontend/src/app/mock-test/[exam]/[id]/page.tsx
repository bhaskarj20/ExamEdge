"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function RunMockPage({ params }: any) {
  const { id } = params;
  const search = useSearchParams();
  const exam = search.get("exam") || "jee";

  const [mock, setMock] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  useEffect(() => {
    loadMock();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && mock && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  async function loadMock() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/mockexam/load/${exam}/${id}`
      );

      const data = await res.json();
      setMock(data.mock);
      setTimeLeft((data.mock.duration || 180) * 60);
    } catch (err) {
      toast.error("Failed to load mock");
    }
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!mock) return;

    let score = 0;

    mock.questions.forEach((q: any) => {
      const ans = answers[q.id];
      if (q.type === "mcq") {
        if (ans === q.answer) score += 4;
        else if (ans !== undefined) score -= 1;
      } else {
        if (Number(ans) === Number(q.answer)) score += 4;
        else if (ans !== undefined) score -= 1;
      }
    });

    setSubmitted(true);

    // save to backend
    const res = await fetch("http://localhost:5000/api/mock-history/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        mock_name: mock.name,
        score,
        total_marks: mock.questions.length * 4
      })
    });

    const data = await res.json();
    if (!res.ok) toast.error("Save failed");
    else toast.success("Result saved!");
  };

  if (!mock)
    return (
      <p className="text-center text-white mt-20">Loading mock test...</p>
    );

  if (submitted)
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-4xl font-bold mb-6">{mock.name}</h1>
        <p className="text-3xl">Your answers submitted!</p>
        <Button onClick={() => (window.location.href = "/mock-test")}>
          Back to Tests
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen text-white p-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{mock.name}</h1>

        <div className="flex justify-between mb-4">
          <span>Time Left: {formatTime(timeLeft)}</span>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>

        {mock.questions.map((q: any) => (
          <Card
            key={q.id}
            className="p-6 my-4 bg-white/10 text-white border border-white/20"
          >
            <h2 className="text-xl font-semibold">{q.id}. {q.question}</h2>

            {q.type === "mcq" ? (
              <div className="mt-4 space-y-2">
                {q.options.map((opt: string, idx: number) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      onChange={() =>
                        setAnswers({ ...answers, [q.id]: idx })
                      }
                      checked={answers[q.id] === idx}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="number"
                className="mt-4 bg-black/40 p-2 border rounded"
                placeholder="Enter integer answer"
                onChange={(e) =>
                  setAnswers({ ...answers, [q.id]: e.target.value })
                }
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

