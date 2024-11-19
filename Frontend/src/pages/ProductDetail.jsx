import { useNavigate, useParams } from "react-router";
import api from "../utility/setUpAxios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
// import { getCartFromLocalStorage } from "../utility/localStorage";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";
import { useSelector } from "react-redux";

function ProductDetail() {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //   const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/product/${productId}`);
      setProductDetail(res.data.data);
      setError("");
    } catch (error) {
      console.log("Error fetching product detail", error);
      setError("Failed to fetch product detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleQuantityIncrease = () => {
    if (quantity < productDetail.stock) setQuantity((prev) => prev + 1);
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        data: {
          type: "buy now",
          items: [
            {
              _id: productId,
              quantity,
              name: productDetail.name,
              image: productDetail.image,
              price: productDetail.price,
            },
          ],
          totalAmount: productDetail.price * quantity,
        },
      },
    });
  };

  const handleAddItemToCart = () => {
    if (isAuthenticated) {
      const addItemToCart = async () => {
        try {
          const res = await api.post("/cart/add", { productId, quantity });
          console.log(res.data);
        } catch (error) {
          console.log("Error while adding item to the cart :", error);
        }
      };
      addItemToCart();
    } else {
      const cartItem = {
        productId,
        quantity,
        image: productDetail.image,
        name: productDetail.name,
        price: productDetail.price,
        stock: productDetail.stock,
      };

      dispatch(addToCart(cartItem));
    }

    toast.success("Item added to cart", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  const newPrice = convertCurrencyIntoINS(productDetail?.price);

  if (loading && !productDetail) {
    return <Loader />;
  }

  return (
    <div>
      {error ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <p className="text-2xl text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row w-full p-2 sm:p-4 gap-4 text-gray-700">
          <div className="w-[100%] sm:w-[45%] flex items-center justify-center sm:items-start sm:justify-start">
            <img
              src={productDetail?.image}
              alt={productDetail?.name}
              className="rounded w-[80%] sm:w-full"
            />
          </div>
          <div className="details w-[100%] sm:w-[50%] flex flex-col gap-2 ">
            <h2 className="text-3xl font-medium text-black">
              {productDetail?.name}
            </h2>
            <p className="text-xl text-gray-800">₹ {newPrice}</p>
            <span>Stock: {productDetail?.stock}</span>
            <span className="flex w-fit gap-1 border rounded justify-between items-center">
              <button className="px-1" onClick={handleQuantityDecrease}>
                <FiMinus />
              </button>
              {quantity}
              <button className="px-1" onClick={handleQuantityIncrease}>
                <FiPlus />
              </button>
            </span>
            <span className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-fit"
                onClick={handleAddItemToCart}
              >
                Add to cart
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 mt-2 rounded w-fit"
                onClick={handleBuyNow}
              >
                Buy now
              </button>
            </span>
            <p className="text-gray-800 text-lg font-medium">Description :</p>
            <p className="">{productDetail?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
