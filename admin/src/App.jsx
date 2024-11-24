import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import Products from "./pages/Products";
import ProductsDetailed from "./pages/ProductsDetailed";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProtectedLayout from "./pages/ProtectedLayout";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";

function App() {
  return (
    <div className="w-full flex justify-center items-center">
      <ToastContainer />
      <div className="max-w-[1960px] w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-product/:productId" element={<EditProduct />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products/:productId" element={<ProductsDetailed />} />
          </Route>
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
