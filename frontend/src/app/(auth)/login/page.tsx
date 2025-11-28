'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // your login logic
  };

  return (
    <>
      {/* Full Deep Blue Background — Covers 100% of screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />
      
      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Huge Glass Card — Super Responsive */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="backdrop-blur-3xl bg-white/8 border border-white/10 rounded-3xl shadow-2xl p-10 sm:p-12 md:p-16">
            
            {/* Logo & Tagline */}
            <div className="text-center mb-12">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-cyan-300 drop-shadow-2xl">
                ExamEdge
              </h1>
              <p className="text-cyan-100 text-lg sm:text-xl md:text-2xl mt-4 font-medium tracking-wide">
                India's #1 JEE • NEET Platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full px-8 py-6 text-lg sm:text-xl rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl"
              />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full px-8 py-6 text-lg sm:text-xl rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-7 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center mt-12 text-cyan-100 text-lg sm:text-xl">
              New here?{' '}
              <Link href="/register" className="font-bold text-white underline decoration-2 underline-offset-4 hover:text-cyan-300">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}