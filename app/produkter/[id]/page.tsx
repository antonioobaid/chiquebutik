'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient"
import { Product, ProductSize } from "@/types/types";
import { useCart } from "@/components/CartContext";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);
  const [allSizes, setAllSizes] = useState<ProductSize[]>([]);
  const [isProductSoldOut, setIsProductSoldOut] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_sizes(*)
        `)
        .eq("id", id)
        .single();

      if (error) console.error("Fel vid hämtning av produkt:", error);
      else {
        setProduct(data as Product);
        
        const allProductSizes = data.product_sizes || [];
        setAllSizes(allProductSizes);
        
        // ✅ Filtrera endast storlekar som är i lager
        const inStockSizes = allProductSizes.filter((size: ProductSize) => size.in_stock) || [];
        setAvailableSizes(inStockSizes);
        
        // ✅ Kolla om hela produkten är slut
        const allSizesOutOfStock = allProductSizes.length > 0 && inStockSizes.length === 0;
        setIsProductSoldOut(allSizesOutOfStock);
        
        // ✅ Auto-välj första tillgängliga storlek
        if (inStockSizes.length > 0) {
          setSelectedSize(inStockSizes[0].size);
        }
      }
    }

    fetchProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!product || isProductSoldOut) return;

    if (availableSizes.length > 0 && !selectedSize) {
      alert("Vänligen välj en storlek");
      return;
    }

    try {
      await addToCart(product.id, selectedSize);
      router.push("/varukorg");
    } catch (error: any) {
      if (error?.status === 401) {
        alert("Du måste logga in för att lägga till produkter i varukorgen.");
        router.push("/");
      } else {
        console.error(error);
        alert("Ett fel uppstod när produkten skulle läggas till.");
      }
    }
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Laddar produkt...
      </div>
    );
  }

  return (
    <div className="flex justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[calc(100vh-96px)]">
      <div className="max-w-6xl w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 relative">
        
        {/* ✅ SOLD OUT OVERLAY - Modern styling */}
        {isProductSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center transform rotate-2">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Slut i lager</h3>
              <p className="text-gray-600 dark:text-gray-300">Denna produkt är tyvärr tillfälligt slut</p>
              <button 
                onClick={() => router.push('/produkter')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                Se andra produkter
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center relative">
          <img
            src={product.image_url}
            alt={product.title}
            className={`w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg transition-transform hover:scale-105 ${
              isProductSoldOut ? 'grayscale opacity-70' : ''
            }`}
          />
          {isProductSoldOut && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              SÅLD
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${
              isProductSoldOut ? 'text-gray-500' : 'text-gray-900 dark:text-white'
            }`}>
              {product.title}
            </h1>
            <p className={`mb-6 ${isProductSoldOut ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {product.description}
            </p>
            <p className={`text-2xl font-bold mb-4 ${
              isProductSoldOut ? 'text-gray-400 line-through' : 'text-blue-500'
            }`}>
              {product.price} kr
            </p>
            <p className={`text-sm mb-1 ${isProductSoldOut ? 'text-gray-400' : 'text-gray-500'}`}>
              Kategori: {product.category}
            </p>
            <p className={`text-sm mb-4 ${isProductSoldOut ? 'text-gray-400' : 'text-gray-500'}`}>
              Färg: {product.color}
            </p>

            {/* ✅ Storleksväljare - Dölj om produkten är helt slut */}
            {!isProductSoldOut && allSizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Välj storlek:
                </label>
                <div className="flex flex-wrap gap-3">
                  {allSizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => size.in_stock && setSelectedSize(size.size)}
                      disabled={!size.in_stock}
                      className={`px-4 py-2 text-sm border-2 rounded-lg transition-all ${
                        selectedSize === size.size
                          ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                          : size.in_stock
                          ? 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                      }`}
                    >
                      {size.size}
                      {!size.in_stock && ' (Slut)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ✅ Knapp - Visa "Slut i lager" om produkten är helt slut */}
          {isProductSoldOut ? (
            <button 
              disabled
              className="mt-4 w-full md:w-auto px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl shadow-md cursor-not-allowed"
            >
              Slut i lager
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              disabled={availableSizes.length > 0 && !selectedSize}
              className="mt-4 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
            >
              Lägg i varukorg
            </button>
          )}
        </div>
      </div>
    </div>
  );
}