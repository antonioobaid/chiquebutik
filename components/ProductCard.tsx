'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Product } from '@/types/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
}

export default function ProductCard({ product, isFavorite: initialFavorite = false }: ProductCardProps) {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  // ✅ Hämta första bilden från product_images eller fallback till image_url
  const getProductImage = () => {
    if (product.product_images && product.product_images.length > 0) {
      const sortedImages = [...product.product_images].sort((a, b) => a.image_order - b.image_order);
      return sortedImages[0].image_url;
    }
    return product.image_url;
  };

  const productImage = getProductImage();

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Du måste vara inloggad för att spara favoriter.");
      return;
    }

    try {
      const res = await fetch('/api/favoriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const result = await res.json();

      if (res.ok) {
        setIsFavorite(!result.removed);
      } else {
        console.error('Fel vid sparning:', result.error);
      }
    } catch (error) {
      console.error("Nätverksfel:", error);
    }
  }

  // ✅ Kolla om produkten är slut
  const allSizes = product.product_sizes || [];
  const availableSizes = allSizes.filter(size => size.in_stock);
  const isProductSoldOut = allSizes.length > 0 && availableSizes.length === 0;

  const sizeText = allSizes.length > 0
    ? `Storlekar: ${allSizes.map(size =>
        size.in_stock ? size.size : `<s class="text-gray-400">${size.size}</s>`
      ).join(', ')}`
    : '';

  return (
    <div
      className={`group bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden relative w-full ${
        isProductSoldOut ? 'opacity-80 grayscale' : ''
      }`}
    >
      {/* ✅ SOLD OUT BADGE */}
      {isProductSoldOut && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            SLUT I LAGER
          </span>
        </div>
      )}

      {/* ✅ Produktkort med/utan länk */}
      {isProductSoldOut ? (
        <div className="cursor-not-allowed h-full flex flex-col">
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 flex-1">
            <Image
              src={productImage}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-96 object-contain grayscale"
              sizes="100vw"
              priority
            />
            <button
              onClick={handleFavorite}
              className={`absolute top-4 right-4 text-3xl drop-shadow-lg transition-all duration-300 ${
                isFavorite ? 'text-red-500 scale-110' : 'text-white/80 hover:text-white'
              } hover:scale-125 z-20`}
            >
              ♥
            </button>
          </div>

          <div className="p-6 flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-gray-500">{product.title}</h3>
            <p className="text-gray-400 text-base line-clamp-2">
              {product.description?.length ? product.description : 'Elegant och stilren klänning.'}
            </p>
            {sizeText && (
              <p
                className="text-gray-400 text-sm"
                dangerouslySetInnerHTML={{ __html: sizeText }}
              />
            )}
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-gray-400 line-through">
                {product.price} kr
              </span>
              <span className="text-base text-gray-400 font-medium">Slut</span>
            </div>
          </div>
        </div>
      ) : (
        <Link href={`/produkter/${product.id}`} className="flex flex-col h-full">
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 flex-1">
            <Image
              src={productImage}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-96 object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="100vw"
              priority
            />
            <button
              onClick={handleFavorite}
              className={`absolute top-4 right-4 text-3xl drop-shadow-lg transition-all duration-300 ${
                isFavorite ? 'text-red-500 scale-110' : 'text-white/80 hover:text-white'
              } hover:scale-125 z-20`}
            >
              ♥
            </button>
          </div>

          <div className="p-6 flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {product.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base line-clamp-2">
              {product.description?.length ? product.description : 'Elegant och stilren klänning.'}
            </p>
            {sizeText && (
              <p
                className="text-gray-500 dark:text-gray-400 text-sm"
                dangerouslySetInnerHTML={{ __html: sizeText }}
              />
            )}
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {product.price} kr
              </span>
              <span className="text-base text-gray-500 dark:text-gray-400 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                Se mer ›
              </span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
