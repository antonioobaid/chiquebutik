'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Product, ProductSize, ProductImage } from "@/types/types";
import { useCart } from "@/components/CartContext";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);
  const [allSizes, setAllSizes] = useState<ProductSize[]>([]);
  const [isProductSoldOut, setIsProductSoldOut] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState<ProductImage[]>([]);

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_sizes(*),
          product_images(*)
        `)
        .eq("id", id)
        .single();

      if (error) console.error("Fel vid hämtning av produkt:", error);
      else {
        const productData = data as Product;
        setProduct(productData);

        const allProductSizes = productData.product_sizes || [];
        setAllSizes(allProductSizes);

        const inStockSizes = allProductSizes.filter((size: ProductSize) => size.in_stock);
        setAvailableSizes(inStockSizes);

        setIsProductSoldOut(allProductSizes.length > 0 && inStockSizes.length === 0);

        if (inStockSizes.length > 0) {
          setSelectedSize(inStockSizes[0].size);
        }

        const productImages = productData.product_images || [];
        if (productImages.length > 0) {
          const sortedImages = productImages.sort(
            (a: ProductImage, b: ProductImage) => a.image_order - b.image_order
          );
          setImages(sortedImages);
        } else {
          setImages([{
            id: 0,
            product_id: productData.id,
            image_url: productData.image_url,
            image_order: 0,
            created_at: new Date().toISOString()
          }]);
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
    } catch (error: unknown) {
      if (error && typeof error === "object" && "status" in error && error.status === 401) {
        alert("Du måste logga in för att lägga till produkter i varukorgen.");
        router.push("/");
      } else {
        console.error(error);
        alert("Ett fel uppstod när produkten skulle läggas till.");
      }
    }
  }

  const nextImage = () => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Laddar produkt...
      </div>
    );
  }

  const currentImage = images[selectedImageIndex]?.image_url || product.image_url;

  return (
    <div className="flex justify-center py-32 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[calc(100vh-96px)]">
      <div className="max-w-6xl w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10 relative">

        {isProductSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl z-20 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center transform rotate-2 max-w-xs mx-4">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">😔</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Slut i lager</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">Denna produkt är tyvärr tillfälligt slut</p>
              <button 
                onClick={() => router.push('/produkter')}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition w-full"
              >
                Se andra produkter
              </button>
            </div>
          </div>
        )}

        {/* Bildsektion */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={currentImage}
                alt={product.title}
                width={800}
                height={800}
                className={`w-full h-full object-cover transition-transform ${
                  isProductSoldOut ? 'grayscale opacity-70' : 'hover:scale-105'
                }`}
                 priority={selectedImageIndex === 0}
              />
            </motion.div>

            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all z-10">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={nextImage} className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all z-10">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-black/50 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm backdrop-blur-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

            {isProductSoldOut && (
              <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-red-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                SÅLD
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-pink-500 ring-2 ring-pink-200' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    priority={selectedImageIndex === 0}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informationssektion */}
        <div className="flex flex-col">
          <div className="flex-grow space-y-4 md:space-y-6">
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold ${isProductSoldOut ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {product.title}
            </h1>
            <p className={`text-sm md:text-base ${isProductSoldOut ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {product.description}
            </p>
            <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${isProductSoldOut ? 'text-gray-400 line-through' : 'text-blue-500'}`}>
              {product.price} kr
            </p>
            
            <div className="space-y-1">
              <p className={`text-xs md:text-sm ${isProductSoldOut ? 'text-gray-400' : 'text-gray-500'}`}>
                Kategori: {product.category}
              </p>
              <p className={`text-xs md:text-sm ${isProductSoldOut ? 'text-gray-400' : 'text-gray-500'}`}>
                Färg: {product.color}
              </p>
            </div>

            {!isProductSoldOut && allSizes.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Välj storlek:
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => size.in_stock && setSelectedSize(size.size)}
                      disabled={!size.in_stock}
                      className={`px-3 py-2 text-xs md:text-sm border-2 rounded-lg transition-all min-w-[50px] ${
                        selectedSize === size.size
                          ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                          : size.in_stock
                          ? 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through dark:bg-gray-800'
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

          {/* Knappsektion */}
          <div className="mt-6 md:mt-8">
            {isProductSoldOut ? (
              <button 
                disabled
                className="w-full px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl shadow-md cursor-not-allowed text-sm md:text-base"
              >
                Slut i lager
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                disabled={availableSizes.length > 0 && !selectedSize}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Lägg i varukorg
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}