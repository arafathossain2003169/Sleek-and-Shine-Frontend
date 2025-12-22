"use client"

import { useState } from "react"
import { ArrowLeft, Upload, Plus, Trash2, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock product data
const mockProduct = {
  id: 1,
  name: "Lip Gloss Pro",
  category: "Lips",
  price: 12.99,
  description: "High-shine lip gloss with moisturizing formula",
  stock: 145,
  sku: "LG-PRO-001",
  images: ["/lip-gloss-product.jpg"],
  details: {
    brand: "Sleek & Shine",
    ingredients: "Glycerin, Jojoba Oil, Mica",
    weight: "6g",
    color: "Glossy Pink",
    shelfLife: "24 months",
  },
  attributes: [
    { id: 1, name: "Size", value: "10ml" },
    { id: 2, name: "Finish", value: "Glossy" },
  ],
  reviews: [
    { id: 1, reviewer: "Maria Lopez", rating: 5, comment: "Love this gloss! Best purchase ever.", date: "2024-12-05" },
    {
      id: 2,
      reviewer: "Jessica Park",
      rating: 4,
      comment: "Great quality but wish it lasted longer.",
      date: "2024-12-03",
    },
  ],
  qna: [
    { id: 1, question: "Is it waterproof?", answer: "No, this lip gloss is water-resistant but not waterproof." },
    { id: 2, question: "Does it have SPF?", answer: "No SPF protection, but it has moisturizing properties." },
  ],
}

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(mockProduct)
  const [editingSection, setEditingSection] = useState(null)
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" })
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [editingAttributeId, setEditingAttributeId] = useState(null)

  const handleFieldChange = (section, field, value) => {
    if (section === "basic") {
      setProduct((prev) => ({ ...prev, [field]: value }))
    } else if (section === "details") {
      setProduct((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: value },
      }))
    }
  }

  const handleAddAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      const id = Math.max(...product.attributes.map((a) => a.id), 0) + 1
      setProduct((prev) => ({
        ...prev,
        attributes: [...prev.attributes, { id, ...newAttribute }],
      }))
      setNewAttribute({ name: "", value: "" })
      setShowAddAttribute(false)
    }
  }

  const handleUpdateAttribute = (id, name, value) => {
    setProduct((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr) => (attr.id === id ? { ...attr, name, value } : attr)),
    }))
  }

  const handleDeleteAttribute = (id) => {
    setProduct((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.id !== id),
    }))
    setEditingAttributeId(null)
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
          <h1 className="text-3xl font-bold">Product Details</h1>
          <p className="text-muted-foreground mt-1">Edit {product.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full h-48 bg-muted rounded-lg border-2 border-dashed border-border">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                </div>
              </div>
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <div key={idx} className="w-20 h-20 rounded border border-border bg-muted">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Product ${idx}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="qna">Q&A</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Basic Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === "basic" ? null : "basic")}
                    >
                      {editingSection === "basic" ? "Done" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Product Name</label>
                    <Input
                      value={product.name}
                      onChange={(e) => handleFieldChange("basic", "name", e.target.value)}
                      disabled={editingSection !== "basic"}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleFieldChange("basic", "price", Number.parseFloat(e.target.value))}
                        disabled={editingSection !== "basic"}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stock</label>
                      <Input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleFieldChange("basic", "stock", Number.parseInt(e.target.value))}
                        disabled={editingSection !== "basic"}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Input
                        value={product.category}
                        onChange={(e) => handleFieldChange("basic", "category", e.target.value)}
                        disabled={editingSection !== "basic"}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">SKU</label>
                      <Input
                        value={product.sku}
                        onChange={(e) => handleFieldChange("basic", "sku", e.target.value)}
                        disabled={editingSection !== "basic"}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={product.description}
                      onChange={(e) => handleFieldChange("basic", "description", e.target.value)}
                      disabled={editingSection !== "basic"}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                {/* Product Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Product Details</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSection(editingSection === "details" ? null : "details")}
                      >
                        {editingSection === "details" ? "Done" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(product.details).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                        <Input
                          value={value}
                          onChange={(e) => handleFieldChange("details", key, e.target.value)}
                          disabled={editingSection !== "details"}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Custom Attributes</CardTitle>
                      <Button size="sm" onClick={() => setShowAddAttribute(!showAddAttribute)}>
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
                              placeholder="e.g., Size, Color, Weight"
                              value={newAttribute.name}
                              onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Attribute Value</label>
                            <Input
                              placeholder="e.g., 10ml, Red, 50g"
                              value={newAttribute.value}
                              onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddAttribute} className="flex-1">
                              Add
                            </Button>
                            <Button
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
                      {product.attributes.map((attr) => (
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
                              <Button size="sm" variant="outline" onClick={() => setEditingAttributeId(null)}>
                                Done
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{attr.name}</p>
                                <p className="text-sm text-muted-foreground">{attr.value}</p>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => setEditingAttributeId(attr.id)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive bg-transparent"
                                onClick={() => handleDeleteAttribute(attr.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {product.attributes.length === 0 && !showAddAttribute && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No attributes added yet. Click "Add Attribute" to get started.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm">{review.reviewer}</p>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No reviews yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Q&A Tab */}
            <TabsContent value="qna">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Questions & Answers</CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Q&A
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.qna.map((item) => (
                    <div key={item.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-2">Q: {item.question}</p>
                          <p className="text-sm text-muted-foreground">A: {item.answer}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex gap-3 mt-6">
            <Button className="flex-1">Save Changes</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
