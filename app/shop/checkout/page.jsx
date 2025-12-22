"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { cartApi } from "@/lib/api/cart"
import { orderApi } from "@/lib/api/orders"

// Import modular components
import CheckoutSteps from "@/components/checkout/CheckoutSteps"
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm"
import ShippingMethodSelector from "@/components/checkout/ShippingMethodSelector"
import BkashPaymentForm from "@/components/checkout/BkashPaymentForm"
import OrderSummary from "@/components/checkout/OrderSummary"
import OrderSuccess from "@/components/checkout/OrderSuccess"

// Helper function to get session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null
  let sessionId = localStorage.getItem('cartSessionId')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('cartSessionId', sessionId)
  }
  return sessionId
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Form data state (without email)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Bangladesh"
  })

  // Bkash payment state
  const [paymentData, setPaymentData] = useState({
    bkashNumber: "",
    transactionId: ""
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await cartApi.get()
      
      if (response.success) {
        const items = response.data || []
        setCartItems(items)
        
        // Redirect if cart is empty
        if (items.length === 0) {
          router.push('/shop')
        }
      } else {
        setError('Failed to load cart items')
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      setError('Failed to load cart items')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep1 = () => {
    const { firstName, lastName, phone, address, city, state, zip, country } = formData
    if (!firstName || !lastName || !phone || !address || !city || !state || !zip || !country) {
      setError("Please fill in all required fields")
      return false
    }
    setError("")
    return true
  }

  const handleStep1Continue = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value)
  }

  const handleCompleteOrder = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty")
      return
    }

    if (!paymentData.bkashNumber || !paymentData.transactionId) {
      setError("Please enter your bKash number and transaction ID")
      return
    }

    try {
      setIsProcessing(true)
      setError("")
      
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      const orderData = {
        // Customer info from form (no email)
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        
        // Shipping address
        shippingAddressLine1: formData.address,
        shippingCity: formData.city,
        shippingState: formData.state,
        shippingZip: formData.zip,
        shippingCountry: formData.country,
        
        // Items - map from cart structure matching backend
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity
        })),
        
        // Payment and shipping
        paymentMethod: "bkash",
        bkashNumber: paymentData.bkashNumber,
        bkashTransactionId: paymentData.transactionId,
        shippingMethod: shippingMethod,
        shippingCost: shippingMethod === "express" ? 15 : 0
      }

      const response = await orderApi.create(orderData)
      
      if (response.success) {
        // Clear cart after successful order
        await cartApi.clear(user.id, user.id ? null : getSessionId())
        
        // Set step to success
        setStep(4)
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/order-success/${response.data.orderNumber}`)
        }, 2000)
      } else {
        setError(response.message || 'Failed to create order')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Order failed:', error)
      setError('Failed to process order. Please try again.')
      setIsProcessing(false)
    }
  }
  
  // Calculate shipping cost
  const shippingCost = shippingMethod === "express" ? 15 : 0

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="text-primary hover:underline mb-4 inline-block">
            ← Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <CheckoutSteps currentStep={step} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            <ShippingAddressForm
              formData={formData}
              onChange={handleInputChange}
              onContinue={handleStep1Continue}
              currentStep={step}
              disabled={step > 1}
            />

            {/* Step 2: Shipping Method */}
            <ShippingMethodSelector
              selectedMethod={shippingMethod}
              onChange={handleShippingMethodChange}
              onContinue={() => setStep(3)}
              onBack={() => setStep(1)}
              currentStep={step}
              disabled={step > 2}
            />

            {/* Step 3: Payment (Bkash) */}
            <BkashPaymentForm
              bkashNumber={paymentData.bkashNumber}
              transactionId={paymentData.transactionId}
              onChange={handlePaymentChange}
              onComplete={handleCompleteOrder}
              onBack={() => setStep(2)}
              currentStep={step}
              isProcessing={isProcessing}
            />

            {/* Step 4: Order Success */}
            {step === 4 && <OrderSuccess />}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary 
              cartItems={cartItems} 
              shippingCost={shippingCost}
            />
          </div>
        </div>
      </div>
    </div>
  )
}