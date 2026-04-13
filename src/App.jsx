import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Package, CheckCircle, Trash2, LogOut, Settings } from 'lucide-react';
import Login from './Login';
import Admin from './Admin'; // INI DIA IMPORT ADMIN YANG BARU

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // STATE BARU: Untuk mengatur halaman yang sedang dibuka ('kasir' atau 'admin')
  const [view, setView] = useState('kasir');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  useEffect(() => { 
    if (token) fetchProducts(); 
  }, [token]);

  const addToCart = (product) => {
    setCart((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    try {
      const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
      await axios.post('http://localhost:5000/api/transactions', { items });
      alert("Pembayaran Berhasil! Stok telah diperbarui.");
      setCart([]);
      fetchProducts();
    } catch (error) {
      alert("Gagal Transaksi");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCart([]);
    setView('kasir'); // Kembalikan ke tampilan awal saat logout
  };

  const totalHarga = cart.reduce((sum, item) => sum + (item.harga_jual * item.quantity), 0);

  // KUNCI APLIKASI
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // SAKLAR HALAMAN: Jika state view adalah 'admin', tampilkan halaman Admin
  if (view === 'admin') {
    return <Admin setView={setView} />;
  }

  // Jika state view adalah 'kasir', tampilkan aplikasi kasir utama
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Kasir */}
        <header className="flex justify-between items-center mb-10 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-400 flex items-center gap-3">
              <ShoppingCart size={32} /> Sembako-Track
            </h1>
            <p className="text-slate-400">Sistem Management Kasir & Inventori</p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border border-blue-800 font-medium">
              {products.length} Produk
            </span>
            
            {/* TOMBOL BARU: Untuk pindah ke halaman Admin */}
            <button 
              onClick={() => setView('admin')}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full border border-slate-600 transition-colors"
              title="Kelola Produk"
            >
              <Settings size={18} /> Mode Admin
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-900/50 hover:bg-red-600 text-red-300 hover:text-white px-4 py-2 rounded-full border border-red-800 transition-colors"
              title="Keluar dari sistem"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Kolom Produk & Keranjang */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Kolom Produk */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300">
              <Package size={22} className="text-blue-400" /> Etalase Barang
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all group shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{p.nama}</h3>
                      <p className="text-2xl font-black text-white mt-1">Rp {p.harga_jual.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${p.stok > 10 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      Stok: {p.stok}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(p)}
                    disabled={p.stok === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    {p.stok === 0 ? 'Stok Habis' : 'Tambah Ke Keranjang'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Keranjang */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                <ShoppingCart size={22} className="text-blue-400" /> Daftar Pesanan
              </h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart size={32} className="text-slate-500" />
                  </div>
                  <p className="text-slate-500">Keranjang masih kosong</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8 max-h-[350px] overflow-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-700/20 p-3 rounded-xl border border-slate-700/50">
                        <div>
                          <p className="font-bold text-slate-200">{item.nama}</p>
                          <p className="text-sm text-slate-400">{item.quantity} x Rp {item.harga_jual.toLocaleString()}</p>
                        </div>
                        <p className="font-bold text-blue-400">Rp {(item.harga_jual * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-slate-700 pt-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Total Harga</span>
                      <span className="text-3xl font-black text-white">Rp {totalHarga.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-black py-4 rounded-xl shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle size={24} /> SELESAIKAN BAYAR
                  </button>
                  <button 
                    onClick={() => setCart([])}
                    className="w-full mt-4 text-slate-500 text-sm hover:text-red-400 transition-colors flex items-center justify-center gap-1 font-medium"
                  >
                    <Trash2 size={16} /> Bersihkan Keranjang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;