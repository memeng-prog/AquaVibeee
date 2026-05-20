import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-ocean-300" />
        <h1 className="mt-6 font-display text-2xl font-bold text-ocean-900">Your cart is empty</h1>
        <p className="mt-2 text-ocean-600">Discover our premium aquarium collection.</p>
        <Link to="/shop" className="mt-8 inline-block">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-ocean-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-ocean-500 hover:text-coral-600 transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <article
                key={product.id}
                className="flex gap-4 sm:gap-6 rounded-2xl bg-white p-4 sm:p-6 shadow-soft"
              >
                <Link to={`/product/${product.slug}`} className="shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-display font-semibold text-ocean-900 hover:text-ocean-600"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-ocean-500">{formatPrice(product.price)} each</p>
                    <p className="mt-2 font-semibold text-ocean-900">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-ocean-200">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-2 text-ocean-600 hover:bg-ocean-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-2 text-ocean-600 hover:bg-ocean-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-2 text-ocean-400 hover:text-coral-600"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div>
            <CartSummary subtotal={subtotal} />
            <Link to="/shop" className="mt-4 block text-center text-sm text-ocean-600 hover:text-ocean-800">
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
