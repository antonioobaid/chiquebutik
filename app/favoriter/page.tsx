'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Product, ProductSize, ProductImage } from "@/types/types";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FavoriterPage() {
  const { user } = useUser();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (!user?.id) return;

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favoriter");
        const json = await res.json();
        const productsWithSizes = json.products || [];

        const transformedProducts = productsWithSizes.map((product: Product) => {
          const productImages = product.product_images || [];
          let images: ProductImage[] = [];

          if (productImages.length > 0) {
            images = productImages.sort(
              (a: ProductImage, b: ProductImage) => a.image_order - b.image_order
            );
          } else {
            images = [
              {
                id: 0,
                product_id: product.id,
                image_url: product.image_url,
                image_order: 0,
                created_at: new Date().toISOString(),
              },
            ];
          }

          return {
            ...product,
            sizes: product.product_sizes || [],
            images: images,
          };
        });

        setProducts(transformedProducts);

        const initialSizes: { [key: number]: string } = {};
        const initialImageIndexes: { [key: number]: number } = {};

        transformedProducts.forEach((product: Product) => {
          const availableSizes = product.sizes?.filter(
            (size: ProductSize) => size.in_stock
          ) || [];
          if (availableSizes.length > 0) {
            initialSizes[product.id] = availableSizes[0].size;
          }
          initialImageIndexes[product.id] = 0;
        });

        setSelectedSizes(initialSizes);
        setSelectedImageIndexes(initialImageIndexes);
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
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    const allSizes = product.sizes || [];
    const availableSizes = allSizes.filter((size: ProductSize) => size.in_stock);
    const isProductSoldOut = allSizes.length > 0 && availableSizes.length === 0;

    if (isProductSoldOut) {
      alert("❌ Denna produkt är tyvärr slut i lager.");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      alert("Välj en storlek först.");
      return;
    }

    try {
      const success = await addToCart(productId, selectedSize);
      if (success) {
        alert(`✅ ${product.title} har lagts till i varukorgen!`);
        router.push("/varukorg");
      } else {
        alert("Kunde inte lägga till produkten i varukorgen.");
      }
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod när produkten skulle läggas till.");
    }
  }

  function handleSizeChange(productId: number, size: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const sizeObj = product.sizes?.find((s) => s.size === size);
    if (sizeObj && sizeObj.in_stock) {
      setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    } else {
      alert("❌ Denna storlek är slut.");
    }
  }

  function handleNextImage(productId: number) {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.images) return;
    const currentIndex = selectedImageIndexes[productId] || 0;
    const nextIndex =
      currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImageIndexes((prev) => ({ ...prev, [productId]: nextIndex }));
  }

  function handlePrevImage(productId: number) {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.images) return;
    const currentIndex = selectedImageIndexes[productId] || 0;
    const prevIndex =
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setSelectedImageIndexes((prev) => ({ ...prev, [productId]: prevIndex }));
  }

  function handleImageSelect(productId: number, imageIndex: number) {
    setSelectedImageIndexes((prev) => ({ ...prev, [productId]: imageIndex }));
  }

  function getProductImages(product: Product): ProductImage[] {
    if (product.images && product.images.length > 0) return product.images;
    return [
      {
        id: 0,
        product_id: product.id,
        image_url: product.image_url,
        image_order: 0,
        created_at: new Date().toISOString(),
      },
    ];
  }

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Du måste logga in för att se dina favoriter.
      </p>
    );
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Laddar favoriter...
      </p>
    );
  if (products.length === 0)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Du har inga favoriter än.
      </p>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-12">
      <section className="text-center mb-12 py-12 px-6 rounded-3xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Mina <span className="text-blue-600">Favoriter</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl">
          Här hittar du alla produkter du har sparat som favoriter.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const allSizes = product.sizes || [];
          const availableSizes = allSizes.filter((s) => s.in_stock);
          const hasSizes = allSizes.length > 0;
          const isProductSoldOut = hasSizes && availableSizes.length === 0;
          const selectedSize = selectedSizes[product.id];
          const selectedImageIndex = selectedImageIndexes[product.id] || 0;
          const productImages = getProductImages(product);
          const currentImage =
            productImages[selectedImageIndex]?.image_url || product.image_url;
          const hasMultipleImages = productImages.length > 1;

          return (
            <div
              key={product.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col p-4 relative ${
                isProductSoldOut
                  ? "opacity-70 grayscale hover:scale-100"
                  : "hover:scale-105"
              }`}
            >
              {isProductSoldOut && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                    SLUT I LAGER
                  </span>
                </div>
              )}

              {/* Huvudbild */}
              <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <motion.div
                  key={`${product.id}-${selectedImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={currentImage}
                    alt={product.title}
                    width={400}
                    height={400}
                    className={`w-full max-h-80 object-contain ${
                      isProductSoldOut ? "grayscale" : ""
                    }`}
                  />
                </motion.div>

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => handlePrevImage(product.id)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleNextImage(product.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {hasMultipleImages && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Miniatyrbilder */}
              {hasMultipleImages && (
                <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageSelect(product.id, index)}
                      className={`flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border ${
                        selectedImageIndex === index
                          ? "border-pink-500 ring-1 ring-pink-300"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={`${product.title} ${index + 1}`}
                        width={100}
                        height={100}
                        priority
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <h3
                className={`font-semibold text-lg mb-2 ${
                  isProductSoldOut
                    ? "text-gray-500"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {product.title}
              </h3>

              <p
                className={`mb-2 ${
                  isProductSoldOut
                    ? "text-gray-400 line-through"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {product.price} kr
              </p>

              {hasSizes && (
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isProductSoldOut
                        ? "text-gray-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Storlek:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeChange(product.id, size.size)}
                        disabled={!size.in_stock || isProductSoldOut}
                        className={`px-3 py-1 text-xs border rounded-lg transition-all ${
                          selectedSize === size.size
                            ? "bg-pink-500 text-white border-pink-500"
                            : size.in_stock && !isProductSoldOut
                            ? "bg-white text-gray-700 border-gray-300 hover:border-pink-300"
                            : "bg-gray-100 text-gray-400 border-gray-200 line-through"
                        }`}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={isProductSoldOut || (availableSizes.length > 0 && !selectedSize)}
                className={`mt-auto font-semibold py-2 px-4 rounded-xl transition ${
                  isProductSoldOut
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : availableSizes.length > 0 && !selectedSize
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                }`}
              >
                {isProductSoldOut ? "Slut i lager" : "Lägg till i varukorgen"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
