"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cartApi } from "@/lib/api/cart"
import { useAuth } from "@/contexts/AuthContext"

const getSessionId = () => {
  if (typeof window === 'undefined') return null
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

export default function CartSidebar({ open, onOpenChange }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchCart()
    }
  }, [open, user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const params = user?.id 
        ? { userId: user.id } 
        : { sessionId: getSessionId() }
      
      const queryString = new URLSearchParams(params).toString()
      const response = await cartApi.get(queryString)
      
      if (response.success) {
        setItems(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await cartApi.remove(itemId)
      fetchCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(itemId)
      return
    }

    try {
      await cartApi.update(itemId, newQuantity)
      fetchCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleCheckout = () => {
    // Store cart items for checkout
    localStorage.setItem('checkoutCart', JSON.stringify(items))
    onOpenChange(false)
  }

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0
    return sum + (parseFloat(price) * item.quantity)
  }, 0)

  const shippingCost = total >= 50 ? 0 : 10
  const finalTotal = total + shippingCost

  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => onOpenChange(false)} 
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                {/* Item Image */}
                <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.product?.images?.[0]?.imageUrl || "/placeholder.svg"} 
                    alt={item.product?.name || 'Product'} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.product?.name || 'Unknown Product'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${parseFloat(item.product?.price || 0).toFixed(2)}
                  </p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-8 h-6 flex items-center justify-center text-sm border-l border-r border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/shop/checkout" onClick={handleCheckout}>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full bg-transparent" 
              onClick={() => onOpenChange(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  )
}