"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { orderApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Phone, 
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from "lucide-react"

const statusSteps = ["pending", "processing", "shipped", "completed"]

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  completed: CheckCircle2,
  cancelled: XCircle
}

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100",
  processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100",
}

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
  failed: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
}

function OrderProgress({ status }) {
  const currentStep = statusSteps.indexOf(status)

  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        {statusSteps.map((step, index) => {
          const Icon = statusIcons[step]
          const isCompleted = index <= currentStep
          const isActive = index === currentStep

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
              {index < statusSteps.length - 1 && (
                <div
                  className={`hidden md:block absolute h-0.5 -z-10 transition-colors ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                  style={{
                    width: "calc(100% / 4)",
                    left: `${(index * 100) / 4 + 12.5}%`,
                    top: "24px"
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, router])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError("")
      
      const token = localStorage.getItem('token')
      const response = await orderApi.getById(orderId)
      
      if (response.success) {
        setOrder(response.data)
      } else {
        setError(response.message || "Failed to load order details")
      }
    } catch (err) {
      console.error("Failed to load order:", err)
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        router.push('/auth/login')
      } else {
        setError("Failed to load order details. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Button onClick={fetchOrder} variant="outline" className="mr-2">
            Try Again
          </Button>
          <Button asChild>
            <Link href="/user/orders">Back to Orders</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/user/orders" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground mt-1">
                Order #{order.orderNumber}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <Badge className={paymentStatusColors[order.paymentStatus || 'pending']}>
                {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <OrderProgress status={order.status} />
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName || item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ৳{parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ৳{(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{parseFloat(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping ({order.shippingMethod})</span>
                    <span>৳{parseFloat(order.shippingCost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>৳{parseFloat(order.tax).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>৳{parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {order.customerName && <p className="font-medium text-base">{order.customerName}</p>}
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                  <div className="pt-2">
                    <p>{order.shippingAddressLine1}</p>
                    {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                    <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Info */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2 mt-1">
                    {order.paymentMethod === 'bkash' && (
                      <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-xs">
                        bK
                      </div>
                    )}
                    <span className="font-medium capitalize">{order.paymentMethod || 'N/A'}</span>
                  </div>
                </div>

                {order.paymentMethod === 'bkash' && (
                  <>
                    <Separator />
                    
                    {order.bkashNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">bKash Number</p>
                        <p className="font-medium font-mono">{order.bkashNumber}</p>
                      </div>
                    )}
                    
                    {order.bkashTransactionId && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Transaction ID</p>
                          <p className="font-medium font-mono text-sm break-all">
                            {order.bkashTransactionId}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}

                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                  <Badge className={paymentStatusColors[order.paymentStatus || 'pending']}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                  </Badge>
                </div>

                {order.paymentStatus === 'pending' && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Your payment is being verified. This usually takes a few minutes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-medium font-mono">{order.orderNumber}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt || order.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {order.estimatedDelivery && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your order, please contact our support team.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}