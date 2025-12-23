import ProductDetailClient from "@/components/admin/ProductDetailClient"
import { productApi } from "@/lib/api/products"
import { categoryApi } from "@/lib/api/categories"

export default async function ProductDetailPage({ params }) {
  const { id: productId } = await params

  try {
    const [resProduct, resCategories] = await Promise.all([
      productApi.getById(productId),
      categoryApi.getAll(),
    ])

    const product = resProduct.data || resProduct
    const categories = resCategories.data || []

    return <ProductDetailClient product={product} categories={categories} />
  } catch (err) {
    console.error("Failed to load product or categories", err)
    return <p>Failed to load product data</p>
  }
}
