"use client"

import { useState, useEffect, useRef } from "react"
import { productApi } from "@/lib/api/products"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function TrendingProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll({ page: 1, limit: 8 })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Failed to fetch trending products:', error)
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = container.querySelector('.trending-card')?.offsetWidth || 0
    const gap = 24 // gap-6 = 24px
    const scrollAmount = cardWidth + gap

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      setCurrentIndex(Math.max(0, currentIndex - 1))
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setCurrentIndex(Math.min(products.length - 4, currentIndex + 1))
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
            <div className="h-40 bg-slate-700 rounded-lg mb-4" />
            <div className="h-4 bg-slate-700 rounded mb-2 w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No trending products available
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="border-white text-white hover:bg-white/10"
          onClick={() => scroll('left')}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-white text-white hover:bg-white/10"
          onClick={() => scroll('right')}
          disabled={currentIndex >= products.length - 4}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            href={`/shop/product/${product.id}`}
            className="trending-card flex-shrink-0 w-64 md:w-72"
          >
            <div className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors h-full">
              <div className="h-40 bg-slate-700 rounded-lg mb-4 overflow-hidden">
                <img
                  src={product.images?.[0]?.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2 text-white">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-slate-300">
                ৳{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: Show as grid on small screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          .flex.gap-6 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            overflow-x: visible;
          }
          .trending-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}