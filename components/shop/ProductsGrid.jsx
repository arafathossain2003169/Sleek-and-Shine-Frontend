"use client"

import { useState, useEffect } from "react"
import { productApi } from "@/lib/api/products"
import { wishlistApi } from "@/lib/api/wishlist"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ProductsGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
    loadWishlist()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll({ page: 1, limit: 12 })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadWishlist = () => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setWishlist(JSON.parse(saved))
    }
  }

  const toggleWishlist = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        if (user.id) {
          await wishlistApi.remove(productId)
        }
        const newWishlist = wishlist.filter(id => id !== productId)
        setWishlist(newWishlist)
        localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      } else {
        // Add to wishlist
        if (user.id) {
          await wishlistApi.add(user.id, productId)
        }
        const newWishlist = [...wishlist, productId]
        setWishlist(newWishlist)
        localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 md:h-56 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchProducts}>Try Again</Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
        >
          {/* Product Image */}
          <Link href={`/shop/product/${product.id}`}>
            <div className="relative h-48 md:h-56 bg-muted overflow-hidden">
              <img
                src={product.images?.[0]?.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault()
                  toggleWishlist(product.id)
                }}
              >
                <Heart 
                  className="w-5 h-5" 
                  fill={wishlist.includes(product.id) ? "currentColor" : "none"} 
                />
              </Button>
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <Link href={`/shop/product/${product.id}`}>
              <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3"
                      fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                    />
                  ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews || 0})
              </span>
            </div>

            {/* Price */}
            <p className="text-lg font-bold mb-3">৳{product.price}</p>

            {/* Add to Cart Button */}
            <Button className="w-full" asChild>
              <Link href={`/shop/product/${product.id}`}>View Details</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}