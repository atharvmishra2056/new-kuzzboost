import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AuthPage from "./pages/AuthPage";
import OrderHistory from "./pages/OrderHistory";
import OrderReview from "./pages/OrderReview";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import ServiceDetail from "./pages/ServiceDetail";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import ManageServices from './pages/admin/ManageServices';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatbot from "./components/AIChatbot";


const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
            <BrowserRouter>
              <AIChatbot />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<About />} />

                {/* Services route wrapped with ErrorBoundary */}
                <Route
                    path="/services"
                    element={
                      <ErrorBoundary>
                        <Services />
                      </ErrorBoundary>
                    }
                />

                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/checkout/review" element={<OrderReview />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/service/:id" element={<ServiceDetail />} />
                <Route path="/order-details/:orderId" element={<OrderDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="services" element={<ManageServices />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="analytics" element={<Analytics />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;