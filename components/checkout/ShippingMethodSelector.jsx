// components/checkout/ShippingMethodSelector.jsx
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check } from "lucide-react"

export default function ShippingMethodSelector({ 
  selectedMethod, 
  onChange, 
  onContinue,
  onBack,
  currentStep,
  disabled = false 
}) {
  const shippingMethods = [
    {
      value: "standard",
      title: "Standard Shipping",
      description: "3-5 business days",
      price: 0
    },
    {
      value: "express",
      title: "Express Shipping",
      description: "1-2 business days",
      price: 15
    }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
          </span>
          Shipping Method
        </h2>
      </div>

      {currentStep >= 2 && currentStep !== 4 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {shippingMethods.map((method) => (
              <label
                key={method.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.value 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:bg-muted"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input 
                  type="radio" 
                  name="shipping" 
                  value={method.value}
                  checked={selectedMethod === method.value}
                  onChange={onChange}
                  className="w-4 h-4"
                  disabled={disabled}
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium">{method.title}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <span className="font-semibold">
                  {method.price === 0 ? "Free" : `৳${method.price.toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>

          {currentStep === 2 && (
            <div className="pt-4 flex gap-2">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button onClick={onContinue} className="flex-1">
                Continue to Payment <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}