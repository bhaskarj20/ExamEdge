'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  LogOut, Brain, Target, Trophy, Flame, Sparkles,
  BookOpen, User, CheckCircle, Edit3, Save, X, FileText
} from "lucide-react";

import { toast } from "sonner";
import { StickyNote } from "lucide-react";

import { Calendar } from "lucide-react";


// ------------------------------------
// USER TYPE
// ------------------------------------
type UserType = {
  name: string;
  email: string;
  phone?: string | null;
  exam: string;
  target_year: string;
};

// ------------------------------------
// DASHBOARD COMPONENT
// ------------------------------------
export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    targetExam: '',
    targetYear: ''
  });

  // ------------------------------------
  // LOAD USER
  // ------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed: UserType = JSON.parse(stored);
    setUser(parsed);

    setEditForm({
      name: parsed.name,
      phone: parsed.phone || "",
      targetExam: parsed.exam,
      targetYear: parsed.target_year
    });
  }, [router]);

  // ------------------------------------
  // LOGOUT
  // ------------------------------------
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // ------------------------------------
  // SAVE PROFILE
  // ------------------------------------
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone || null,
          exam: editForm.targetExam,
          target_year: editForm.targetYear
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const updatedUser: UserType = {
          ...user,
          ...data.user
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated!");

        setIsEditing(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ------------------------------------
  // FEATURE CARDS
  // ------------------------------------
  const features = [
    { title: "Create My Own Mock", icon: Brain, color: "from-emerald-500 to-teal-600", href: "/mock-test" },
    { title: "AI Doubt Solver", icon: Sparkles, color: "from-purple-500 to-pink-600", href: "/ai-doubt-solver" },
    { title: "Daily Target", icon: Target, color: "from-orange-500 to-red-600", href: "/daily-plan" },
    {title: "Short Notes",   icon: StickyNote,  color: "from-orange-500 to-red-600",  href: "/short-notes" },
    { title: "Free NCERT Books", icon: BookOpen, color: "from-cyan-500 to-blue-600", href: "/ncert" },
    { title: "Question Bank", icon: FileText, color: "from-indigo-500 to-blue-700", href: "/question-bank" },
  ];

  const streak = 7, totalMocks = 24, accuracy = 78.5;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative">

      {/* HEADER */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/40 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ExamEdge
          </h1>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowProfile(true)}
              variant="outline"
              className="border-white/20 bg-white/10 hover:bg-white/20"
            >
              <User className="w-5 h-5 mr-2" /> Profile
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="text-center py-12 px-6">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Welcome back, {user.name.split(" ")[0]}!
        </h2>
        <p className="text-xl text-gray-300">Your Rank 1 journey continues</p>
      </div>

      {/* FEATURE CARDS */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
        {features.map((item, i) => (
          <Card
            key={i}
            onClick={() => router.push(item.href)}
            className="group relative overflow-hidden bg-gradient-to-br
              from-white/5 to-white/10 backdrop-blur-xl border-white/20 
              hover:border-emerald-500/50 cursor-pointer transition-all 
              duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color}
                opacity-0 group-hover:opacity-20 transition-opacity`}
            />

            <div className="p-8 text-center relative z-10">
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br 
                  ${item.color} p-5 shadow-xl`}
              >
                <item.icon className="w-full h-full text-white" />
              </div>

              <h3 className="text-xl font-bold">{item.title}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-around text-center">

          <div>
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-sm text-gray-400">Streak</p>
          </div>

          <div>
            <CheckCircle className="w-8 h-8 text-cyan-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{totalMocks}</p>
            <p className="text-sm text-gray-400">Mocks</p>
          </div>

          <div>
            <Target className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{accuracy}%</p>
            <p className="text-sm text-gray-400">Accuracy</p>
          </div>

        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div
          onClick={() => setShowProfile(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-10 max-w-2xl w-full relative"
          >
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-4xl font-bold text-cyan-300">My Profile</h3>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500"
                >
                  <Edit3 className="w-5 h-5 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    <Save className="w-5 h-5 mr-2" /> Save
                  </Button>

                  <Button
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    variant="outline"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* AVATAR LETTER */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-6xl font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* PROFILE FIELDS */}
            <div className="space-y-6">

              {/* NAME */}
              <div>
                <Label className="text-gray-400">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="mt-2 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-2xl font-bold text-white mt-2">
                    {user.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Label className="text-gray-400">Email (cannot change)</Label>
                <p className="text-xl text-gray-300 mt-2">{user.email}</p>
              </div>

              {/* PHONE */}
              <div>
                <Label className="text-gray-400">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    placeholder="9876543210"
                    className="mt-2 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-xl text-white mt-2">
                    {user.phone ? `+91 ${user.phone}` : "Not added"}
                  </p>
                )}
              </div>

              {/* TARGET EXAM */}
              <div>
                <Label className="text-gray-400">Target Exam</Label>
                {isEditing ? (
                  <select
                    value={editForm.targetExam}
                    onChange={(e) =>
                      setEditForm({ ...editForm, targetExam: e.target.value })
                    }
                    className="mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  >
                    <option value="JEE" className="bg-gray-900 text-white">JEE Main + Advanced</option>
                    <option value="NEET" className="bg-gray-900 text-white">NEET</option>
                    <option value="WBJEE" className="bg-gray-900 text-white">WBJEE</option>
                    <option value="BITSAT" className="bg-gray-900 text-white">BITSAT</option>
                    
                  </select>
                ) : (
                  <p className="text-2xl font-bold text-cyan-300 mt-2">
                    {user.exam}
                  </p>
                )}
              </div>

              {/* TARGET YEAR */}
              <div>
                <Label className="text-gray-400">Target Year</Label>
                {isEditing ? (
                  <select
                    value={editForm.targetYear}
                    onChange={(e) =>
                      setEditForm({ ...editForm, targetYear: e.target.value })
                    }
                    className="mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                ) : (
                  <p className="text-3xl font-bold text-emerald-400 mt-2">
                    {user.target_year}
                  </p>
                )}
              </div>

            </div>

            {/* STATS */}
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-6 border border-orange-500/30">
                <Flame className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">{streak}</p>
                <p className="text-gray-400">Day Streak</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-500/30">
                <CheckCircle className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">{totalMocks}</p>
                <p className="text-gray-400">Mocks</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl p-6 border border-emerald-500/30">
                <Target className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">{accuracy}%</p>
                <p className="text-gray-400">Accuracy</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
