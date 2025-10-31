// app/produkter/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ProductCard from '../../components/ProductCard'
import { Product } from '@/types/types'
import { useUser } from '@clerk/nextjs'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const { user } = useUser()

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select(`*, product_sizes(*) product_images(*)`)

      if (error) console.error(error)
      else {
        // ✅ TRANSFORMERA: Mappa product_sizes till sizes
        const transformedProducts = data.map((product: any) => ({
          ...product,
          sizes: product.product_sizes || []
        }));
        setProducts(transformedProducts as Product[])
      }
    }

    async function fetchFavorites() {
      if (!user) return

      try {
        const res = await fetch('/api/favoriter')
        const json = await res.json()

        if (res.ok && json.products) {
          const favoriteIds = json.products.map((item: any) => Number(item.id))
          setFavorites(favoriteIds)
        }
      } catch (error) {
        console.error('Kunde inte hämta favoriter:', error)
      }
    }

    fetchProducts()
    fetchFavorites()
  }, [user])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 🔹 Titel-sektion */}
      <section className="text-center py-16 sm:py-20 px-4 bg-gradient-to-r from-white via-blue-100 to-blue-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-md rounded-b-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
          Alla <span className="text-blue-600">Produkter</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Utforska vårt urval av vackra klänningar — elegans för varje tillfälle.
        </p>
      </section>

      {/* 🔹 Produktlista */}
      <main className="flex-grow py-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(Number(product.id))}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300 mt-20">
            Laddar produkter...
          </p>
        )}
      </main>

      {/* 🔹 Liten avslutningssektion */}
      <section className="text-center py-10 bg-gradient-to-r from-white via-pink-50 to-purple-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-t-2xl shadow-inner">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          💖 Hittade du något du gillar? Klicka på hjärtat för att spara dina favoriter!
        </p>
      </section>
    </div>
  )
}