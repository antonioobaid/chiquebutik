'use client';

import { useState, useEffect } from "react";
import { Product } from "@/types/types";
import Link from "next/link";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Hämta alla produkter från Supabase eller API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/produkter");
        const data: Product[] = await res.json();
        console.log("Hämtade produkter:", data);

        setProducts(data);
        // ✅ använd includes istället för ===
        setFilteredProducts(
          data.filter(p => p.category.toLowerCase().includes("klänning"))
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  // Filtrera produkter efter sökord
  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.category.toLowerCase().includes("klänning") &&
          (p.title.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery))
      )
    );
  }, [query, products]);

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sök klänningar</h1>
      
      <input
        type="text"
        placeholder="Sök efter klänning..."
        className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filteredProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              href={`/produkter/${product.id}`}
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-64 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-gray-700">{product.price} SEK</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Inga klänningar matchar din sökning.</p>
      )}
    </div>
  );
}
