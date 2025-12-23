"use client"

import { Input } from "@/components/ui/input"

export default function BasicInfo({ product, setProduct, categories, errors, setErrors }) {
  const handleFieldChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Product Name *</label>
        <Input
          value={product.name}
          onChange={e => handleFieldChange("name", e.target.value)}
          className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Price *</label>
          <Input
            type="number"
            value={product.price}
            onChange={e => handleFieldChange("price", e.target.value)}
            className={`mt-1 ${errors.price ? 'border-destructive' : ''}`}
          />
          {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Original Price</label>
          <Input
            type="number"
            value={product.originalPrice || ""}
            onChange={e => handleFieldChange("originalPrice", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Stock *</label>
          <Input
            type="number"
            value={product.stock}
            onChange={e => handleFieldChange("stock", e.target.value)}
            className={`mt-1 ${errors.stock ? 'border-destructive' : ''}`}
          />
          {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">SKU</label>
          <Input
            value={product.sku || ""}
            onChange={e => handleFieldChange("sku", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Category *</label>
        <select
          value={product.categoryId || ""}
          onChange={e => handleFieldChange("categoryId", e.target.value)}
          className={`mt-1 w-full px-3 py-2 border rounded-md bg-background ${
            errors.categoryId ? 'border-destructive' : 'border-border'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={product.description || ""}
          onChange={e => handleFieldChange("description", e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
          rows={4}
        />
      </div>
    </div>
  )
}
