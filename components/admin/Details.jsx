"use client"

import { Input } from "@/components/ui/input"

export default function Details({ product, setProduct }) {
  const handleFieldChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Brand</label>
          <Input
            value={product.brand || ""}
            onChange={e => handleFieldChange("brand", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Weight</label>
          <Input
            value={product.weight || ""}
            onChange={e => handleFieldChange("weight", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Color</label>
          <Input
            value={product.color || ""}
            onChange={e => handleFieldChange("color", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Shelf Life</label>
          <Input
            value={product.shelfLife || ""}
            onChange={e => handleFieldChange("shelfLife", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Ingredients</label>
        <textarea
          value={product.ingredients || ""}
          onChange={e => handleFieldChange("ingredients", e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
          rows={3}
        />
      </div>
    </div>
  )
}
