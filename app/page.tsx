'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import { Product } from "@/types/types";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user } = useUser();

  useEffect(() => {
    async function fetchProducts() {
      // ✅ UPPDATERAD: Hämta produkter MED storlekar
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_sizes(*) , product_images(*)`)
        .limit(8);

      if (error) console.error(error);
      else setProducts(data as Product[]);
    }

    async function fetchFavorites() {
      if (!user) return;
      try {
        const res = await fetch("/api/favoriter");
        const json = await res.json();
        if (res.ok && json.products) {
          setFavorites(json.products.map((item: any) => item.id));
        }
      } catch (error) {
        console.error("Kunde inte hämta favoriter:", error);
      }
    }

    fetchProducts();
    fetchFavorites();
  }, [user]);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* 🔹 Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-6 sm:px-8 bg-gradient-to-r from-white via-blue-100 to-blue-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-md rounded-b-3xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Välkommen till <span className="text-blue-600">ChiqueButik</span> ✨
        </h1>
        <p className="text-lg sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
          Upptäck våra fantastiska klänningar – elegans, färg och stil i varje detalj 💃
        </p>
        <Link
          href="/produkter"
          className="px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Se Produkter
        </Link>
      </section>

      {/* 🔹 Populära Produkter */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Populära Klänningar 👗
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(Number(product.id))}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-700 dark:text-gray-300">
              Laddar produkter...
            </p>
          )}
        </div>
      </section>

      {/* 🔹 Kontakt/Info Sektion */}
      <section className="py-16 bg-gradient-to-r from-white via-pink-50 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-center rounded-t-3xl shadow-inner">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Behöver du hjälp att hitta rätt klänning?
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Kontakta oss för personlig service och stylingtips som matchar din smak.
        </p>
        <Link
          href="/kontakt"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Kontakta Oss
        </Link>
      </section>
    </main>
  );
}