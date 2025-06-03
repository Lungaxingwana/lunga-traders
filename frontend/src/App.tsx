import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import LoginScreen from "./app/auth/login";
import SignupScreen from "./app/auth/signup";
import ProfileScreen from "./app/auth/profile";
import Navbar from "./components/navbar";
import HomeScreen from "./app/main/home/home";
import DetailProduct from "./app/main/home/detail-product";
import { useProductStore } from "./stores/useProductStore";
import MyBusinessScreen from "./app/main/my-business/my-business";
import ProductDetail from "./app/main/my-business/product-detail";
import AddProduct from "./app/main/my-business/add-product";
import MyCart from "./app/main/my-cart/my-cart";
import { useInvoiceStore } from "./stores/useInvoiceStore";

function App() {
  const { checkAuth, authUser } = useAuthStore();
  const { fetchProducts } = useProductStore();
  const { getUserInvoices } = useInvoiceStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (authUser?._id) {
      getUserInvoices(authUser._id);
    }
  }, [authUser?._id, getUserInvoices]);

  const LocationAwareNavbar = () => {
    const location = useLocation();
    return <Navbar pathname={location.pathname} />;
  };

  return (
    <div className="flex flex-col h-screen">
      <Router>
        <LocationAwareNavbar />
        <div className="content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/detail-product" element={<DetailProduct />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/my-business" element={<MyBusinessScreen />} />
              <Route path="/product-detail" element={<ProductDetail />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/my-cart" element={<MyCart />} />
            </Routes>
          </AnimatePresence>
        </div>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
