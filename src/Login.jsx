import { useState } from 'react';
import axios from 'axios';
import { Store, Lock, User, ArrowRight, UserPlus } from 'lucide-react';

export default function Login({ setToken }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // GANTI SESUAI ROUTE BACKEND KAMU (Misal: /api/auth/register atau /api/users/register)
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const url = `https://sembako-track-backend-production.up.railway.app${endpoint}`;

    try {
      const response = await axios.post(url, { username, password });
      
      if (isRegister) {
        alert("Akun berhasil didaftarkan! Silakan Login.");
        setIsRegister(false); // Balik ke mode login
        setPassword('');
      } else {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
      }
    } catch (error) {
      alert(isRegister ? "Gagal mendaftar. Username mungkin sudah ada." : "Login gagal! Cek username dan password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-blue-500/30">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-2xl shadow-black/50 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <Store size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            {isRegister ? 'Daftar Akun' : 'Kasir Berkah Sembako'}
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            {isRegister ? 'Buat akun admin pertama kamu' : 'Silakan login untuk mengakses kasir'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 mt-2"
          >
            {loading ? 'Memproses...' : (isRegister ? <><UserPlus size={18}/> Buat Akun</> : <><ArrowRight size={18}/> Masuk</>)}
          </button>
        </form>
          {/* Memberi komentar pada bagian toggle register di bawah ini */}
        {/*<div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            {isRegister ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Daftar sekarang'}
          </button>
        </div>*/}
      </div>
    </div>
  );
}