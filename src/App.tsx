// src/App.tsx

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
import Account from "./pages/Account";
import AccountSettings from "./pages/AccountSettings"; // Import the new page
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/Orders";
import ManageServices from './pages/admin/ManageServices';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatbot from "./components/AIChatbot";
import CursorFollower from "./components/CursorFollower";
import ViewCart from "./pages/ViewCart";


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
                <CursorFollower />
                <AIChatbot />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/about" element={<About />} />

                  <Route
                      path="/services"
                      element={
                        <ErrorBoundary>
                          <Services />
                        </ErrorBoundary>
                      }
                  />

                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/cart" element={<ViewCart />} />
                  <Route path="/checkout/review" element={<OrderReview />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/service/:id" element={<ServiceDetail />} />
                  <Route path="/order-details/:orderId" element={<OrderDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account-settings" element={<AccountSettings />} /> {/* Add this new route */}

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
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;