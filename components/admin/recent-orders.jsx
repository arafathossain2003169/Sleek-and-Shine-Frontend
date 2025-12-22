import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockOrders = [
  { id: "#ORD001", customer: "Sarah Johnson", amount: "$45.99", status: "completed", date: "2024-12-10" },
  { id: "#ORD002", customer: "Emma Davis", amount: "$127.50", status: "pending", date: "2024-12-10" },
  { id: "#ORD003", customer: "Olivia Wilson", amount: "$89.99", status: "shipped", date: "2024-12-09" },
  { id: "#ORD004", customer: "Ava Martinez", amount: "$156.00", status: "completed", date: "2024-12-09" },
  { id: "#ORD005", customer: "Sophia Anderson", amount: "$73.50", status: "processing", date: "2024-12-08" },
]

const statusColor = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest 5 orders from your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{order.customer}</p>
                <p className="text-xs text-muted-foreground">
                  {order.id} • {order.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">{order.amount}</p>
                <Badge className={statusColor[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
