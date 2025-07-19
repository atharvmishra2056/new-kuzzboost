import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import AuthPage from './pages/AuthPage';
import Account from './pages/Account';
import AccountSettings from './pages/AccountSettings';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import ViewCart from './pages/ViewCart';
import Checkout from './pages/Checkout';
import OrderReview from './pages/OrderReview';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CursorFollower from './components/CursorFollower';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import Analytics from "@/pages/admin/Analytics.tsx";
import AdminOrders from "@/pages/admin/Orders.tsx";
import ManageServices from "@/pages/admin/ManageServices.tsx";
import UserManagement from "@/pages/admin/UserManagement.tsx";

// ADDED: Import the new components
import RefundPolicy from './pages/RefundPolicy';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
      <Router>
        {/* ADDED: This component handles scrolling */}
        <ScrollToTop />
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <CursorFollower />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:id" element={<ServiceDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order-details/:orderId" element={<OrderDetails />} />
                <Route path="/cart" element={<ViewCart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/review" element={<OrderReview />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* ADDED: Route for the new refund policy page */}
                <Route path="/refund-policy" element={<RefundPolicy />} />

                {/* Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Analytics />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="services" element={<ManageServices />} />
                    <Route path="users" element={<UserManagement />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;
