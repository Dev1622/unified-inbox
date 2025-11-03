'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/inbox');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center text-slate-800">Welcome Back</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-sky-600 text-black py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition"

        >
          Login
        </button>

        <div className="space-y-2 pt-4">
          <button className="w-full flex items-center justify-center gap-2 border text-blue-800 rounded-md py-2 text-sm hover:bg-slate-50 transition">
            <span>🔵</span> Facebook
          </button>
          <button className="w-full flex items-center justify-center gap-2 border text-blue-800 rounded-md py-2 text-sm hover:bg-slate-50 transition">
            <span>🟥</span> Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 border text-blue-800 rounded-md py-2 text-sm hover:bg-slate-50 transition">
            <span>🐦</span> Twitter
          </button>
        </div>

        <p className="text-xs text-center text-slate-500">
          © {new Date().getFullYear()} Unified Inbox
        </p>
      </div>
    </div>
  );
}
