'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Product } from "@/types/types";

export default function FavoriterPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchFavorites() {
      try {
        // Hämta favoriter via server-side API (nu med produktinfo)
        const res = await fetch("/api/favoriter");
        const json = await res.json();

        if (!res.ok) {
          console.error("API error:", json.error);
          setLoading(false);
          return;
        }

        // json.products innehåller redan full info om produkterna
        setProducts(json.products || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user?.id]);

  if (!user) return <p className="text-center mt-10">Du måste logga in för att se dina favoriter.</p>;
  if (loading) return <p className="text-center mt-10">Laddar favoriter...</p>;
  if (products.length === 0) return <p className="text-center mt-10">Du har inga favoriter än.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-64 object-cover rounded-lg" 
          />
          <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{product.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{product.price} kr</p>
        </div>
      ))}
    </div>
  );
}
