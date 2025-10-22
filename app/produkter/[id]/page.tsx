'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient"
import { Product } from "@/types/types";
import { useCart } from "@/components/CartContext";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fel vid hämtning av produkt:", error);
      } else {
        setProduct(data as Product);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Laddar produkt...
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart(product.id);
    router.push("/varukorg");
  }

  return (
    <div className="flex justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-96px)]">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
              {product.title}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>
            <p className="text-2xl font-bold text-blue-500 dark:bg-blue-400 mb-4">
              {product.price} kr
            </p>
            <p className="text-sm text-gray-500 mb-1">Kategori: {product.category}</p>
            <p className="text-sm text-gray-500 mb-6">Färg: {product.color} | Storlek: {product.size}</p>
          </div>
          <button 
            onClick={handleAddToCart}
            className="mt-4 w-full md:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all hover:scale-105"
          >
            Lägg i varukorg
          </button>
        </div>
      </div>
    </div>
  );
}
