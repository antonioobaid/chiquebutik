'use client'

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Product, ProductSize } from "@/types/types";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function FavoriterPage() {
  const { user } = useUser();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({});

  useEffect(() => {
    if (!user?.id) return;

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favoriter");
        const json = await res.json();
        const productsWithSizes = json.products || [];
        
        console.log("📦 Fetched favorites:", productsWithSizes);
        
        // ✅ TRANSFORMERA: Mappa product_sizes till sizes
        const transformedProducts = productsWithSizes.map((product: any) => ({
          ...product,
          sizes: product.product_sizes || [] // Använd product_sizes som sizes
        }));
        
        console.log("🔄 Transformed products:", transformedProducts);
        
        setProducts(transformedProducts);
        
        const initialSizes: {[key: number]: string} = {};
        transformedProducts.forEach((product: Product) => {
          const availableSizes = product.sizes?.filter((size: ProductSize) => size.in_stock) || [];
          if (availableSizes.length > 0) {
            initialSizes[product.id] = availableSizes[0].size;
          }
        });
        setSelectedSizes(initialSizes);
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user?.id]);

  async function handleAddToCart(productId: number) {
    const selectedSize = selectedSizes[productId];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    // ✅ Kolla om produkten är HELT slut
    const allSizes = product.sizes || [];
    const availableSizes = allSizes.filter((size: ProductSize) => size.in_stock);
    const isProductSoldOut = allSizes.length > 0 && availableSizes.length === 0;

    // ✅ Förhindra att lägga till helt slut-produkter
    if (isProductSoldOut) {
      alert("❌ Denna produkt är tyvärr slut i lager för tillfället och kan inte läggas i varukorgen.");
      return;
    }

    // ✅ Kolla om vald storlek finns och är i lager
    if (availableSizes.length > 0) {
      if (!selectedSize) {
        alert("Vänligen välj en storlek först");
        return;
      }
      
      // ✅ Kontrollera att den valda storleken faktiskt är i lager
      const selectedSizeObj = allSizes.find(size => size.size === selectedSize);
      if (!selectedSizeObj || !selectedSizeObj.in_stock) {
        alert("❌ Den valda storleken är tyvärr slut. Välj en annan storlek.");
        return;
      }
    }

    try {
      const success = await addToCart(productId, selectedSize);
      if (success) {
        alert(`✅ ${product.title} har lagts till i varukorgen!`);
        router.push("/varukorg");
      } else {
        alert("Kunde inte lägga till produkten i varukorgen. Produkten kan vara slut i lager.");
      }
    } catch (error: any) {
      console.error(error);
      alert("Ett fel uppstod när produkten skulle läggas till.");
    }
  }

  function handleSizeChange(productId: number, size: string) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // ✅ Kontrollera att storleken är i lager innan den väljs
    const sizeObj = product.sizes?.find(s => s.size === size);
    if (sizeObj && sizeObj.in_stock) {
      setSelectedSizes(prev => ({
        ...prev,
        [productId]: size
      }));
    } else {
      alert("❌ Denna storlek är tyvärr slut. Välj en annan storlek.");
    }
  }

  if (!user) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Du måste logga in för att se dina favoriter.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Laddar favoriter...</p>;
  if (products.length === 0) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Du har inga favoriter än.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-12">
      
      <section className="text-center mb-12 py-12 px-6 rounded-3xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-md">
          Mina <span className="text-blue-600">Favoriter</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl">
          Här hittar du alla produkter du har sparat som favoriter. Spara det du gillar mest!
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const allSizes = product.sizes || [];
          const availableSizes = allSizes.filter((size: ProductSize) => size.in_stock);
          const hasSizes = allSizes.length > 0;
          const isProductSoldOut = hasSizes && availableSizes.length === 0;
          const selectedSize = selectedSizes[product.id];

          console.log(`🎯 Rendering product ${product.id}:`, { 
            title: product.title,
            hasSizes, 
            allSizes, 
            availableSizes, 
            selectedSize 
          });

          return (
            <div key={product.id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col p-4 relative ${
              isProductSoldOut ? 'opacity-70 grayscale hover:scale-100' : 'hover:scale-105'
            }`}>
              
              {/* ✅ SOLD OUT BADGE */}
              {isProductSoldOut && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                    SLUT I LAGER
                  </span>
                </div>
              )}

              <img
                src={product.image_url}
                alt={product.title}
                className={`w-full h-72 object-cover rounded-xl mb-4 ${
                  isProductSoldOut ? 'grayscale' : ''
                }`}
              />
              
              <h3 className={`font-semibold text-lg mb-2 ${
                isProductSoldOut ? 'text-gray-500' : 'text-gray-900 dark:text-white'
              }`}>
                {product.title}
              </h3>
              
              <p className={`mb-2 ${
                isProductSoldOut ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {product.price} kr
              </p>
              
              {/* ✅ Debug info - visa om storlekar finns */}
              {!hasSizes && (
                <p className="text-xs text-gray-500 mb-2">
                  Ingen storleksinformation tillgänglig
                </p>
              )}

              {/* ✅ Storleksväljare - Visa ALLA storlekar men bara tillåt val av tillgängliga */}
              {hasSizes && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    isProductSoldOut ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Storlek:
                    {isProductSoldOut && <span className="text-red-500 ml-2">• Alla storlekar slut</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => handleSizeChange(product.id, size.size)}
                        disabled={!size.in_stock || isProductSoldOut}
                        className={`px-3 py-1 text-xs border rounded-lg transition-all ${
                          selectedSize === size.size
                            ? 'bg-pink-500 text-white border-pink-500'
                            : size.in_stock && !isProductSoldOut
                            ? 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                        } ${isProductSoldOut ? 'cursor-not-allowed' : ''}`}
                      >
                        {size.size}
                        {!size.in_stock && ' ✗'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Knapp - Förhindra klick på helt slut-produkter */}
              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={isProductSoldOut || (availableSizes.length > 0 && !selectedSize)}
                className={`mt-auto font-semibold py-2 px-4 rounded-xl transition ${
                  isProductSoldOut
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : availableSizes.length > 0 && !selectedSize
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white'
                }`}
              >
                {isProductSoldOut ? 'Slut i lager' : 'Lägg till i varukorgen'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}