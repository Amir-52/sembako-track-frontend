import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, Package, CheckCircle, Trash2, 
  LogOut, Settings, Printer, Store, CreditCard,
  ChevronRight, Box
} from 'lucide-react';
import Login from './Login';
import Admin from './Admin'; 

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('kasir');
  const [receiptData, setReceiptData] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://sembako-track-backend-production.up.railway.app/api/products');
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
      await axios.post('https://sembako-track-backend-production.up.railway.app/api/transactions', { items });
      
      setReceiptData({
        items: [...cart],
        total: totalHarga,
        tanggal: new Date().toLocaleString('id-ID', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })
      });

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
    setView('kasir'); 
  };

  const totalHarga = cart.reduce((sum, item) => sum + (item.harga_jual * item.quantity), 0);

  if (!token) return <Login setToken={setToken} />;
  if (view === 'admin') return <Admin setView={setView} />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className={`max-w-7xl mx-auto transition-all duration-500 ${receiptData ? 'blur-md scale-[0.98] pointer-events-none' : ''}`}>
        
        {/* Header Dashboard */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl shadow-blue-500/5">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <Store size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SEMBAKO-TRACK
              </h1>
              <p className="text-slate-500 text-sm font-medium">Professional POS System v2.1</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setView('admin')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl border border-white/5 transition-all active:scale-95"
            >
              <Settings size={18} /> <span className="text-sm font-bold">Admin</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-xl border border-red-500/20 transition-all active:scale-95"
            >
              <LogOut size={18} /> <span className="text-sm font-bold">Logout</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content: Etalase */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Box size={20} className="text-blue-500" /> Etalase Produk
              </h2>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                {products.length} Items Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {products.map((p) => (
                <div key={p.id} className="group relative bg-slate-800/30 backdrop-blur-sm p-6 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[70%]">
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-blue-400 transition-colors truncate">{p.nama}</h3>
                      <p className="text-2xl font-black text-white mt-1">
                        <span className="text-sm font-medium text-slate-500 mr-1 text-[10px]">IDR</span>
                        {p.harga_jual.toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.stok > 10 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                      Stok: {p.stok}
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(p)}
                    disabled={p.stok === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {p.stok === 0 ? 'Stok Habis' : <><ShoppingCart size={18}/> Tambah</>}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Cart */}
          <div className="lg:col-span-4">
            <div className="bg-slate-800/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 sticky top-8 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={22} className="text-blue-500" /> Pesanan
                </h2>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="space-y-4 mb-8 min-h-[100px] max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    <ShoppingCart size={48} className="mx-auto mb-3" />
                    <p className="text-sm font-medium">Belum ada pesanan</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 text-sm">{item.nama}</span>
                        <span className="text-[11px] text-slate-500 font-bold">{item.quantity} x {item.harga_jual.toLocaleString()}</span>
                      </div>
                      <span className="font-black text-blue-400">{(item.harga_jual * item.quantity).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mb-6">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest">Total Bayar</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-white leading-none tracking-tighter">
                    <span className="text-sm text-blue-500 mr-1 uppercase">Rp</span>
                    {totalHarga.toLocaleString()}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 text-slate-900 font-black py-4 rounded-2xl shadow-xl shadow-green-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CreditCard size={20} /> CHECKOUT SEKARANG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STRUK PREMIUM */}
      {receiptData && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] print:shadow-none relative">
            
            {/* Dekorasi Struk */}
            <div className="bg-blue-600 p-8 text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <CheckCircle size={32} />
              </div>
              <h2 className="font-black text-xl tracking-tighter">TRANSAKSI BERHASIL</h2>
              <p className="text-blue-100 text-xs mt-1 opacity-80">{receiptData.tanggal}</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {receiptData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600">{item.nama} <span className="text-slate-400 ml-1">x{item.quantity}</span></span>
                    <span className="font-bold">{(item.harga_jual * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-dashed border-slate-200 my-6"></div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Total Tagihan</span>
                <span className="font-black text-2xl tracking-tighter">Rp {receiptData.total.toLocaleString()}</span>
              </div>
              
              <div className="flex gap-3 print:hidden">
                <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                  <Printer size={18} /> Cetak
                </button>
                <button onClick={() => setReceiptData(null)} className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
                  Tutup
                </button>
              </div>
            </div>

            {/* Efek Gerigi Kertas Bawah */}
            <div className="flex justify-between px-2 absolute bottom-[-5px] left-0 w-full opacity-10">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-slate-900 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;