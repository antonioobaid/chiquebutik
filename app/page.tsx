/*'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import { Product } from "@/types/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(6);

      if (error) {
        console.error(error);
      } else if (data) {
        setProducts(data as Product[]);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-b-3xl shadow-lg">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 drop-shadow-md">
          Välkommen till <span className="text-blue-500">ChiqueButik</span>!
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
          Upptäck våra fantastiska klänningar för alla tillfällen – elegans och stil i varje detalj.
        </p>
        <Link
          href="/produkter"
          className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Se Produkter
        </Link>
      </section>


      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Populära Klänningar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition p-4"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-700 dark:text-gray-300">
              Laddar produkter...
            </p>
          )}
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-12 text-center shadow-inner">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Vill du ha hjälp att välja rätt klänning?
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Kontakta oss gärna för personlig service och stylingtips.
        </p>
        <Link
          href="/kontakt"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Kontakta Oss
        </Link>
      </section>
    </div>
  );
}*/


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
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(6);

      if (error) {
        console.error(error);
      } else if (data) {
        setProducts(data as Product[]);
      }
    }

    async function fetchFavorites() {
      if (!user) return; // bara hämta om användaren är inloggad

      try {
        const res = await fetch("/api/favoriter");
        const json = await res.json();

        if (res.ok && json.products) {
          const favoriteIds = json.products.map((item: any) => item.id);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("Kunde inte hämta favoriter:", error);
      }
    }

    fetchProducts();
    fetchFavorites();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-b-3xl shadow-lg">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 drop-shadow-md">
          Välkommen till <span className="text-blue-500">ChiqueButik</span>!
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
          Upptäck våra fantastiska klänningar för alla tillfällen – elegans och stil i varje detalj.
        </p>
        <Link
          href="/produkter"
          className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Se Produkter
        </Link>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Populära Klänningar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition p-4"
              >
                <ProductCard 
                  product={product} 
                 isFavorite={favorites.includes(Number(product.id))}
                />
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-700 dark:text-gray-300">
              Laddar produkter...
            </p>
          )}
        </div>
      </section>

      {/* Optional Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-12 text-center shadow-inner">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Vill du ha hjälp att välja rätt klänning?
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Kontakta oss gärna för personlig service och stylingtips.
        </p>
        <Link
          href="/kontakt"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Kontakta Oss
        </Link>
      </section>
    </div>
  );
}

