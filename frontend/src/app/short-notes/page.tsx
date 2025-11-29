"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FolderOpen } from "lucide-react";

export default function ShortNotesPage() {
  const subjects = ["physics", "chemistry", "maths"];
  const [subject, setSubject] = useState("physics");
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    loadFiles(subject);
  }, [subject]);

  const loadFiles = async (sub: string) => {
    const res = await fetch(`/api/list-zip?folder=short-notes/${sub}`);
    const data = await res.json();
    setFiles(data.files || []);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-10">
      
      <div className="w-full max-w-2xl mx-auto text-white flex flex-col items-center">

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent text-center drop-shadow-lg">
          Short Notes
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 mb-10 text-center max-w-lg">
          Download quick ZIP revision notes for Physics, Chemistry, and Maths.
        </p>

        {/* Subject Selector */}
        <div className="flex gap-3 mb-10 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-xl shadow-lg">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={`px-5 py-2 rounded-xl capitalize text-lg transition-all ${
                subject === sub
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Notes List (Centered Column) */}
        <div className="w-full flex flex-col items-center gap-6">

          {files.map((file, i) => {
            const zipPath = `/short-notes/${subject}/${file}`;

            return (
              <Card
                key={i}
                className="w-full p-6 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl 
                           hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-orange-300 text-center mb-6 truncate">
                  {file.replace(".zip", "")}
                </h3>

                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
                    onClick={() => window.open(zipPath, "_blank")}
                  >
                    <FolderOpen className="w-5 h-5 mr-2" />
                    View
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = zipPath;
                      link.download = file;
                      link.click();
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            );
          })}

          {files.length === 0 && (
            <p className="text-gray-400 text-lg text-center mt-4">
              No short notes available for <span className="text-orange-400">{subject}</span>.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
