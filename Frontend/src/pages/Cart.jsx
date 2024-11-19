import { useEffect, useState } from "react";
import CartCard from "../components/CartCard";
import { useSelector } from "react-redux";
import api from "../utility/setUpAxios";
import Loader from "../components/Loader";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";
import { useNavigate } from "react-router";

function Cart() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const item = useSelector((state) => state.cart.items);
  const localCartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const calculateTotalAmount = (cartItems) => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/cart`);
        if (res.data.data.products) {
          const productsWithQuantity = res.data.data.products.map((prod) => ({
            ...prod.product,
            quantity: prod.quantity,
          }));
          setItems(productsWithQuantity);
          setTotalAmount(calculateTotalAmount(productsWithQuantity));
        } else {
          setItems([]);
          setTotalAmount(0);
        }
        setError("");
      } catch (error) {
        console.log("Error while fetching cart products:", error);
        setError("Failed to fetch cart details");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCartDetail();
    } else {
      setItems(localCartItems);
      setTotalAmount(calculateTotalAmount(localCartItems));
      setError("");
      setLoading(false);
    }
  }, [isAuthenticated, item]);

  const handleRemoveItem = (productId) => {
    const updatedItems = items.filter((item) => item._id !== productId);
    setItems(updatedItems);
    setTotalAmount(calculateTotalAmount(updatedItems));
  };

  const handleCheckOut = () => {
    navigate("/checkout", {
      state: {
        type: "cart",
        data: {
          items,
          totalAmount,
        },
      },
    });
  };

  const newPrice = convertCurrencyIntoINS(totalAmount);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {error ? (
        <>{error}</>
      ) : (
        <div className="w-full flex justify-center items-center">
          {items.length > 0 || !items ? (
            <div className="p-2 min-[400px]:px-4 sm:px-6 md:px-8 lg:px-16 max-w-[1440px] w-full">
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-8 mt-4">
                Shopping Cart
              </h2>
              <div className="flex w-full flex-col md:flex-row gap-4">
                <div className="cartSection w-full md:w-[70%]">
                  <div className="cardCollection w-full flex flex-col gap-2 sm:gap-4">
                    {items.map((item, index) => (
                      <CartCard
                        key={index}
                        detail={item}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                </div>
                <div className="amount h-fit border rounded-md md:w-[35%] w-full p-6 flex flex-col gap-6 justify-between items-center">
                  <div className="flex w-full justify-between items-end border-b pb-2">
                    <h3 className="text-2xl font-semibold">Total :</h3>
                    <p className="text-xl">₹{newPrice}</p>
                  </div>
                  <button
                    className="py-2 w-full text-white bg-black text-2xl cursor-pointer"
                    onClick={handleCheckOut}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-[80vh] items-center justify-center text-[grey] text-xl">
              Cart is empty
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Cart;
