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

  // ✅ Uppdatera state om prop ändras
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
        if (result.removed) setIsFavorite(false);
        else setIsFavorite(true);
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-2xl transition relative"
    >
      <img
        src={product.image_url}
        alt={product.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {product.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">{product.price} kr</p>

      <button
        onClick={handleFavorite}
        className={`absolute top-3 right-3 text-2xl ${
          isFavorite ? 'text-red-500' : 'text-gray-400'
        } hover:scale-110 transition`}
      >
        ♥
      </button>
    </Link>
  );
}
