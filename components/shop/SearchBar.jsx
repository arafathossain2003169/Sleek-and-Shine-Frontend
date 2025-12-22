"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { productApi } from "@/lib/api/products"

/* -------------------------
   Reusable Search Input
-------------------------- */
function SearchInput({
  query,
  setQuery,
  results,
  open,
  setOpen,
  setMobileOpen,
  inputRef,
}) {
  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        className="pl-10"
      />

      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/shop/product/${p.id}`}
              onClick={() => {
                setQuery("")
                setOpen(false)
                setMobileOpen(false)
              }}
              className="block px-4 py-2 hover:bg-muted text-sm"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">৳{p.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------
   Main Search Bar
-------------------------- */
export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState([])
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const desktopInputRef = useRef(null)
  const mobileInputRef = useRef(null)

  /* Fetch products once */
  useEffect(() => {
    productApi
      .getAll({ page: 1, limit: 100 })
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
  }, [])

  /* Search logic */
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered.slice(0, 6))
  }, [query, products])

  /* Safe autofocus for mobile */
  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        mobileInputRef.current?.focus()
      })
    }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <SearchInput
          query={query}
          setQuery={setQuery}
          results={results}
          open={open}
          setOpen={setOpen}
          setMobileOpen={setMobileOpen}
          inputRef={desktopInputRef}
        />
      </div>

      {/* Mobile search button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Mobile search input */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-t px-4 py-3 md:hidden z-50">
          <SearchInput
            query={query}
            setQuery={setQuery}
            results={results}
            open={open}
            setOpen={setOpen}
            setMobileOpen={setMobileOpen}
            inputRef={mobileInputRef}
          />
        </div>
      )}
    </>
  )
}
