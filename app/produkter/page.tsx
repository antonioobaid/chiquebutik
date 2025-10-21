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
      const { data, error } = await supabase.from('products').select('*')

      if (error) console.error(error)
      else setProducts(data as Product[])
    }

    async function fetchFavorites() {
      if (!user) return // bara hämta om användaren är inloggad

      try {
        const res = await fetch('/api/favoriter')
        const json = await res.json()

        if (res.ok && json.products) {
          // Lägg till alla favoritprodukt-ID:n i state
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-8 lg:p-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
        Alla Produkter
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4"
            >
              <ProductCard
                product={product}
                isFavorite={favorites.includes(Number(product.id))}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300 mt-20">
          Laddar produkter...
        </p>
      )}
    </div>
  )
}
