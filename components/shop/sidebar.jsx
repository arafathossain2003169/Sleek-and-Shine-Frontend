"use client"

import { useState, useEffect } from "react"
import { Filter, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { shopApi } from "@/lib/api/shop"
import { useRouter } from "next/navigation"

export default function ShopSidebar({ sidebarCollapsed, onCollapsedChange }) {
  const router = useRouter()

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(200)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catData, brandData] = await Promise.all([shopApi.getCategories(), shopApi.getBrands()])
        setCategories(catData)
        setBrands(brandData)
      } catch (err) {
        console.error(err)
      }
    }
    fetchFilters()
  }, [])

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const toggleBrand = (id) => {
    setSelectedBrands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]))
  }

  const applyFilters = () => {
    const query = new URLSearchParams({
      categories: selectedCategories.join(","),
      brands: selectedBrands.join(","),
      minPrice,
      maxPrice,
    }).toString()
    router.push(`/shop/search?${query}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setMinPrice(0)
    setMaxPrice(200)
    router.push("/shop")
  }

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-30 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Filter className="w-5 h-5" />
      </Button>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-15 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Expand Button */}
      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-20 left-2 z-30 md:left-4"
          onClick={() => onCollapsedChange(false)}
          title="Expand Filters"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] border-r border-border bg-background transform transition-all duration-300 ease-in-out z-20 flex flex-col ${
          sidebarCollapsed ? "w-0 -translate-x-full md:w-0 overflow-hidden" : "translate-x-0 w-64"
        }`}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => onCollapsedChange(true)} title="Collapse Filters">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(false)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm font-medium cursor-pointer">
                    {category.name}
                  </label>
                  <span className="text-xs text-muted-foreground ml-auto">({category.count})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div>
            <h3 className="font-semibold mb-3">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                  />
                  <label htmlFor={`brand-${brand.id}`} className="text-sm font-medium cursor-pointer">
                    {brand.name}
                  </label>
                  <span className="text-xs text-muted-foreground ml-auto">({brand.count})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="space-y-2">
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="Min"
                className="mb-2"
              />
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="Max"
              />
              <div className="text-sm mt-1">
                ${minPrice} - ${maxPrice}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="flex-1" onClick={applyFilters}>
              Apply
            </Button>
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
