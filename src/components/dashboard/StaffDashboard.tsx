import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Order } from '@/types';

type StaffDashboardProps = {
  userName?: string
  userEmail?: string
}

const LOCAL_ORDERS_KEY = 'mft_orders'

function getLocalOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) ?? '[]') as Order[]
  } catch {
    return []
  }
}

function saveLocalOrders(orders: Order[]) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
}

export function StaffDashboard({ userName, userEmail }: StaffDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayName = (() => {
    if (userName?.trim()) return userName.trim()
    const emailPrefix = (userEmail || '').split('@')[0]?.trim()
    if (!emailPrefix) return 'there'
    return emailPrefix
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  })()

  async function loadOrders() {
    setLoading(true);
    const supabase = getSupabase();
    const localOrders = getLocalOrders()

    if (!supabase) {
      setOrders(localOrders)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load orders', error);
      setOrders(localOrders)
    } else {
      const supabaseOrders = (data ?? []) as Order[]
      // Merge in local fallback orders so checkout completed with localStorage still appears here.
      const merged = [...supabaseOrders]
      for (const order of localOrders) {
        if (!merged.some((existing) => existing.id === order.id)) {
          merged.push(order)
        }
      }
      merged.sort((a, b) => new Date(b.createdAt || (b as any).created_at).getTime() - new Date(a.createdAt || (a as any).created_at).getTime())
      setOrders(merged)
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();

    const supabase = getSupabase()
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_ORDERS_KEY) {
        loadOrders()
      }
    }

    window.addEventListener('storage', handleStorage)

    if (supabase) {
      const channel = supabase
        .channel('staff-orders-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          loadOrders()
        })
        .subscribe()

      return () => {
        window.removeEventListener('storage', handleStorage)
        void supabase.removeChannel(channel)
      }
    }

    return () => window.removeEventListener('storage', handleStorage)
  }, []);

  async function updateStatus(id: string, status: Order['status']) {
    const supabase = getSupabase();
    // Prevent changing a delivered or cancelled order back to another status
    const existing = orders.find((o) => o.id === id);
    if (
      existing &&
      ((existing as any).status === 'delivered' || (existing as any).status === 'cancelled') &&
      status !== (existing as any).status
    ) {
      return
    }
    const updateLocal = () => {
      setOrders((prev) => {
        const next: Order[] = prev.map((o) => (o.id === id ? { ...o, status } : o))
        saveLocalOrders(next)
        return next
      })
    }

    if (!supabase) {
      updateLocal()
      return
    }

    const { error } = await supabase.from('orders').update({ status } as never).eq('id', id);
    if (error) {
      console.warn('Supabase status update failed, updating local fallback instead:', error)
      updateLocal()
    } else {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } as Order : o)));
    }
  }

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm font-medium text-ocean-600">Hi, {displayName}</p>
          <h1 className="font-display text-3xl font-bold text-ocean-900">Staff Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadOrders} variant="outline">Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-soft">
          <h2 className="text-lg font-semibold text-ocean-800">Total Revenue</h2>
          <p className="text-3xl font-bold text-ocean-900">₱{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft">
          <h2 className="text-lg font-semibold text-ocean-800">Total Orders</h2>
          <p className="text-3xl font-bold text-ocean-900">{orders.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id}>
                <div className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-medium">Order {order.id}</div>
                    <div className="text-sm text-gray-600">Total: ₱{Number(order.total || (order as any).total || 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Status: {(order as any).status || 'pending'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} variant="outline">{expandedId === order.id ? 'Close' : 'View'}</Button>
                    <label className="text-sm text-gray-600">Change status:</label>
                    <select
                      className={
                        "rounded-md px-3 py-1 text-sm " +
                        (((order as any).status === 'delivered'
                          ? 'bg-gray-100 text-gray-500 border-gray-300 appearance-none'
                          : (order as any).status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border-red-300 appearance-none'
                          : 'border-ocean-200'))
                      }
                      style={
                        (order as any).status === 'delivered' || (order as any).status === 'cancelled'
                          ? { backgroundImage: 'none' }
                          : undefined
                      }
                      value={(order as any).status || 'pending'}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      disabled={(order as any).status === 'delivered' || (order as any).status === 'cancelled'}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {expandedId === order.id && (
                  <div className="bg-white p-4 rounded shadow-inner mt-2">
                    <h3 className="font-semibold mb-2">Customer</h3>
                    {(() => {
                      const addr = (order as any).shippingAddress || (order as any).shipping_address || (order as any).shipping || null
                      return addr ? (
                        <div className="text-sm text-gray-700 mb-3">
                          <div className="font-medium">{addr.fullName || addr.full_name || addr.name || '—'}</div>
                          <div>{addr.email}</div>
                          <div>{addr.phone}</div>
                          <div>{addr.addressLine1 || addr.address_line1 || addr.address}</div>
                          {addr.addressLine2 || addr.address_line2 ? <div>{addr.addressLine2 || addr.address_line2}</div> : null}
                          <div>{(addr.city ? addr.city + ', ' : '') + (addr.state ? addr.state + ' ' : '') + (addr.postalCode || addr.postal_code || '')}</div>
                          <div>{addr.country}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">No shipping info available.</div>
                      )
                    })()}

                    <h3 className="font-semibold mb-2">Items</h3>
                    <div className="text-sm text-gray-700">
                      {((order as any).items || []).length === 0 ? (
                        <div className="text-gray-600">No items</div>
                      ) : (
                        <ul className="list-disc pl-5">
                          {((order as any).items || []).map((it: any, idx: number) => (
                            <li key={idx} className="mb-1">
                              {it.product?.name || it.name || it.title || 'Item'} x {it.quantity || it.qty || 1} — ₱{Number(it.product?.price || it.price || 0).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
