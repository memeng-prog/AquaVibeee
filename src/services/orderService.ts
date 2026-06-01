import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { generateOrderId } from '@/lib/utils'
import type { CartItem, CheckoutFormData, Order } from '@/types'
import { calculateCartTotals } from '@/lib/utils'

export async function createOrder(
  items: CartItem[],
  formData: CheckoutFormData,
): Promise<Order> {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const { shipping, tax, total } = calculateCartTotals(subtotal, formData.shippingMethod)

  const order: Order = {
    id: generateOrderId(),
    items,
    subtotal,
    shipping,
    tax,
    total,
    status: 'pending',
    shippingAddress: {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
    },
    shippingMethod: formData.shippingMethod,
    createdAt: new Date().toISOString(),
  }

  const persistLocally = () => {
    const existing = JSON.parse(localStorage.getItem('mft_orders') ?? '[]') as Order[]
    existing.push(order)
    localStorage.setItem('mft_orders', JSON.stringify(existing))
  }

  if (isSupabaseConfigured) {
    const supabase = getSupabase()!

    const richPayload = {
      items: items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image_url: i.product.imageUrl,
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
      shipping_address: order.shippingAddress,
      shipping_method: formData.shippingMethod,
    } as never

    // Some dev schemas only have total/status/created_at, so try the full payload first,
    // then fall back to a minimal payload, then finally localStorage.
    const fullInsert = await supabase.from('orders').insert(richPayload)
    if (!fullInsert.error) {
      return order
    }

    console.error('createOrder rich insert failed:', fullInsert.error)

    const minimalInsert = await supabase
      .from('orders')
      .insert({ total, status: 'pending' } as never)

    if (!minimalInsert.error) {
      return order
    }

    console.error('createOrder minimal insert failed:', minimalInsert.error)
    persistLocally()
    return order
  }

  persistLocally()

  return order
}
