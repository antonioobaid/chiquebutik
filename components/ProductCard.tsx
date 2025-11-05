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
  const [isLoading, setIsLoading] = useState(false);
  const [isProductSoldOut, setIsProductSoldOut] = useState(false);
  const [showSoldOutAnimation, setShowSoldOutAnimation] = useState(false);

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

  // ✅ Kolla om produkten är slut (original logik)
  const allSizes = product.product_sizes || [];
  const availableSizes = allSizes.filter(size => size.in_stock);
  const originalSoldOutStatus = allSizes.length > 0 && availableSizes.length === 0;

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Du måste vara inloggad för att spara favoriter.");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Funktion för att markera produkten som slut
  const handleProductClick = (e: React.MouseEvent) => {
    // Om produkten är slut OCH den inte redan är markerad som slut
    if (originalSoldOutStatus && !isProductSoldOut) {
      e.preventDefault();
      
      // ✅ Visa animation först
      setShowSoldOutAnimation(true);
      
      // ✅ Efter animation, markera produkten som slut
      setTimeout(() => {
        setIsProductSoldOut(true);
        setShowSoldOutAnimation(false);
        
        // Spara i localStorage så det kommer ihåg
        const soldOutProducts = JSON.parse(localStorage.getItem('soldOutProducts') || '[]');
        if (!soldOutProducts.includes(product.id)) {
          soldOutProducts.push(product.id);
          localStorage.setItem('soldOutProducts', JSON.stringify(soldOutProducts));
        }
      }, 1500);
    }
    // Om produkten redan är markerad som slut, förhindra klick helt
    else if (isProductSoldOut) {
      e.preventDefault();
    }
    // Annars låt länken fungera normalt (produkter i lager)
  };

  const sizeText = allSizes.length > 0
    ? `Storlekar: ${allSizes.map(size =>
        size.in_stock ? size.size : `<s class="text-gray-400">${size.size}</s>`
      ).join(', ')}`
    : '';

  return (
    <>
      {/* ✅ Snygg animation med smiley när produkten är slut */}
      {showSoldOutAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl transform animate-scale-in">
            <div className="text-center">
              {/* ✅ Stor snygg smiley */}
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-5xl">😔</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Slut i lager
              </h3>
              
              {/* ✅ FIXAD: Escapade citationstecken */}
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold">&ldquo;{product.title}&rdquo;</span>
              </p>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Denna produkt är tyvärr inte tillgänglig för tillfället
              </p>
              
              {/* ✅ Laddningsanimation */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 animate-progress" />
                </div>
              </div>
              
              <p className="text-xs text-gray-400">
                Uppdaterar produkt...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative w-full border border-gray-200 dark:border-gray-700 ${
        isProductSoldOut ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
      }`}>
        
        {/* ✅ Snygg SOLD OUT badge med smiley */}
        {isProductSoldOut && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-2xl font-bold text-sm shadow-2xl backdrop-blur-sm flex items-center gap-2 border border-gray-500/30">
              <span className="text-lg">😔</span>
              <span>SLUT I LAGER</span>
            </div>
          </div>
        )}

        {/* ✅ Alla produkter visas som normala från början */}
        <Link 
          href={isProductSoldOut ? '#' : `/produkter/${product.id}`}
          className="flex flex-col h-full"
          onClick={handleProductClick}
        >
          <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 flex-1 ${
            isProductSoldOut ? 'cursor-not-allowed' : ''
          }`}>
            <Image
              src={productImage}
              alt={product.title}
              width={400}
              height={400}
              className={`w-full h-96 object-contain transition-transform duration-300 ${
                isProductSoldOut 
                  ? 'grayscale brightness-90' 
                  : 'group-hover:scale-105'
              }`}
              sizes="100vw"
              priority
            />
            
            <button
              onClick={handleFavorite}
              disabled={isLoading}
              className={`absolute top-4 right-4 text-3xl drop-shadow-lg transition-all duration-300 ${
                isFavorite 
                  ? 'text-red-500 scale-110' 
                  : isProductSoldOut 
                    ? 'text-white/60' 
                    : 'text-white/80 hover:text-white'
              } ${!isLoading && !isProductSoldOut ? 'hover:scale-125' : ''} z-20`}
            >
              {isLoading ? '⋯' : '♥'}
            </button>

            {/* ✅ Överlay för slutna produkter */}
            {isProductSoldOut && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 shadow-2xl transform -rotate-6 border border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">😔</span>
                    <span className="text-gray-800 dark:text-white font-bold text-sm">
                      Slut
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col gap-3">
            <h3 className={`text-xl font-semibold transition-all duration-300 ${
              isProductSoldOut 
                ? 'text-gray-500' 
                : 'text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent'
            }`}>
              {product.title}
            </h3>
            
            <p className={`text-base line-clamp-2 ${
              isProductSoldOut 
                ? 'text-gray-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {product.description?.length ? product.description : 'Elegant och stilren klänning.'}
            </p>
            
            {sizeText && (
              <p
                className={`text-sm ${
                  isProductSoldOut ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}
                dangerouslySetInnerHTML={{ __html: sizeText }}
              />
            )}
            
            <div className="flex items-center justify-between mt-4">
              <span className={`text-2xl font-bold ${
                isProductSoldOut 
                  ? 'text-gray-400 line-through' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'
              }`}>
                {product.price} kr
              </span>
              
              <span className={`text-base transition-all duration-300 ${
                isProductSoldOut 
                  ? 'text-gray-400' 
                  : 'text-gray-500 dark:text-gray-400 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent'
              }`}>
                {isProductSoldOut ? 'Ej tillgänglig' : 'Se mer ›'}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}