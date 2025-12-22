// components/checkout/OrderSummary.jsx
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function OrderSummary({ cartItems, shippingCost }) {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0)
    const quantity = item.quantity || 0
    return sum + (price * quantity)
  }, 0)
  
  const shipping = shippingCost || 0
  const tax = (subtotal + shipping) * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card className="p-6 sticky top-20">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-80 overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.product?.images && item.product.images.length > 0 && item.product.images[0].imageUrl ? (
                <img 
                  src={item.product.images[0].imageUrl} 
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded border border-border"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                <p className="text-sm font-semibold mt-1">
                  ৳{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No items in cart</p>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>৳{tax.toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>৳{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Cart item count */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
        </p>
      </div>
    </Card>
  )
}