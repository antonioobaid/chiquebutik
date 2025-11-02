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
        .select(`*, product_sizes(*), product_images(*)`)
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
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* 🔹 Modern Hero Section med mindre höjd */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Bakgrundsbild med gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 backdrop-blur-[2px]"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4 border border-white/30">
              ✨ Premium Klänningar
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Upptäck Din
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Drömklänning
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            Exklusiva designerklänningar som kombinerar tidlös elegans med modern design
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/produkter"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Se Kollektion
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-4 border-2 border-white/80 text-white font-semibold rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Om Oss
            </Link>
          </div>
        </div>

        {/* Modern scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Varför Välja Oss Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Varför Välja Våra Klänningar?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Vi kombinerar svensk kvalitet med internationell design för att skapa klänningar som gör dig unik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Premium Kvalitet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Varje klänning är skräddarsydd med högsta kvalitetsmaterial och noggrann hantverk för en perfekt finish
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">👗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Unika Designer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Exklusiva designer som fångar uppmärksamhet och skapar oförglömliga stunder för varje tillfälle
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">📏</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Perfekt Passform
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tillgängliga i flera storlekar för att garantera perfekt passform oavsett kroppstyp och stil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Utvalda Klänningar Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Våra Utvalda Klänningar
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Handplockade designerklänningar som definierar elegans och sofistikering
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(Number(product.id))}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-2xl text-white">👗</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Laddar vackra klänningar...</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/produkter"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Se Alla Klänningar
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 Modern CTA Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-gray-700/50 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Redo att Förvandla Din Klädsel?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Anslut dig till tusentals nöjda kunder som hittat sin drömklänning hos oss
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/produkter"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Handla Nu
              </Link>
              <Link
                href="/kontakt"
                className="px-8 py-4 border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                Få Stilrådgivning
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}