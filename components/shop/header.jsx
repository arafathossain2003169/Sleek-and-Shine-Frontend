"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, LogOut, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"


export default function ShopHeader({ cartItemsCount, onCartClick }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const { user, logout } = useAuth()
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
  const router = useRouter()

  const handleSearch = (value) => {
    setSearchQuery(value)
    if (value.trim()) {
      const results = products.filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-sm flex items-center justify-center">
            <span className="text-background font-bold text-sm">S&S</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">Sleek & Shine</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="relative w-full">
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/product/${product.id}`}
                    onClick={() => {
                      setSearchQuery("")
                      setShowResults(false)
                    }}
                  >
                    <div className="px-4 py-2 hover:bg-muted cursor-pointer border-b last:border-0 text-sm">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-muted-foreground text-xs">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Icon - Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </Button>

          {/* Cart Icon */}
          <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>

          {/* Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile" className="cursor-pointer">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/settings" className="cursor-pointer flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="cursor-pointer">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-border px-4 py-3">
          <div className="relative w-full">
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4"
              autoFocus
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/product/${product.id}`}
                    onClick={() => {
                      setSearchQuery("")
                      setShowResults(false)
                      setSearchOpen(false)
                    }}
                  >
                    <div className="px-4 py-2 hover:bg-muted cursor-pointer border-b last:border-0 text-sm">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-muted-foreground text-xs">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
