import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Header from "./components/Header.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderFailure from "./pages/OrderFailed.jsx";

function App() {
  return (
    <div className="relative">
      <Header />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-failed" element={<OrderFailure />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/orders/:orderId"
          element={<ProtectedRoute element={<OrderDetail />} />}
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute element={<Checkout />} />}
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
