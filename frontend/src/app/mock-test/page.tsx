"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MockTestListPage() {
  const router = useRouter();
  const [mocks, setMocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user profile to detect target exam
  const profile =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("profile") || "{}")
      : {};

  const targetExam = (profile.target_exam || "jee").toLowerCase();

  useEffect(() => {
    loadMocks();
  }, []);

  async function loadMocks() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/mockexam/list?exam=${targetExam}`
      );

      const data = await res.json();
      setMocks(data.mocks || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Available Mock Tests
      </h1>

      {loading ? (
        <p className="text-center text-gray-300">Loading mocks...</p>
      ) : mocks.length === 0 ? (
        <p className="text-center text-gray-400">
          No mock tests available for your target exam.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {mocks.map((mock) => (
            <Card
              key={mock.id}
              className="p-6 bg-white/10 backdrop-blur-xl border border-white/20"
            >
              <h2 className="text-2xl font-semibold">{mock.name}</h2>

              <div className="mt-4 flex gap-4">
                <Button
                  className="bg-emerald-600"
                  onClick={() =>
                    router.push(`/mock-test/${targetExam}/${mock.id}`)
                  }
                >
                  Start Test
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/mock-test/preview/${mock.id}?exam=${targetExam}`)
                  }
                >
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
