"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { shopApi } from "@/lib/api/shop";
import ProductCard from "@/components/shop/ProductCard";

function SearchResults({ searchParams }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categories = searchParams.get("categories")?.split(",") || [];
        const brands = searchParams.get("brands")?.split(",") || [];
        const minPrice = Number(searchParams.get("minPrice") || 0);
        const maxPrice = Number(searchParams.get("maxPrice") || 10000);

        // Redirect if no filters selected
        if (
          !categories.length &&
          !brands.length &&
          !searchParams.get("minPrice") &&
          !searchParams.get("maxPrice")
        ) {
          router.push("/shop");
          return;
        }

        const data = await shopApi.getFilteredProducts({
          categories,
          brands,
          minPrice,
          maxPrice,
        });
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams.toString(), router]);

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

export default function SearchPage() {
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<p className="p-4">Loading search results...</p>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
