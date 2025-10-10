'use client'

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
        .limit(4);

      if (error) {
        console.error(error);
      } else if (data) {
        setProducts(data as Product[]);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Välkommen till ChiqueButik!
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
          Upptäck våra fantastiska klänningar för alla tillfällen – elegans och stil i varje detalj.
        </p>
        <Link
          href="/produkter"
          className="px-8 py-4 bg-pink-600 text-white font-semibold rounded-lg shadow hover:bg-pink-700 transition"
        >
          Se Produkter
        </Link>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Populära Klänningar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-700 dark:text-gray-300">
              Laddar produkter...
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
