// lib/api/shop.js
import { apiClient } from './config'

export const shopApi = {
  // Fetch all categories with product counts
  getCategories: async () => {
    try {
      const data = await apiClient('/shop/categories')
      return data
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      return []
    }
  },

  // Fetch all brands with product counts
  getBrands: async () => {
    try {
      const data = await apiClient('/shop/brands')
      return data
    } catch (err) {
      console.error('Failed to fetch brands:', err)
      return []
    }
  },

  // Fetch products with filters
  getFilteredProducts: async ({ categories = [], brands = [], minPrice = 0, maxPrice = 10000 } = {}) => {
  try {
    // Ensure arrays
    const categoryArray = Array.isArray(categories) ? categories : categories?.split(",") || []
    const brandArray = Array.isArray(brands) ? brands : brands?.split(",") || []

    const params = new URLSearchParams()
    categoryArray.forEach(c => params.append('categories', c))
    brandArray.forEach(b => params.append('brands', b))
    params.append('minPrice', minPrice)
    params.append('maxPrice', maxPrice)

    const data = await apiClient(`/shop/products?${params.toString()}`)
    return data
  } catch (err) {
    console.error('Failed to fetch filtered products:', err)
    return []
  }
}

}
