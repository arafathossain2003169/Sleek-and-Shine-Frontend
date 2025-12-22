// components/checkout/BkashPaymentForm.jsx
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check, Loader2, Info } from "lucide-react"

export default function BkashPaymentForm({ 
  bkashNumber,
  transactionId,
  onChange,
  onComplete,
  onBack,
  currentStep,
  isProcessing = false
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
          </span>
          Payment Method
        </h2>
      </div>

      {currentStep >= 3 && currentStep !== 4 && (
        <div className="space-y-4">
          {/* Bkash Info */}
          <div className="bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-900 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-xl">
                  bKash
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-1">
                  Payment Instructions
                </h3>
                <ol className="text-sm text-pink-800 dark:text-pink-200 space-y-1 list-decimal list-inside">
                  <li>Open your bKash app</li>
                  <li>Send Money to: <span className="font-semibold">01770-444219</span></li>
                  <li>Enter the total amount shown in order summary</li>
                  <li>Complete the transaction</li>
                  <li>Enter your bKash number and transaction ID below</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="bkashNumber">Your bKash Number *</Label>
              <Input 
                id="bkashNumber" 
                type="tel"
                placeholder="01XXX-XXXXXX" 
                value={bkashNumber}
                onChange={(e) => onChange('bkashNumber', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the number you used to send money
              </p>
            </div>

            <div>
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input 
                id="transactionId" 
                placeholder="8N7A5D2F3G" 
                value={transactionId}
                onChange={(e) => onChange('transactionId', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                You'll receive this in the confirmation message from bKash
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="flex gap-2 p-3 bg-muted rounded-lg">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Your order will be processed after we verify your payment. This usually takes a few minutes.
            </p>
          </div>

          {currentStep === 3 && (
            <div className="pt-4 flex gap-2">
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="flex-1"
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                onClick={onComplete}
                className="flex-1"
                disabled={isProcessing || !bkashNumber || !transactionId}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Order
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}