import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart()
  const { showToast } = useToast()
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return
    addItem(product)
    showToast(`${product.name} added to cart`)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-ocean-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.featured && <Badge variant="default">Featured</Badge>}
          {discount && <Badge variant="sale">-{discount}%</Badge>}
          {!product.inStock && <Badge variant="warning">Out of Stock</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ocean-500">
          {CATEGORY_LABELS[product.category]}
        </span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-ocean-600 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <span className="font-display text-xl font-bold text-ocean-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="ml-2 text-sm text-ocean-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant={isInCart(product.id) ? 'secondary' : 'primary'}
            onClick={handleAdd}
            disabled={!product.inStock}
            leftIcon={<ShoppingCart size={16} />}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.inStock ? (isInCart(product.id) ? 'Added' : 'Add') : 'Sold Out'}
          </Button>
        </div>
      </div>
    </article>
  )
}
