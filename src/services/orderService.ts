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
    status: 'confirmed',
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

  if (isSupabaseConfigured) {
    const supabase = getSupabase()!
    const { error } = await supabase.from('orders').insert({
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
      status: 'confirmed',
      shipping_address: order.shippingAddress,
      shipping_method: formData.shippingMethod,
    } as never)

    if (error) throw error
  } else {
    const existing = JSON.parse(localStorage.getItem('mft_orders') ?? '[]') as Order[]
    existing.push(order)
    localStorage.setItem('mft_orders', JSON.stringify(existing))
  }

  return order
}
