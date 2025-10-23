'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Product } from '@/types/types';
import Link from 'next/link';

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

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Du måste vara inloggad för att gilla produkter.");
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

  return (
    <Link
      href={`/produkter/${product.id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden relative focus:outline-none focus:ring-0"
    >
      {/* Produktbild */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 text-2xl drop-shadow-sm transition-transform duration-300 ${
            isFavorite ? 'text-red-500 scale-110' : 'text-gray-300 group-hover:text-gray-400'
          } hover:scale-125`}
        >
          ♥
        </button>
      </div>

      {/* Produktinformation */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {product.description?.length ? product.description : 'Elegant och stilren klänning.'}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {product.price} kr
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Se mer →</span>
        </div>
      </div>
    </Link>
  );
}
