"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Images from "@/components/admin/Images"
import BasicInfo from "@/components/admin/BasicInfo"
import Details from "@/components/admin/Details"
import Attributes from "@/components/admin/Attributes"
import { productApi } from "@/lib/api/products"

export default function ProductDetailClient({ product: initialProduct, categories }) {
  const router = useRouter()

  const [product, setProduct] = useState(initialProduct)
  const [images, setImages] = useState(initialProduct.images || [])
  const [attributes, setAttributes] = useState(initialProduct.attributes || [])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const productData = {
        ...product,
        images,
        attributes,
      }
      await productApi.update(product.id, productData)
      alert("Product updated successfully")
      router.push("/admin/products")
    } catch (err) {
      console.error(err)
      alert("Failed to save product")
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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product details for {product.name}</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <Images images={images} setImages={setImages} />

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details & Attributes</TabsTrigger>
              </TabsList>

              {/* Basic Info */}
              <TabsContent value="basic">
                <BasicInfo
                  product={product}
                  setProduct={setProduct}
                  categories={categories}
                  errors={errors}
                  setErrors={setErrors}
                />
              </TabsContent>

              {/* Details & Attributes */}
              <TabsContent value="details">
                <div className="space-y-6">
                  <Details product={product} setProduct={setProduct} />
                  <Attributes attributes={attributes} setAttributes={setAttributes} />
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
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
