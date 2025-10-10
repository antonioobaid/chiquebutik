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

      if (error) {
        console.error(error)
      } else if (data) {
        setProducts(data as Product[])
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
