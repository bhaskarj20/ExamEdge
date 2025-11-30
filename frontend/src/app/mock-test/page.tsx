"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MockTestListPage() {
  const router = useRouter();
  const [mocks, setMocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      
      if (data.success && data.mocks?.length > 0) {
        setMocks(data.mocks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-5xl text-cyan-400 font-black animate-pulse">LOADING</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* Ultra Minimal Header */}
        <h1 className="text-center text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-20 tracking-tighter">
          MOCK
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mocks.map((mock) => (
            <Card
              key={mock.id}
              className="bg-gradient-to-br from-zinc-950 to-black border border-zinc-800 p-16 hover:border-cyan-500 transition-all duration-500 hover:scale-105 cursor-pointer group rounded-3xl"
              onClick={() => router.push(`/mock-test/jee/${mock.id}/preview`)}
            >
              <div className="text-center">
                {/* Just "MOCK" — nothing else */}
                <h2 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-12">
                  MOCK
                </h2>

                {/* Only Duration + Questions */}
                <div className="space-y-8 text-zinc-300 text-2xl font-light">
                  <p className="text-4xl font-bold text-white">
                    {mock.duration_minutes || mock.duration || 180} MIN
                  </p>
                  <p className="text-3xl font-medium">
                    {mock.questions?.length || 90} Qs
                  </p>
                </div>

                {/* Clean Start Button */}
                <Button className="w-full mt-16 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-3xl font-black py-10 rounded-none shadow-2xl">
                  START
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {mocks.length === 0 && (
          <div className="text-center py-40">
            <p className="text-5xl text-zinc-700 font-black">COMING SOON</p>
          </div>
        )}
      </div>
    </div>
  );
}