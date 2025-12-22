// components/checkout/CheckoutSteps.jsx
import { Check } from "lucide-react"

export default function CheckoutSteps({ currentStep }) {
  const steps = [
    { number: 1, title: "Shipping Address" },
    { number: 2, title: "Shipping Method" },
    { number: 3, title: "Payment" }
  ]

  return (
    <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep >= step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                currentStep >= step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-2 transition-colors ${
                currentStep > step.number ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}