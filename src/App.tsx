import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Github, Instagram, Twitter, ChevronRight, Star, Heart, ArrowRight, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartProvider, useCart } from "./hooks/useCart";
import { Product } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

// --- Components ---

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-black transition-transform group-hover:scale-110 shadow-sm">WM</div>
          <span className="text-xl font-black tracking-tight text-slate-900">WARUNG<span className="text-rose-600">MADURA</span></span>
        </Link>
        <div className="relative hidden lg:block w-96">
          <input 
            type="text" 
            placeholder="Cari beras, telur, bensin..." 
            className="w-full bg-slate-100 border-none rounded-md py-2 px-4 text-sm focus:ring-2 focus:ring-rose-500 transition-all outline-none"
          />
          <div className="absolute right-3 top-2.5 text-slate-400 text-[10px] font-mono select-none">/</div>
        </div>
      </div>
      <div className="flex items-center gap-6 text-slate-600">
        <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-rose-600 transition-all group">
          <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded uppercase">Buka 24 Jam</span>
        </div>
        <Link to="/cart" className="relative cursor-pointer hover:text-rose-600 transition-all group p-1">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function ProductCard({ product }: { product: Product, key?: string }) {
  const { addToCart } = useCart();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="aspect-square bg-slate-100 rounded-lg mb-3 relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">New</span>
          {product.stock < 10 && (
            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">Low Stock</span>
          )}
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg text-slate-600 hover:text-indigo-600 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      
      <div className="px-1">
        <p className="text-[10px] text-indigo-600 font-bold mb-0.5 uppercase tracking-wider">{product.category}</p>
        <h3 className="text-xs font-bold text-slate-800 leading-tight mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-black text-slate-900">{formatPrice(product.price)}</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} />)}
          </div>
          <span className="text-[9px] text-slate-400 font-medium">4.9 | 2k Sold</span>
        </div>
      </div>
    </motion.div>
  );
}

function Sidebar() {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(setCategories);
  }, []);

  return (
    <aside className="w-64 hidden xl:flex flex-col bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 p-4 flex-shrink-0">
      <div className="mb-8">
        <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-4 px-2">Katalog Warung</h3>
        <ul className="space-y-1">
          <li className="text-sm px-3 py-2 bg-rose-50 text-rose-700 rounded-md font-bold flex items-center gap-3 cursor-pointer">
            <Menu size={16} />
            <span>Semua Produk</span>
          </li>
          {categories.map(cat => (
            <li key={cat} className="text-sm px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md flex items-center gap-3 cursor-pointer transition-colors">
              <ChevronRight size={14} className="text-slate-300" />
              <span>{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-4 px-2">Info Cepat</h3>
        <div className="space-y-2">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-500 font-medium mb-1">Status Toko</p>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BUKA 24 JAM
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-500 font-medium mb-1">Total Item</p>
            <p className="text-sm font-bold text-slate-900">1,248 Macam</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-rose-600 rounded-xl p-4 text-white">
          <p className="text-[10px] opacity-70 mb-1 font-bold uppercase tracking-wider">Layanan Khusus</p>
          <p className="text-xs font-bold leading-tight">Antar Galon & Gas Ke Rumah (Radius 1KM)</p>
          <button className="w-full mt-3 bg-white text-rose-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition-all">
            Pesan Via WA
          </button>
        </div>
      </div>
    </aside>
  );
}

// --- Pages ---

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(setProducts);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Banner */}
      <section className="p-6">
        <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-900 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center flex items-center px-12">
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="relative z-10 max-w-sm">
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-4 inline-block uppercase tracking-widest">Siap Antar 24 Jam</span>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight uppercase">Stok <span className="text-rose-500">Sembako</span> <br /> Melimpah</h1>
            <p className="text-slate-300 text-sm mb-6 font-medium">Lengkap, Murah, dan Terpercaya. Dari bensin eceran sampai beras pulen.</p>
            <Link to="/products" className="inline-block bg-white text-slate-900 px-6 py-2.5 rounded-lg text-sm font-black hover:bg-rose-600 hover:text-white transition-all transform hover:scale-105">
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="p-6 pt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Kebutuhan Hari Ini</h2>
          <div className="flex items-center gap-4 text-[11px] font-bold text-rose-600 uppercase tracking-widest">
            <Link to="/products" className="hover:underline">Lihat Semua</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/products" + (activeCategory !== "All" ? `?category=${activeCategory}` : ""))
      .then(res => res.json())
      .then(setProducts);
    
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(["All", ...data]));
  }, [activeCategory]);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Eksplor Produk</h1>
        <div className="flex flex-wrap gap-2 mt-4 text-[10px] font-bold uppercase tracking-widest">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-md transition-all border",
                activeCategory === cat 
                  ? "bg-slate-900 text-white border-transparent shadow-sm" 
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50">
        <ShoppingBag size={64} className="text-slate-200 mb-6" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Keranjangmu masih kosong</h2>
        <p className="text-slate-500 text-sm mb-8">Butuh sembako? Mari belanja!</p>
        <Link to="/products" className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:bg-slate-900">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Ringkasan Belanja</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">{item.name}</h3>
                <p className="text-xs font-black text-rose-600 mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-slate-200 text-slate-600">-</button>
                  <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-slate-200 text-slate-600">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Rincian Pembayaran</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Subtotal</span>
                <span className="text-slate-900">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="text-emerald-500 font-bold uppercase text-[10px]">Gratis</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                <span className="text-sm font-bold text-slate-900">Total Harga</span>
                <span className="text-2xl font-black text-rose-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                clearCart();
                alert("Pesanan berhasil dibuat! Silakan tunggu kurir kami.");
                navigate("/");
              }}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:bg-rose-600 transition-all hover:scale-[1.02]"
            >
              Bayar Sekarang
            </button>
            <p className="text-[9px] text-center text-slate-400 mt-4 font-medium uppercase tracking-[0.1em]">Transaksi Aman & Terpercaya</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusFooter() {
  return (
    <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0">
      <div className="flex gap-4">
        <span className="font-medium tracking-tight">v2.1.0 Madura-Edition</span>
        <span className="hidden sm:inline">Engine: Warung Core v7</span>
      </div>
      <div className="flex gap-4 items-center uppercase font-bold tracking-widest text-[9px]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span> 
          Layanan: Aktif (24 Jam)
        </span>
        <span className="hidden sm:inline">© 2024 Warung Madura Group</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </AnimatePresence>
            </main>
            {/* Activity Feed Sidebar (Optional Right Sidebar) */}
            <aside className="w-72 hidden 2xl:flex flex-col bg-white border-l border-slate-200 p-6 flex-shrink-0">
               <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-6">Recent Activity</h3>
               <div className="space-y-6">
                 <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 text-lg">✓</div>
                   <div>
                     <p className="text-xs font-bold text-slate-800">Pesanan Sampai</p>
                     <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Beras Cianjur 5kg sudah diterima di alamat tujuan.</p>
                     <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase">2 Jam Lalu</p>
                   </div>
                 </div>
                 <div className="flex gap-3 text-slate-400">
                   <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-lg">★</div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 line-through">Menunggu Ulasan</p>
                     <p className="text-[10px] leading-tight mt-0.5">Bagikan pendapatmu tentang Kopi Kapal Api.</p>
                   </div>
                 </div>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Support Center</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-bold text-slate-700">ONLINE</span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold hover:bg-white hover:border-indigo-500 transition-all">
                    Start Live Chat
                  </button>
               </div>
            </aside>
          </div>
          <StatusFooter />
        </div>
      </CartProvider>
    </Router>
  );
}
