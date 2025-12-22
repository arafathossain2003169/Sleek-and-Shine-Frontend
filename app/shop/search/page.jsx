// /app/shop/search/page.jsx
import { notFound } from "next/navigation";
import SearchProductsClient from "./SearchProductsClient";

// Server Component
export default async function SearchPage({ searchParams }) {
  // Extract query params server-side
  const categories = searchParams.categories?.split(",") || [];
  const brands = searchParams.brands?.split(",") || [];
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || 10000;

  // If no filters selected, redirect to /shop
  if (!categories.length && !brands.length && !searchParams.minPrice && !searchParams.maxPrice) {
    notFound(); // Can also redirect if you prefer
  }

  // Fetch products server-side
  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/shop/filtered-products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories, brands, minPrice, maxPrice }),
      cache: "no-store", // Ensure fresh data
    });

    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return <SearchProductsClient initialProducts={products} />;
}
