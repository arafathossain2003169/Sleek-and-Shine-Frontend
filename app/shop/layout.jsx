"use client"

import { useState, useEffect } from "react"
import ShopHeader from "@/components/shop/ShopHeader"
import ShopSidebar from "@/components/shop/sidebar"
import CartSidebar from "@/components/shop/cart-sidebar"
import Footer from "@/components/shop/footer"

export default function ShopLayout({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent("updateCheckoutCart", { detail: cartItems }))
  }, [cartItems])

  useEffect(() => {
    const handleAddToCart = (event) => {
      const product = event.detail
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id)

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item,
          )
        } else {
          return [...prevItems, product]
        }
      })
      setCartOpen(true)
    }

    window.addEventListener("addToCart", handleAddToCart)
    return () => window.removeEventListener("addToCart", handleAddToCart)
  }, [])

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ShopHeader cartItemsCount={cartItems.length} onCartClick={() => setCartOpen(true)} />

      <div className="flex flex-1">
        <ShopSidebar sidebarCollapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <Footer />

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  )
}
