import { Layout } from '@/components/layout/Layout'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { AboutPage } from '@/pages/AboutPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage'
import { ContactPage } from '@/pages/ContactPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { WhoAmI } from '@/pages/WhoAmI'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ShopPage } from '@/pages/ShopPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:slug" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="whoami" element={<WhoAmI />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            </ErrorBoundary>
          </AuthProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}


