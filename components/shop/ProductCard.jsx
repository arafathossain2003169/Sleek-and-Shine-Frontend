"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"

export default function ProductCard({ product, wishlist = [], toggleWishlist = () => {} }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
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
          <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <p className="text-lg font-bold mb-3">৳{product.price}</p>

        {/* Add to Cart / View Details */}
        <Button className="w-full" asChild>
          <Link href={`/shop/product/${product.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  )
}
