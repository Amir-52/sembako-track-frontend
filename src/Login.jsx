import { useState } from 'react';
import axios from 'axios';
import { Lock, User } from 'lucide-react';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      
      // Simpan token ke memori browser
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token); // Beritahu App.jsx kalau kita sudah login
    } catch (err) {
      setError(err.response?.data?.message || 'Login Gagal!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-400 mb-2">Sembako-Track</h1>
          <p className="text-slate-400">Silakan login untuk mengakses kasir</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            Masuk Sistem
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;