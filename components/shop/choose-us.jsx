import { Button } from "@/components/ui/button"

export default function ChooseUs() {
    return (
        <>
      <div className="bg-muted py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Sleek & Shine</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-3">100%</div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Hand-selected products from trusted brands worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-3">✓</div>
              <h3 className="font-semibold mb-2">Expert Tested</h3>
              <p className="text-muted-foreground">All products verified and recommended by beauty experts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick shipping with tracking to your doorstep</p>
            </div>
          </div>
        </div>
      </div>
      {/* Trust Section */}
      <div className="bg-muted py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-sm mb-4">
                "Amazing quality products and incredible customer service! I've been ordering from Sleek & Shine for
                over a year now."
              </p>
              <p className="font-semibold text-sm">- Sarah Johnson</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-sm mb-4">
                "Fast shipping and every product arrived in perfect condition. The prices are competitive too!"
              </p>
              <p className="font-semibold text-sm">- Emma Williams</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
