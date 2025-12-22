// /app/shop/search/SearchProductsClient.jsx
"use client";

import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";

export default function SearchProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!products.length) return <p className="p-4">No products found.</p>;

  return (
    <div className="p-8 md:p-10 lg:p-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}
