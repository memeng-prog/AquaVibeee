import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { fetchProductBySlug } from '@/services/productService'
import type { Product } from '@/types'
import { Check, Minus, Plus, ShoppingCart, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()
  const { showToast } = useToast()

  const loading = Boolean(slug && resolvedSlug !== slug)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetchProductBySlug(slug).then((p) => {
      if (!cancelled) {
        setProduct(p)
        setResolvedSlug(slug)
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="py-20 mx-auto max-w-7xl px-4 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl bg-ocean-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-ocean-100 rounded" />
            <div className="h-4 w-full bg-ocean-100 rounded" />
            <div className="h-12 w-1/3 bg-ocean-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ocean-900">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-ocean-600 hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const images = product.gallery.length > 0 ? product.gallery : [product.imageUrl]
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null

  const handleAdd = () => {
    if (!product.inStock) return
    addItem(product, quantity)
    showToast(`${quantity}× ${product.name} added to cart`)
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-ocean-500">
          <Link to="/" className="hover:text-ocean-700">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-ocean-700">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-ocean-800">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-ocean-50 shadow-soft">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      activeImage === i ? 'border-ocean-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{CATEGORY_LABELS[product.category]}</Badge>
              {discount && <Badge variant="sale">Save {discount}%</Badge>}
              {!product.inStock && <Badge variant="warning">Out of Stock</Badge>}
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold text-ocean-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-ocean-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-ocean-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 text-ocean-600 leading-relaxed">{product.longDescription}</p>

            <ul className="mt-6 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ocean-700">
                  <Check size={16} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-ocean-50 p-5 text-sm">
              {product.capacityLiters > 0 && (
                <div>
                  <dt className="text-ocean-500">Capacity</dt>
                  <dd className="font-semibold text-ocean-900">{product.capacityLiters}L</dd>
                </div>
              )}
              <div>
                <dt className="text-ocean-500">Dimensions</dt>
                <dd className="font-semibold text-ocean-900">{product.dimensions}</dd>
              </div>
              <div>
                <dt className="text-ocean-500">Material</dt>
                <dd className="font-semibold text-ocean-900">{product.material}</dd>
              </div>
              <div>
                <dt className="text-ocean-500">Availability</dt>
                <dd className="font-semibold text-ocean-900">
                  {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                </dd>
              </div>
            </dl>

            {product.inStock && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-xl border border-ocean-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-ocean-600 hover:bg-ocean-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(q + 1, product.stockCount || 99))
                    }
                    className="p-3 text-ocean-600 hover:bg-ocean-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <Button size="lg" onClick={handleAdd} leftIcon={<ShoppingCart size={20} />}>
                  Add to Cart
                </Button>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-ocean-600">
              <Truck size={18} />
              Free shipping on orders over $299
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
