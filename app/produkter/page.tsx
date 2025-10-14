'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ProductCard from '../../components/ProductCard'
import { Product } from '@/types/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) console.error(error)
      else setProducts(data as Product[])
    }

    fetchProducts()
  }, [])

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
              <ProductCard product={product} />
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
