'use client';

import { useEffect, useState } from "react";
import { BookOpen, Download, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

type UserType = {
  name: string;
  email: string;
  exam: "JEE" | "NEET" | "BITSAT" | "VITEEE";
};

interface Paper {
  name: string;
  id: string;
}

const QUESTION_PAPERS: Record<string, Record<string, Paper[]>> = {
  JEE: {
    "JEE 2025": [
      { name: "JEE Main January Shift 1", id: "1iatw8r2pZuLNal3oL7zZQE1UkLIvms1M" },
      { name: "JEE Main April Shift 2",   id: "1hnuOSCHV4zvnGfplrRi2rM3HUyiGWQln" },
      { name: "JEE Main April Shift 1",   id: "1iFa0cAmfU0pgcM8tck164FVauRCgpiml" },
    ]
  },
  NEET: {
    "2025": [{ name: "NEET 2025 Full Paper", id: "1zXQwmgY19tLgsnxfy8N-HDXL9pVglWUJ" }],
    "2024": [{ name: "NEET 2024 Paper",       id: "1cOYWnvYcjDJepX1Lr4Ll1RZifrTbye1U" }],
    "2023": [{ name: "NEET 2023 Paper",       id: "1DAsQQc2UgcsXXX0vxutGPUS4KTxyXvB4" }],
    "2022": [{ name: "NEET 2022 Paper",       id: "1yVpcvW7zfqlZKh8JV-iA8himicBP1wLs" }],
    "2021": [{ name: "NEET 2021 Paper",       id: "1yg1WAQbKo0EmzBrOEAmz5XmiwO3nccEI" }],
  },
  BITSAT: {
    "2024": [{ name: "BITSAT 2024 Paper", id: "1LDOBIU8WgN_dEFoDCNcntJqRSEw8810A" }],
    "2023": [{ name: "BITSAT 2023 Paper", id: "1GpPnT43NkPpoIIFEgrQq8pBw0bUFc4H0" }],
    "2022": [{ name: "BITSAT 2022 Paper", id: "1bck8T7zeCxF4CGZgNRZglNmzb6jtmEqw" }],
    "2021": [{ name: "BITSAT 2021 Paper", id: "19e91iJMN2uBl25jsBls5gb79YHvzHV6W" }],
    "2020": [{ name: "BITSAT 2020 Paper", id: "1I8OqxK4RBE4n368oXsoGxb8ujpZ4lJ-J" }],
  },
  VITEEE: {
    "2025": [{ name: "VITEEE 2025 Paper", id: "1zOOzBf2SoeJuAb9ArFLm8okyUIhY4OZd" }],
    "2024": [{ name: "VITEEE 2024 Paper", id: "1C7fxxXSYMYCtkPJsm39lou7FaqzlrqLb" }],
    "2023": [{ name: "VITEEE 2023 Paper", id: "1KPsmvN1nCgTJMWRDg_0k2z3pMNXTB-9_" }],
    "2022": [{ name: "VITEEE 2022 Paper", id: "1o2mbW18Cqws9uWwitrf0dO9lW2WNZ1dp" }],
    "2021": [{ name: "VITEEE 2021 Paper", id: "1igaRXMZikHcVPRg2-1ix5oi87KDaNNxE" }],
  }
};

export default function QuestionBank() {
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u?.exam) {
      setUser(u);
      const years = Object.keys(QUESTION_PAPERS[u.exam] || {});
      setSelectedYear(years[0] || "");
    }
  }, []);

  if (!user) return null;

  const papers = QUESTION_PAPERS[user.exam]?.[selectedYear] || [];

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />
      
      <div className="relative min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-cyan-300 mb-4">
              {user.exam} Question Papers
            </h1>
            <p className="text-cyan-100 text-xl md:text-2xl">
              Free Download • Latest Papers • Instant Access
            </p>
          </div>

          {/* Back to Dashboard */}
          <Link href="/dashboard" className="fixed top-8 left-8 text-cyan-300 hover:text-white flex items-center gap-2 text-lg font-bold z-50">
            <ArrowLeft /> Back to Dashboard
          </Link>

          {/* Year Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {Object.keys(QUESTION_PAPERS[user.exam] || {}).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-10 py-5 rounded-2xl text-2xl font-bold transition-all
                  ${selectedYear === year 
                    ? "bg-emerald-500 text-white shadow-2xl scale-110" 
                    : "bg-white/10 text-cyan-200 border border-white/30 hover:bg-white/20"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Single Centered Cards - EXACT SAME AS NCERT PAGE */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              {papers.length > 0 ? (
                <div className="space-y-8">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="backdrop-blur-xl bg-white/10 rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <BookOpen className="w-16 h-16 text-cyan-400" />
                          <div>
                            <h3 className="text-3xl font-bold text-white">
                              {paper.name}
                            </h3>
                            <p className="text-cyan-200 mt-2">Click below to view or download</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => window.open(`https://drive.google.com/file/d/${paper.id}/view`, "_blank")}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg"
                          >
                            <Eye className="w-6 h-6" /> View
                          </button>

                          <button
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = `https://drive.google.com/uc?export=download&id=${paper.id}`;
                              a.download = `ExamEdge_${paper.name.replace(/ /g, '_')}.pdf`;
                              a.click();
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg"
                          >
                            <Download className="w-6 h-6" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-cyan-200 text-3xl font-bold">
                  No papers available for {selectedYear}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-24 text-cyan-200">
            <p className="text-2xl font-bold">
              Made with ❤️ for {user.exam} Warriors
            </p>
          </div>
        </div>
      </div>
    </>
  );
}