"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MockTestListPage() {
  const router = useRouter();
  const [mocks, setMocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("profile") || "{}") : {};
  const targetExam = (profile.target_exam || "jee").toLowerCase();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://examedge-7o44.onrender.com";

  useEffect(() => {
    loadMocks();
  }, []);

  async function loadMocks() {
    try {
      const res = await fetch(`${API_URL}/api/mockexam/available`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      
      if (data.success && data.mocks?.length > 0) {
        setMocks(data.mocks);
      } else {
        toast.info("More mocks dropping soon! Stay ready 🔥");
      }
    } catch (err) {
      console.error("Load mocks error:", err);
      toast.error("Failed to load mocks");
    } finally {
      setLoading(false);
    }
  }

  // EXTRACT CLEAN MOCK NUMBER (Mock 1, Mock 2, Mock 3...)
  const getMockNumber = (mock: any) => {
    const id = mock.id || "";
    const numFromId = id.replace(/[^0-9]/g, "");
    if (numFromId) return numFromId;

    const numFromTitle = mock.title?.match(/\d+/)?.[0] || mock.paper_name?.match(/\d+/)?.[0];
    return numFromTitle || "1";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-3xl text-cyan-400 font-bold animate-pulse">Loading Mocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Epic Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl md:text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 drop-shadow-2xl">
            MOCK TESTS
          </h1>
          <p className="text-3xl mt-6 text-gray-300 font-bold">
            {targetExam.toUpperCase()} • Full Syllabus • Real Exam Pattern
          </p>
        </div>

        {mocks.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl text-gray-400 mb-8">No mocks available yet</p>
            <p className="text-2xl text-cyan-300">High-quality mocks dropping daily! Stay locked in 🔥</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mocks.map((mock) => (
              <Card
                key={mock.id}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 rounded-3xl group cursor-pointer"
              >
                {/* Clean Mock Title */}
                <div className="text-center mb-8">
                  <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    Mock {getMockNumber(mock)}
                  </h2>
                  <p className="text-gray-400 mt-4 text-lg font-medium">Full Syllabus • 99.9+ Percentile Level</p>
                </div>

                {/* Stats */}
                <div className="space-y-6 text-center text-gray-200 mb-10">
                  <p className="text-2xl">⏱ {mock.duration_minutes || mock.duration || 180} minutes</p>
                  <p className="text-2xl">❓ {mock.questions?.length || 90} questions</p>
                  <p className="text-2xl">✦ {mock.questions?.length * 4 || 360} max marks</p>
                </div>

                {/* Start Button */}
                <Button
                  onClick={() => router.push(`/mock-test/${targetExam}/${mock.id}/preview`)}
                  className="w-full bg-gradient-to-r from-emerald-500 via-cyan-600 to-blue-700 hover:from-emerald-400 hover:via-cyan-500 hover:to-blue-600 text-2xl font-bold py-10 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300"
                >
                  START MOCK NOW
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}