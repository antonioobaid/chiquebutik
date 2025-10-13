'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient"
import { Product } from "@/types/types";
import { useCart } from "@/components/CartContext";



export default function ProductDetail() {
  const params = useParams(); // ✅ du måste anropa useParams()
  const id = params?.id;      // ✅ hämta id från URL
  const [product, setProduct] = useState<Product | null>(null);

  const {addToCart} = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single(); // ✅ hämta bara en produkt

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
    addToCart(product)
    router.push("/varukorg") // Navigera till varukorg-sidan
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {product.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-pink-600 mb-4">
            {product.price} kr
          </p>
          <p className="text-sm text-gray-500 mb-2">Kategori: {product.category}</p>
          <p className="text-sm text-gray-500 mb-4">Färg: {product.color} | Storlek: {product.size}</p>
          <button 
          onClick={handleAddToCart}
          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
            Lägg i varukorg
          </button>
        </div>
      </div>
    </div>
  );
}

