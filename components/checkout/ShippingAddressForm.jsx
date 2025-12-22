// components/checkout/ShippingAddressForm.jsx
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check } from "lucide-react"

export default function ShippingAddressForm({ 
  formData, 
  onChange, 
  onContinue, 
  currentStep,
  disabled = false 
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
          </span>
          Shipping Address
        </h2>
      </div>

      {currentStep >= 1 && currentStep !== 4 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                value={formData.firstName}
                onChange={onChange}
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                placeholder="Doe"
                value={formData.lastName}
                onChange={onChange}
                disabled={disabled}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              id="phone" 
              placeholder="+880 1XXX-XXXXXX"
              value={formData.phone}
              onChange={onChange}
              disabled={disabled}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input 
              id="address" 
              placeholder="House/Flat, Road, Area"
              value={formData.address}
              onChange={onChange}
              disabled={disabled}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input 
                id="city" 
                placeholder="Dhaka"
                value={formData.city}
                onChange={onChange}
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State/Division *</Label>
              <Input 
                id="state" 
                placeholder="Dhaka"
                value={formData.state}
                onChange={onChange}
                disabled={disabled}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zip">Postal Code *</Label>
              <Input 
                id="zip" 
                placeholder="1200"
                value={formData.zip}
                onChange={onChange}
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input 
                id="country" 
                placeholder="Bangladesh"
                value={formData.country}
                onChange={onChange}
                disabled={disabled}
                required
              />
            </div>
          </div>

          {currentStep === 1 && (
            <div className="pt-4">
              <Button onClick={onContinue} className="w-full">
                Continue to Shipping Method <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}