"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { orderApi } from "@/lib/api/orders"
import { ArrowLeft, Package, MapPin, CreditCard, Phone, Mail, Calendar, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const statusColor = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const paymentStatusColor = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "completed", "cancelled"]
const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"]

export default function OrderDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id

  const [order, setOrder] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin" && orderId) {
      fetchOrder()
    }
  }, [user, orderId])

  const fetchOrder = async () => {
    try {
      setPageLoading(true)
      const res = await orderApi.getById(orderId)
      setOrder(res.data)
    } catch (err) {
      setError("Failed to fetch order details")
    } finally {
      setPageLoading(false)
    }
  }

  const handleUpdateStatus = async (status) => {
    try {
      await orderApi.updateStatus(orderId, status)
      await fetchOrder()
    } catch (err) {
      console.error('Update status error:', err)
      alert("Failed to update order status")
    }
  }

  const handleUpdatePaymentStatus = async (paymentStatus) => {
    try {
      await orderApi.updatePaymentStatus(orderId, paymentStatus)
      await fetchOrder()
    } catch (err) {
      console.error('Update payment status error:', err)
      alert("Failed to update payment status")
    }
  }

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading order details...
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500">{error || "Order not found"}</p>
        <Button onClick={fetchOrder} className="mt-4">Retry</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground mt-1">
              Order #{order.orderNumber}
            </p>
          </div>
        </div>
        <Badge className={`${statusColor[order.status]} text-sm px-3 py-1`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
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
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
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
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.customerName}</p>
                <p>{order.shippingAddressLine1}</p>
                {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                <p>{order.shippingCountry}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
              {order.customerEmail && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </p>
                    <p className="font-medium text-sm">{order.customerEmail}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    bK
                  </div>
                  <span className="font-medium">bKash</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">bKash Number</p>
                <p className="font-medium font-mono">{order.bkashNumber || 'N/A'}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium font-mono text-sm break-all">
                  {order.bkashTransactionId || 'N/A'}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                <Badge className={paymentStatusColor[order.paymentStatus || 'pending']}>
                  {order.paymentStatus || 'pending'}
                </Badge>
              </div>

              {order.paymentStatus === 'pending' && (
                <Button 
                  onClick={() => handleUpdatePaymentStatus('paid')} 
                  className="w-full mt-2"
                  variant="outline"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(status => (
                  <Button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    variant={order.status === status ? "default" : "outline"}
                    className="w-full justify-start"
                    disabled={order.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Meta */}
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
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(order.createdAt || order.created_at).toLocaleString()}
                </p>
              </div>
              {order.estimatedDelivery && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}