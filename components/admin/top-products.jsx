import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const mockProducts = [
  { id: 1, name: "Lip Gloss", sales: 342, revenue: "$2,432" },
  { id: 2, name: "Foundation", sales: 298, revenue: "$4,470" },
  { id: 3, name: "Eye Shadow", sales: 256, revenue: "$1,280" },
  { id: 4, name: "Mascara", sales: 189, revenue: "$1,512" },
]

export default function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Top Products
        </CardTitle>
        <CardDescription>Best sellers this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProducts.map((product) => (
            <div key={product.id} className="flex items-justify-between py-2 border-b border-border last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} sales</p>
              </div>
              <p className="font-semibold text-sm text-primary">{product.revenue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
