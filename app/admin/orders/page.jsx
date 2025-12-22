"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { orderApi } from "@/lib/api/orders"
import { Search, Eye, MoreVertical, Phone, CreditCard } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

/* ----------------------------------------
   Status helpers
----------------------------------------- */
const STATUS_STEPS = ["pending", "processing", "shipped", "completed"]

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

/* ----------------------------------------
   Progress Bar
----------------------------------------- */
function OrderProgress({ status }) {
  const currentStep = STATUS_STEPS.indexOf(status)

  if (currentStep === -1) return null

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{
            width: `${((currentStep + 1) / STATUS_STEPS.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

/* ----------------------------------------
   Page
----------------------------------------- */
export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [stats, setStats] = useState({})
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ---------- Auth + Admin guard ---------- */
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  /* ---------- Initial fetch ---------- */
  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders()
      fetchStats()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setPageLoading(true)
      const res = await orderApi.getAll()
      setOrders(res.data.orders || [])
    } catch (err) {
      setError("Failed to fetch orders")
    } finally {
      setPageLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await orderApi.getStats()
      setStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status)
      await fetchOrders()
      await fetchStats()
    } catch {
      alert("Failed to update order status")
    }
  }

  /* ---------- Filters ---------- */
  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bkashNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus =
      filter === "all" || order.status === filter

    return matchSearch && matchStatus
  })

  /* ---------- Loading ---------- */
  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading orders...
      </div>
    )
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchOrders} className="mt-4">Retry</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.totalOrders || orders.length} />
        <StatCard label="Completed" value={stats.completedOrders || 0} />
        <StatCard label="Pending" value={stats.pendingOrders || 0} />
        <StatCard
          label="Revenue"
          value={`৳${Number(stats.totalRevenue || 0).toFixed(2)}`}
        />
      </div>

      {/* Orders table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders List</CardTitle>
          <CardDescription>
            {filteredOrders.length} orders
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Search + Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by order number, customer, phone, or bKash number..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border rounded px-3 min-w-[140px]"
            >
              <option value="all">All Status</option>
              {STATUS_STEPS.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Order #</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Progress</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{order.orderNumber}</td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium">{order.customerName}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{order.customerPhone}</span>
                          </div>
                          {order.customerEmail && (
                            <p className="text-xs text-muted-foreground">
                              {order.customerEmail}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-pink-600" />
                            <span className="text-xs font-medium">bKash</span>
                          </div>
                          {order.bkashNumber && (
                            <p className="text-xs text-muted-foreground">
                              {order.bkashNumber}
                            </p>
                          )}
                          {order.bkashTransactionId && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {order.bkashTransactionId}
                            </p>
                          )}
                          <Badge 
                            className={`text-[10px] ${paymentStatusColor[order.paymentStatus || 'pending']}`}
                          >
                            {order.paymentStatus || 'pending'}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3 font-semibold">
                        ৳{parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Badge className={statusColor[order.status]}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-3 w-48">
                        <OrderProgress status={order.status} />
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>

                            <div className="border-t my-1" />
                            
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              Update Status
                            </div>
                            
                            {STATUS_STEPS.map(s => (
                              <DropdownMenuItem
                                key={s}
                                onClick={() => handleUpdateStatus(order.id, s)}
                                disabled={order.status === s}
                              >
                                Mark as {s}
                              </DropdownMenuItem>
                            ))}
                            
                            <div className="border-t my-1" />
                            
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              className="text-red-600"
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ----------------------------------------
   Small stat card
----------------------------------------- */
function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  )
}