'use client'

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Product } from "@/types/types";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function FavoriterPage() {
  const { user } = useUser();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favoriter");
        const json = await res.json();
        setProducts(json.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user?.id]);

  async function handleAddToCart(productId: number) {
    try {
      await addToCart(productId);
      router.push("/varukorg");
    } catch (error: any) {
      if (error?.status === 401) {
        alert("Du måste logga in för att lägga till produkter i varukorgen.");
        router.push("/");
      } else {
        console.error(error);
      }
    }
  }

  if (!user) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Du måste logga in för att se dina favoriter.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Laddar favoriter...</p>;
  if (products.length === 0) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Du har inga favoriter än.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-12">
      
      {/* 🔹 Titel */}
      <section className="text-center mb-12 py-12 px-6 rounded-3xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-md">
          Mina <span className="text-blue-600">Favoriter</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl">
          Här hittar du alla produkter du har sparat som favoriter. Spara det du gillar mest!
        </p>
      </section>

      {/* 🔹 Produktlista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-105 flex flex-col p-4">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-72 object-cover rounded-xl mb-4"
            />
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{product.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{product.price} kr</p>

            <button
              onClick={() => handleAddToCart(product.id)}
              className="mt-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              Lägg till i varukorgen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
