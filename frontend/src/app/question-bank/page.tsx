'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

type UserType = {
  name: string;
  email: string;
  phone?: string;
  exam: string;
  target_year: string;
};

export default function QuestionBank() {
  const [user, setUser] = useState<UserType | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
    if (u) loadYears(u.exam);
  }, []);

  useEffect(() => {
    if (user && year) loadFiles(user.exam, year);
  }, [year]);

  const loadYears = async (exam: string) => {
    const res = await fetch(`/api/list-pdfs?folder=question-papers/${exam}`);
    const data = await res.json();
    setYears(data.years || []);
    if (data.years.length > 0) setYear(data.years[0]);
  };

  const loadFiles = async (exam: string, year: string) => {
    const res = await fetch(`/api/list-pdfs-year?folder=question-papers/${exam}/${year}`);
    const data = await res.json();
    setFiles(data.files || []);
  };

  if (!user) return null;

  return (
    <>
      {/* Background like login page */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />

      {/* Main wrapper */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl">

          {/* Glass Panel */}
          <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-10">

            {/* Title */}
            <h1 className="text-center text-5xl font-extrabold text-cyan-200 mb-10">
              {user.exam} Question Bank
            </h1>

            {/* Year buttons */}
            <div className="flex justify-center mb-10">
              <div className="flex flex-wrap justify-center gap-4">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-6 py-2.5 rounded-xl text-lg transition-all duration-200
                      ${year === y
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                      }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* SINGLE CENTERED CARD */}
            <div className="flex flex-col items-center mt-6">
              {files.length > 0 ? (
                files.map((file, idx) => {
                  const pdfPath = `/question-papers/${user.exam}/${year}/${file}`;

                  return (
                    <Card
                      key={idx}
                      className="w-full max-w-md p-8 bg-white/10 border border-white/20 
                                 backdrop-blur-xl rounded-2xl shadow-lg text-center"
                    >
                      <h3 className="text-2xl font-bold text-cyan-200 mb-6">
                        {file.replace(".pdf", "")}
                      </h3>

                      <div className="flex justify-center gap-4">
                        <Button
                          className="bg-blue-600 hover:bg-blue-500"
                          onClick={() => window.open(pdfPath, "_blank")}
                        >
                          <Eye className="w-5 h-5 mr-2" /> View
                        </Button>

                        <Button
                          className="bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = pdfPath;
                            a.download = file;
                            a.click();
                          }}
                        >
                          <Download className="w-5 h-5 mr-2" /> Download
                        </Button>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <p className="text-white/70 text-lg mt-6">
                  No papers found for this year.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
