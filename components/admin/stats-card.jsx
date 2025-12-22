import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

export default function StatsCard({ title, value, change, icon: Icon, trend = "up" }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {trend === "up" ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500" />
          )}
          <span className={trend === "up" ? "text-green-500 text-sm" : "text-red-500 text-sm"}>{change}</span>
          <span className="text-muted-foreground text-sm">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
