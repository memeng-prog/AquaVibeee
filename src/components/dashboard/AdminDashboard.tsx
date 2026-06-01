import { Button } from '@/components/ui/Button';
import { useCallback, useEffect, useState } from 'react';
import { ProductForm } from './ProductForm';
import { StaffManagement } from './StaffManagement';
import { getSupabase } from '@/lib/supabase';
import { MOCK_PRODUCTS } from '@/data/products';
import type { Product as FullProduct } from '@/types'

const LOCAL_ORDERS_KEY = 'mft_orders'

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  created_at?: string;
};

function getLocalOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) ?? '[]') as Order[]
  } catch {
    return []
  }
}

export function AdminDashboard() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<FullProduct | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = useCallback(async () => {
    const supabase = getSupabase();
    const localOrders = getLocalOrders()
    if (!supabase) return;

    const { data: ordersData } = await supabase
      .from('orders')
      .select('id, total, status, created_at')
      .order('created_at', { ascending: false });
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name, price, created_at')
      .order('created_at', { ascending: false });

    const supabaseOrders = (ordersData as Order[]) || []
    const mergedOrders = [...supabaseOrders]
    for (const order of localOrders) {
      if (!mergedOrders.some((existing) => existing.id === order.id)) {
        mergedOrders.push(order)
      }
    }
    mergedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setOrders(mergedOrders);
    const prods = (productsData as Product[]) || [];
    // If no products in DB, fallback to mock products so admin sees items
    if (!prods || prods.length === 0) {
      setProducts(MOCK_PRODUCTS as unknown as Product[]);
    } else {
      setProducts(prods);
    }
  }, [])

  useEffect(() => {
    loadData();
    const supabase = getSupabase()
    if (!supabase) return

    const channel = supabase
      .channel('admin-dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [loadData]);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ocean-900">Admin Dashboard</h1>
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Product Management</h2>
        <Button
          onClick={() => {
            setProductToEdit(null)
            setShowProductForm(!showProductForm)
          }}
        >
          {showProductForm ? 'Cancel' : 'Add New Product'}
        </Button>
        {showProductForm && (
          <ProductForm
            productToEdit={productToEdit}
            onFormSubmit={async () => {
              setShowProductForm(false)
              setProductToEdit(null)
              await loadData()
            }}
          />
        )}
        <div className="mt-4 bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Products</h3>
          <ul className="space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 shadow-sm"
              >
                <div className="min-w-0">
                  <span className="block truncate font-medium text-ocean-900">{p.name}</span>
                  <span className="text-sm text-ocean-600">₱{Number(p.price).toFixed(2)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProductToEdit(p as FullProduct)
                    setShowProductForm(true)
                  }}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
        <StaffManagement />
      </div>
    </div>
  );
}
