"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import { productApi } from "@/lib/api/products";
import { cartApi } from "@/lib/api/cart";
import { wishlistApi } from "@/lib/api/wishlist";
import { Star, Heart, Truck, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Helper function for session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export default function ProductPage({ params }) {
  const { id } = use(params);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getById(id);

        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      const sessionId = getSessionId();
      
      await cartApi.add({
        userId: null, // Will be updated when auth is added
        sessionId: sessionId,
        productId: product.id,
        quantity,
      });
      
      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    try {
      // TODO: Add real user ID when auth is implemented
      const userId = 1; // Placeholder
      
      if (isWishlisted) {
        // Remove from wishlist
        // await wishlistApi.remove(wishlistItemId);
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        // await wishlistApi.add(userId, product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <a href="/shop">Back to Shop</a>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Get images array (handle both array and object with imageUrl)
  const images = product.images?.length > 0 
    ? product.images.map(img => img.imageUrl || img) 
    : ['/placeholder.svg'];

  // Build details array from product data
  const productDetails = [
    product.brand && { label: 'Brand', value: product.brand },
    product.weight && { label: 'Weight', value: product.weight },
    product.color && { label: 'Color', value: product.color },
    product.sku && { label: 'SKU', value: product.sku },
    product.shelfLife && { label: 'Shelf Life', value: product.shelfLife },
    product.ingredients && { label: 'Ingredients', value: product.ingredients },
  ].filter(Boolean);

  // Add custom attributes
  if (product.attributes?.length > 0) {
    product.attributes.forEach(attr => {
      productDetails.push({
        label: attr.attributeName,
        value: attr.attributeValue
      });
    });
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Product Images + Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden h-96 md:h-[500px]">
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {product.category?.name || 'Uncategorized'}
                  </p>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleWishlist}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                      />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {Number(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${Number(product.originalPrice).toFixed(2)}
                  </span>
                  <span className="text-sm bg-destructive/10 text-destructive px-2 py-1 rounded">
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm text-destructive">Out of Stock</span>
                </>
              )}
            </div>

            <Separator />

            {/* Quantity + Add to Cart */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={addingToCart}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                  className="w-16 border-0 text-center focus-visible:ring-0"
                  min="1"
                  max={product.stock}
                  disabled={addingToCart}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={addingToCart}
                >
                  +
                </Button>
              </div>

              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>

            {/* Benefits Card */}
            <Card className="p-4 space-y-3 bg-muted/50">
              <div className="flex gap-3">
                <Truck className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <RotateCcw className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day return policy</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Shield className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">Encrypted transactions</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviewCount || 0})
            </TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            {productDetails.length > 0 ? (
              <div className="space-y-2">
                {productDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-3 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground font-medium">
                      {detail.label}
                    </span>
                    <span className="text-sm">{detail.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No additional details available for this product.
              </p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.reviewerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3"
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 space-y-2">
            <p className="text-sm"><strong>Standard Shipping:</strong> 3-5 business days</p>
            <p className="text-sm"><strong>Express Shipping:</strong> 1-2 business days</p>
            <p className="text-sm text-muted-foreground mt-4">
              Free shipping available on orders over $50
            </p>
          </TabsContent>
        </Tabs>

        {/* Q&A Section */}
        {product.qna && product.qna.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Questions & Answers</h2>
            <div className="space-y-4">
              {product.qna.map((qa) => (
                <Card key={qa.id} className="p-4">
                  <p className="font-semibold text-sm mb-2">Q: {qa.question}</p>
                  {qa.answer && (
                    <p className="text-sm text-muted-foreground">A: {qa.answer}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}