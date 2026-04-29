import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { nanoid } from "nanoid";

// Mock Database
const products = [
  {
    id: "1",
    name: "Bensin Eceran (1L)",
    description: "Pertamax murni, bening tanpa oplosan. Siap gas 24 jam.",
    price: 13500,
    category: "Bahan Bakar",
    image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=800&auto=format&fit=crop",
    stock: 50,
  },
  {
    id: "2",
    name: "Indomie Goreng (DUS)",
    description: "Satu dus isi 40 bungkus. Stok aman buat akhir bulan.",
    price: 115000,
    category: "Sembako",
    image: "https://images.unsplash.com/photo-1612927330536-8369917986ee?q=80&w=800&auto=format&fit=crop",
    stock: 20,
  },
  {
    id: "3",
    name: "Kopi Hitam Kapal Api",
    description: "Kopi legendaris buat ronda tengah malam.",
    price: 2500,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "4",
    name: "Beras Cianjur (5kg)",
    description: "Beras pulen pilihan masyarakat pulau Jawa.",
    price: 75000,
    category: "Sembako",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
    stock: 15,
  },
  {
    id: "5",
    name: "Telur Ayam Negeri (1kg)",
    description: "Telur segar, dikirim langsung dari peternakan.",
    price: 28000,
    category: "Sembako",
    image: "https://images.unsplash.com/photo-1582722872445-44c59ebc41dd?q=80&w=800&auto=format&fit=crop",
    stock: 30,
  },
  {
    id: "6",
    name: "Rokok Sampoerna Mild",
    description: "Stok lengkap, pita cukai terbaru 2024.",
    price: 35000,
    category: "Lain-lain",
    image: "https://images.unsplash.com/photo-1563283189-6d55734898f8?q=80&w=800&auto=format&fit=crop",
    stock: 45,
  },
];

const categories = ["Bahan Bakar", "Sembako", "Minuman", "Lain-lain"];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const { category } = req.query;
    if (category) {
      return res.json(products.filter(p => p.category === category));
    }
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  app.post("/api/orders", (req, res) => {
    const { items, total, customer } = req.body;
    // In a real app, we'd save this to a DB
    const orderId = nanoid(10);
    console.log("Order received:", { orderId, items, total, customer });
    res.status(201).json({ success: true, orderId });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
