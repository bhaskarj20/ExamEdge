'use client';
import Link from 'next/link';
import { Download, BookOpen, ArrowLeft } from 'lucide-react';

const ncertBooks = {
  "Class 11": [
    { name: "Physics Part 1", file: "/ncert/class-11/Physics_Part_1.pdf" },
    { name: "Physics Part 2", file: "/ncert/class-11/Physics_Part_2.pdf" },
    { name: "Chemistry Part 1", file: "/ncert/class-11/Chemistry_Part_1.pdf" },
    { name: "Chemistry Part 2", file: "/ncert/class-11/Chemistry_Part_2.pdf" },
    { name: "Mathematics", file: "/ncert/class-11/Mathematics.pdf" },
    { name: "Biology", file: "/ncert/class-11/Biology.pdf" },
  ],
  "Class 12": [
    { name: "Physics Part 1", file: "/ncert/class-12/Physics_Part_1.pdf" },
    { name: "Physics Part 2", file: "/ncert/class-12/Physics_Part_2.pdf" },
    { name: "Chemistry Part 1", file: "/ncert/class-12/Chemistry_Part_1.pdf" },
    { name: "Chemistry Part 2", file: "/ncert/class-12/Chemistry_Part_2.pdf" },
    { name: "Mathematics Part 1", file: "/ncert/class-12/Mathematics_Part_1.pdf" },
    { name: "Mathematics Part 2", file: "/ncert/class-12/Mathematics_Part_2.pdf" },
    { name: "Biology", file: "/ncert/class-12/Biology.pdf" },
  ]
};

export default function NCERTPage() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />
      
      <div className="relative min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-cyan-300 mb-4">
              NCERT Books
            </h1>
            <p className="text-cyan-100 text-xl md:text-2xl">
              Free Download • Latest Edition • JEE & NEET Ready
            </p>
          </div>

          {/* Back to Dashboard */}
          <Link href="/dashboard" className="fixed top-8 left-8 text-cyan-300 hover:text-white flex items-center gap-2 text-lg font-bold z-50">
            <ArrowLeft /> Back to Dashboard
          </Link>

          {/* Books Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {Object.entries(ncertBooks).map(([className, books]) => (
              <div key={className} className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">
                  {className}
                </h2>
                <div className="space-y-4">
                  {books.map((book) => (
                    <a
                      key={book.name}
                      href={book.file}
                      target="_blank"
                      download
                      className="flex items-center justify-between gap-4 p-6 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-10 h-10 text-cyan-400" />
                        <div>
                          <p className="text-white font-semibold text-lg">{book.name}</p>
                          <p className="text-cyan-200 text-sm">Click to download</p>
                        </div>
                      </div>
                      <Download className="w-8 h-8 text-cyan-400 group-hover:scale-125 transition" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}