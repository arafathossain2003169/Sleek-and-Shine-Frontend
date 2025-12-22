// app/shop/page.jsx - Updated to use API
"use client"

import { useState, useEffect } from "react"
import { productApi } from "@/lib/api/products"
import { wishlistApi } from "@/lib/api/wishlist"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ChooseUs from "../../components/shop/choose-us"



export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll({ page: 1, limit: 12 })
      setProducts(response.data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await wishlistApi.remove(productId)
        setWishlist(prev => prev.filter(id => id !== productId))
      } else {
        await wishlistApi.add(userId, productId)
        setWishlist(prev => [...prev, productId])
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    }
  }
  if (loading) return <div>Loading...</div>
  // if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Discover Premium Beauty</h1>
          <p className="text-lg text-slate-300 mb-6 text-balance">
            Elevate your beauty routine with Sleek & Shine's curated collection of premium cosmetics
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Explore Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      

      {/* Trending Products Slideshow */}
      <div className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending This Week</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10">
                ←
              </Button>
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10">
                →
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition">
                <div className="h-40 bg-muted rounded-lg mb-4">
                  <img
                    src={product.images[0].imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-lg font-bold text-slate-300">৳{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h2>
          <p className="text-muted-foreground">Discover our curated collection of premium cosmetics</p>
        </div>

        {/* Products Grid */}
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
                    src={product.images[0].imageUrl || "/placeholder.svg"}
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
                    <Heart className="w-5 h-5" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
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
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        />
                      ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
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
      </div>

      <ChooseUs />

      
    </div>
  )
}
