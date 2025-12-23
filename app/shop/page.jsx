// app/shop/page.jsx - Server Component (Static Parts)
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import ChooseUs from "@/components/shop/choose-us"
import ProductsGrid from "@/components/shop/ProductsGrid"
import TrendingProducts from "@/components/shop/TrendingProducts"
import { Loader2 } from "lucide-react"

export default function ShopPage() {
  return (
    <div>
      {/* Hero Section - Static, renders immediately */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Discover Premium Beauty
          </h1>
          <p className="text-lg text-slate-300 mb-6 text-balance">
            Elevate your beauty routine with Sleek & Shine's curated collection of premium cosmetics
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Explore Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Trending Products - Dynamic with loading fallback */}
      <div className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending This Week</h2>
          </div>
          <Suspense fallback={<TrendingProductsSkeleton />}>
            <TrendingProducts />
          </Suspense>
        </div>
      </div>

      {/* Products Section - Dynamic with loading fallback */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h2>
          <p className="text-muted-foreground">
            Discover our curated collection of premium cosmetics
          </p>
        </div>

        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsGrid />
        </Suspense>
      </div>

      {/* Choose Us Section - Static, renders immediately */}
      <ChooseUs />
    </div>
  )
}

// Loading skeleton for trending products
function TrendingProductsSkeleton() {
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

// Loading skeleton for products grid
function ProductsGridSkeleton() {
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