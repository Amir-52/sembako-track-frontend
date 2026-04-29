import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react';

function Admin({ setView }) {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    harga_jual: '',
    stok: ''
  });

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData({ nama: '', harga_jual: '', stok: '' });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setFormData({ nama: product.nama, harga_jual: product.harga_jual, stok: product.stok });
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (editingId) {
        await axios.patch(`${API_URL}/api/products/${editingId}`, formData);
        alert("Produk berhasil diupdate!");
      } else {
        await axios.post(`${API_URL}/api/products`, formData);
        alert("Produk baru berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {
      alert("Gagal menyimpan produk!");
      console.error(error);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus ${nama} dari etalase?`)) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.delete(`${API_URL}/api/products/${id}`);
        fetchProducts(); 
      } catch (error) {
        alert("Gagal menghapus produk!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('kasir')}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              title="Kembali ke Kasir"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-blue-400 flex items-center gap-2">
              <Package size={28} /> Kelola Produk (Admin)
            </h1>
          </div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> Tambah Barang
          </button>
        </header>

        {isFormOpen && (
          <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 mb-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-400">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2">Nama Barang</label>
                <input 
                  type="text" name="nama" required value={formData.nama} onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                  placeholder="Misal: Indomie Goreng" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2">Harga Jual (Rp)</label>
                <input 
                  type="number" name="harga_jual" required value={formData.harga_jual} onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                  placeholder="Misal: 3000" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2">Stok Awal</label>
                <input 
                  type="number" name="stok" required value={formData.stok} onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
                  placeholder="Misal: 40" 
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95">
                  <Save size={20} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-300 text-sm uppercase tracking-wider border-b border-slate-700">
                  <th className="p-4 font-bold">ID</th>
                  <th className="p-4 font-bold">Nama Barang</th>
                  <th className="p-4 font-bold">Harga Jual</th>
                  <th className="p-4 font-bold">Sisa Stok</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {products.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="p-4 text-slate-400">{index + 1}</td>
                    <td className="p-4 font-bold text-white">{p.nama}</td>
                    <td className="p-4 text-blue-400 font-medium">Rp {p.harga_jual.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${p.stok > 10 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {p.stok} Pcs
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => openEditForm(p)} className="p-2 bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.nama)} className="p-2 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;