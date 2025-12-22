// components/checkout/OrderSuccess.jsx
import { Card } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"

export default function OrderSuccess() {
  return (
    <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
      <div className="flex items-center gap-2 mb-4">
        <Check className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
          Order Complete!
        </h3>
      </div>
      <p className="text-green-800 dark:text-green-200 mb-4">
        Thank you for your order. We will verify your bKash payment and send you an email confirmation shortly.
      </p>
      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Redirecting to order confirmation...</span>
      </div>
    </Card>
  )
}