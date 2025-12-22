"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { orderApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, Loader2, Eye, RefreshCw, CreditCard, MapPin, Phone } from "lucide-react"

/* ----------------------------------------
   Order Progress Bar
----------------------------------------- */
const statusSteps = ["pending", "processing", "shipped", "completed"]

function OrderProgress({ status }) {
  const currentStep = statusSteps.indexOf(status)

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        {statusSteps.map((step, index) => (
          <span
            key={step}
            className={index <= currentStep ? "text-primary font-medium" : ""}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </span>
        ))}
      </div>

      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / statusSteps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

/* ----------------------------------------
   Payment Status Badge
----------------------------------------- */
function PaymentStatusBadge({ status }) {
  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100"
      case "refunded":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <Badge className={getPaymentColor(status)}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
    </Badge>
  )
}

/* ----------------------------------------
   Orders Page
----------------------------------------- */
export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      router.push('/auth/login')
    } else {
      setAuthChecked(true)
    }
  }, [router])

  // Fetch orders when auth is confirmed
  useEffect(() => {
    if (authChecked) {
      fetchOrders()
    }
  }, [authChecked])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError("")
      
      const token = localStorage.getItem('token')
      if (!token) {
        setError("No authentication token found")
        router.push('/auth/login')
        return
      }

      // Use the new user-specific endpoint
      const response = await orderApi.getUserOrders(token)
      
      if (response.success) {
        setOrders(response.data || [])
      } else {
        // If unauthorized, redirect to login
        if (response.message?.includes('token') || response.message?.includes('Unauthorized')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/auth/login')
        } else {
          setError(response.message || "Failed to load orders")
        }
      }
    } catch (err) {
      console.error("Failed to load orders:", err)
      // Check if it's an auth error
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth/login')
      } else {
        setError("Failed to load orders. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100"
      case "processing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  /* ---------- Not authenticated - checking ---------- */
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </Card>
      </div>
    )
  }

  /* ---------- Loading orders ---------- */
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/user/profile" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground mt-2">
                Track and manage your orders
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={fetchOrders}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 && !error ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </Card>
        ) : orders.length > 0 ? (
          <>
            {/* Order count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Order header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <p>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      <div className="flex items-center gap-1 font-semibold text-lg">
                        ৳{parseFloat(order.total).toFixed(2)}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/user/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <OrderProgress status={order.status} />

                  {/* Order details summary */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Subtotal</p>
                      <p className="font-medium">৳{parseFloat(order.subtotal).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shipping</p>
                      <p className="font-medium">
                        {parseFloat(order.shippingCost) === 0 ? 'Free' : `৳${parseFloat(order.shippingCost).toFixed(2)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tax</p>
                      <p className="font-medium">৳{parseFloat(order.tax).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment</p>
                      <div className="flex items-center gap-1">
                        {order.paymentMethod === 'bkash' && (
                          <div className="w-4 h-4 bg-pink-600 rounded-sm flex items-center justify-center text-white text-[8px] font-bold">
                            bK
                          </div>
                        )}
                        <p className="font-medium capitalize">{order.paymentMethod || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment info (if bKash) */}
                  {order.paymentMethod === 'bkash' && (order.bkashNumber || order.bkashTransactionId) && (
                    <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-900 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-pink-600" />
                        <span className="text-sm font-medium text-pink-900 dark:text-pink-100">
                          bKash Payment Details
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        {order.bkashNumber && (
                          <div className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
                            <Phone className="w-3 h-3" />
                            <span className="font-mono">{order.bkashNumber}</span>
                          </div>
                        )}
                        {order.bkashTransactionId && (
                          <p className="text-pink-800 dark:text-pink-200">
                            TxID: <span className="font-mono">{order.bkashTransactionId}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items preview */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-2">Items:</p>
                    <div className="space-y-2">
                      {order.items && order.items.length > 0 ? (
                        order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.productName || item.name}</span>
                              <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                            </div>
                            <span className="font-medium">৳{parseFloat(item.subtotal).toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No items</p>
                      )}
                      {order.items && order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground italic">
                          +{order.items.length - 3} more {order.items.length - 3 === 1 ? 'item' : 'items'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping info */}
                  {order.shippingAddressLine1 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <p className="text-sm font-medium">Shipping Address:</p>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {order.customerName && <span className="font-medium text-foreground">{order.customerName}<br /></span>}
                        {order.customerPhone && (
                          <span className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3" />
                            {order.customerPhone}
                            <br />
                          </span>
                        )}
                        {order.shippingAddressLine1}
                        {order.shippingAddressLine2 && `, ${order.shippingAddressLine2}`}
                        <br />
                        {order.shippingCity}, {order.shippingState} {order.shippingZip}
                        <br />
                        {order.shippingCountry}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}