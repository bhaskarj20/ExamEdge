// frontend/src/app/dashboard/page.tsx   ← REPLACE ENTIRE FILE WITH THIS
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Brain, Target, Trophy, Timer, Flame, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const features = [
    {
      title: "Create My Own Mock",
      desc: "Custom PYQs • Difficulty • Weak Topics",
      icon: Brain,
      color: "from-emerald-500 to-teal-600",
      href: "/mock-test",
    },
    {
      title: "AI Doubt Solver",
      desc: "Ask anything 24×7 • Step-by-step • Hindi + English",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      href: "/ai-doubt-solver",
    },
    {
      title: "Daily Target",
      desc: "Personalized study plan • Track progress",
      icon: Target,
      color: "from-orange-500 to-red-600",
      href: "/daily-plan",
    },
    {
      title: "Leaderboards",
      desc: "Compete with India’s top rankers",
      icon: Trophy,
      color: "from-yellow-500 to-amber-600",
      href: "/leaderboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            ExamEdge
          </h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-16 px-6">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Choose Your Weapon
        </h2>
        <p className="text-xl text-gray-300">Rank 1 is waiting for you</p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
        {features.map((item, i) => (
          <Card
            key={i}
            onClick={() => router.push(item.href)}
            className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/20 hover:border-emerald-500/50 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
            <div className="p-8 text-center relative z-10">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} p-5 shadow-xl`}>
                <item.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Card>
        ))}
      </div>

      {/* Streak & Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-around items-center text-center">
          <div>
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">7</p>
            <p className="text-sm text-gray-400">Day Streak</p>
          </div>
          <div>
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-gray-400">Accuracy</p>
          </div>
          <div>
            <Timer className="w-8 h-8 text-cyan-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">48h</p>
            <p className="text-sm text-gray-400">This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}