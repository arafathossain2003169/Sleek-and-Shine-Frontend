"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productApi } from "@/lib/api/products"
import { categoryApi } from "@/lib/api/categories"
import { uploadApi } from "@/lib/api/upload"
import { ArrowLeft, Upload, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AddProductPage() {
  const router = useRouter()
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    categoryId: "",
    brand: "",
    ingredients: "",
    weight: "",
    color: "",
    shelfLife: "",
  })
  
  const [images, setImages] = useState([])
  const [attributes, setAttributes] = useState([])
  const [categories, setCategories] = useState([])
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" })
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [editingAttributeId, setEditingAttributeId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleFieldChange = (section, field, value) => {
    if (section === "basic") {
      setProduct((prev) => ({ ...prev, [field]: value }))
      // Clear error for this field
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      setUploading(true)
      const response = await uploadApi.uploadImages(files)
      
      if (response.success) {
        setImages(prev => [...prev, ...response.data])
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) {
      alert('Please enter both attribute name and value')
      return
    }

    const id = Date.now()
    setAttributes(prev => [...prev, { id, ...newAttribute }])
    setNewAttribute({ name: "", value: "" })
    setShowAddAttribute(false)
  }

  const handleUpdateAttribute = (id, name, value) => {
    setAttributes(prev =>
      prev.map(attr => (attr.id === id ? { ...attr, name, value } : attr))
    )
  }

  const handleDeleteAttribute = (id) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id))
    setEditingAttributeId(null)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!product.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!product.stock || parseInt(product.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }
    if (!product.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)

      const productData = {
        name: product.name.trim(),
        description: product.description.trim(),
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
        stock: parseInt(product.stock),
        sku: product.sku.trim() || null,
        categoryId: parseInt(product.categoryId),
        brand: product.brand.trim() || null,
        ingredients: product.ingredients.trim() || null,
        weight: product.weight.trim() || null,
        color: product.color.trim() || null,
        shelfLife: product.shelfLife.trim() || null,
        images: images.map((img, index) => ({
          url: img.url,
          cloudinaryId: img.cloudinaryId,
          isPrimary: index === 0,
          displayOrder: index
        })),
        attributes: attributes.map(attr => ({
          name: attr.name,
          value: attr.value
        }))
      }

      const response = await productApi.create(productData)
      
      if (response.success) {
        alert('Product created successfully!')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-center w-full h-48 bg-muted rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-muted/80 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'animate-pulse' : ''} text-muted-foreground`} />
                    <p className="text-sm text-muted-foreground">
                      {uploading ? 'Uploading...' : 'Click to upload images'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </label>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-full aspect-square rounded border border-border bg-muted group">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {images.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    No images uploaded yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details & Attributes</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Product Name *</label>
                      <Input
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={(e) => handleFieldChange("basic", "name", e.target.value)}
                        className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price *</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={product.price}
                          onChange={(e) => handleFieldChange("basic", "price", e.target.value)}
                          className={`mt-1 ${errors.price ? 'border-destructive' : ''}`}
                        />
                        {errors.price && (
                          <p className="text-xs text-destructive mt-1">{errors.price}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Original Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={product.originalPrice}
                          onChange={(e) => handleFieldChange("basic", "originalPrice", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Stock *</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={product.stock}
                          onChange={(e) => handleFieldChange("basic", "stock", e.target.value)}
                          className={`mt-1 ${errors.stock ? 'border-destructive' : ''}`}
                        />
                        {errors.stock && (
                          <p className="text-xs text-destructive mt-1">{errors.stock}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">SKU</label>
                        <Input
                          placeholder="Enter product SKU"
                          value={product.sku}
                          onChange={(e) => handleFieldChange("basic", "sku", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <select
                        value={product.categoryId}
                        onChange={(e) => handleFieldChange("basic", "categoryId", e.target.value)}
                        className={`mt-1 w-full px-3 py-2 border rounded-md bg-background text-foreground ${
                          errors.categoryId ? 'border-destructive' : 'border-border'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <p className="text-xs text-destructive mt-1">{errors.categoryId}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        placeholder="Enter product description"
                        value={product.description}
                        onChange={(e) => handleFieldChange("basic", "description", e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <div className="space-y-6">
                  {/* Product Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Brand</label>
                          <Input
                            placeholder="Enter brand name"
                            value={product.brand}
                            onChange={(e) => handleFieldChange("basic", "brand", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Weight</label>
                          <Input
                            placeholder="e.g., 30ml, 50g"
                            value={product.weight}
                            onChange={(e) => handleFieldChange("basic", "weight", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Color</label>
                          <Input
                            placeholder="e.g., Natural Beige"
                            value={product.color}
                            onChange={(e) => handleFieldChange("basic", "color", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Shelf Life</label>
                          <Input
                            placeholder="e.g., 24 months"
                            value={product.shelfLife}
                            onChange={(e) => handleFieldChange("basic", "shelfLife", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Ingredients</label>
                        <textarea
                          placeholder="Enter ingredients"
                          value={product.ingredients}
                          onChange={(e) => handleFieldChange("basic", "ingredients", e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attributes */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Custom Attributes</CardTitle>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setShowAddAttribute(!showAddAttribute)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Attribute
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Add New Attribute Form */}
                      {showAddAttribute && (
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Attribute Name</label>
                              <Input
                                placeholder="e.g., Size, Finish"
                                value={newAttribute.name}
                                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Attribute Value</label>
                              <Input
                                placeholder="e.g., 10ml, Glossy"
                                value={newAttribute.value}
                                onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" size="sm" onClick={handleAddAttribute} className="flex-1">
                                Add
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setShowAddAttribute(false)
                                  setNewAttribute({ name: "", value: "" })
                                }}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attributes List */}
                      <div className="space-y-3">
                        {attributes.map((attr) => (
                          <div key={attr.id} className="p-3 border border-border rounded-lg flex items-center gap-3">
                            {editingAttributeId === attr.id ? (
                              <>
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Attribute name"
                                    value={attr.name}
                                    onChange={(e) => handleUpdateAttribute(attr.id, e.target.value, attr.value)}
                                  />
                                  <Input
                                    placeholder="Attribute value"
                                    value={attr.value}
                                    onChange={(e) => handleUpdateAttribute(attr.id, attr.name, e.target.value)}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingAttributeId(null)}
                                >
                                  Done
                                </Button>
                              </>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{attr.name}</p>
                                  <p className="text-sm text-muted-foreground">{attr.value}</p>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingAttributeId(attr.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => handleDeleteAttribute(attr.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {attributes.length === 0 && !showAddAttribute && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No attributes added yet. Click "Add Attribute" to get started.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1" disabled={submitting || uploading}>
                {submitting ? 'Creating...' : 'Create Product'}
              </Button>
              <Link href="/admin/products" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}