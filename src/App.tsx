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
import OrderHistory from "./pages/OrderHistory";
import RequestRefillPage from "./pages/RequestRefill";
import RefillRequestsPage from "./pages/RefillRequestsPage";
import OrderDetails from './pages/OrderDetails';
import ViewCart from './pages/ViewCart';
import Checkout from './pages/Checkout';
import OrderReview from './pages/OrderReview';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import Analytics from "@/pages/admin/Analytics";
import AdminOrders from "@/pages/admin/Orders";
import ManageServices from "@/pages/admin/ManageServices";
import UserManagement from "@/pages/admin/UserManagement";
import Announcements from "@/pages/admin/Announcements";
import RefillRequests from "@/pages/admin/RefillRequests";
import RefundPolicy from './pages/RefundPolicy';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import useSmoothScroll from './hooks/useSmoothScroll';
import DashboardServices from "./pages/DashboardServices";
import DashboardHome from "./pages/DashboardHome";

function App() {
  useSmoothScroll();

  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
              <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/service/:id" element={<ServiceDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Dashboard Routes - Protected for any logged-in user */}
                <Route element={<ProtectedRoute children={<DashboardLayout />} />}>
                  <Route path="/dashboard" element={<DashboardHome />} />
                  <Route path="/dashboard/account" element={<Account />} />
                  <Route path="/dashboard/account-settings" element={<AccountSettings />} />
                  <Route path="/dashboard/orders" element={<OrderHistory />} />
                  <Route path="/dashboard/order-details/:orderId" element={<OrderDetails />} />
                  <Route path="/dashboard/refill-requests" element={<RefillRequestsPage />} />
                  <Route path="/dashboard/request-refill/:orderId" element={<RequestRefillPage />} />
                  <Route path="/dashboard/request-refill" element={<RequestRefillPage />} />
                  <Route path="/dashboard/cart" element={<ViewCart />} />
                  <Route path="/dashboard/checkout" element={<Checkout />} />
                  <Route path="/dashboard/checkout/review" element={<OrderReview />} />
                  <Route path="/dashboard/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/dashboard/wishlist" element={<Wishlist />} />
                  <Route path="/dashboard/services" element={<DashboardServices />} />
                  <Route path="/dashboard/service/:id" element={<ServiceDetail />} />
                  <Route path="/dashboard/terms" element={<TermsOfService />} />
                  <Route path="/dashboard/privacy" element={<PrivacyPolicy />} />
                  <Route path="/dashboard/refund-policy" element={<RefundPolicy />} />
                  <Route path="/dashboard/contact" element={<ContactUs />} />
                </Route>

                {/* Admin Routes - Protected for admin users only */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Analytics />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="services" element={<ManageServices />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="refill-requests" element={<RefillRequests />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;