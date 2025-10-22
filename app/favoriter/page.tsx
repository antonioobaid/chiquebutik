'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Product } from "@/types/types";
import { useCart } from "@/components/CartContext"; // ✅ Lägg till denna rad
import { useRouter } from "next/navigation"; // ✅ för att kunna navigera

export default function FavoriterPage() {
  const { user } = useUser();
  const { addToCart } = useCart(); // ✅ hämta funktionen från context
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favoriter");
        const json = await res.json();

        if (!res.ok) {
          console.error("API error:", json.error);
          setLoading(false);
          return;
        }

        setProducts(json.products || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user?.id]);

  // 🛒 Lägg till produkt i varukorgen
  async function handleAddToCart(productId: number) {
    try {
      await addToCart(productId);
      router.push("/varukorg"); // ✅ Gå till varukorg efter att lägga till
    } catch (error: any) {
      if (error?.status === 401) {
        alert("Du måste logga in för att lägga till produkter i varukorgen.");
        router.push("/"); // ✅ Gå till hem om inte inloggad
      } else {
        console.error(error);
      }
    }
  }

  if (!user) return <p className="text-center mt-10">Du måste logga in för att se dina favoriter.</p>;
  if (loading) return <p className="text-center mt-10">Laddar favoriter...</p>;
  if (products.length === 0) return <p className="text-center mt-10">Du har inga favoriter än.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col">
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-64 object-cover rounded-lg" 
          />
          <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{product.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{product.price} kr</p>
          
          {/* 🟦 Knapp till varukorgen */}
          <button
            onClick={() => handleAddToCart(product.id)}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition"
          >
            Lägg till i varukorgen
          </button>
        </div>
      ))}
    </div>
  );
}
