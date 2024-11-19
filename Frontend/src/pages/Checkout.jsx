import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Address from "./Address";
import PaymentOptions from "./PaymentOptions";
import { useState, useCallback } from "react";
import LoginModal from "../components/LoginModal";
import ItemListing from "./ItemListing";
import { transformResponseData } from "../utility/rearrangeOrder";
import api from "../utility/setUpAxios";
import { clearCart } from "../redux/slices/cartSlice";
import Loader from "../components/Loader";

function Checkout() {
  const location = useLocation();
  const { data } = location.state || {};
  const [showLogin, setShowLogin] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressDetail, setAddressDetail] = useState({
    name: "",
    phoneNo: "",
    alternatePhone: "",
    address: "",
    cityTownVillage: "",
    district: "",
    state: "",
    pinCode: "",
  });

  console.log(data.items);

  let paymentStatus;

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    const validationRegex = {
      pinCode: /^\d{0,6}$/,
      phoneNo: /^\d{0,10}$/,
      alternatePhone: /^\d{0,10}$/,
    };

    const regex = validationRegex[name];
    if (regex && value !== "" && !regex.test(value)) return;

    setAddressDetail((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handleCompleteOrder = async () => {
    if (selectedPayment !== "COD") {
      paymentStatus = "paid";
    } else {
      paymentStatus = "unpaid";
    }

    console.log(data.items);

    const orderDetails = {
      userDetail: {
        addressDetail,
      },
      products: [data.items],
      totalAmount: data.totalAmount,
      paymentMode: selectedPayment,
      paymentStatus,
    };

    const response = transformResponseData(orderDetails);

    setLoading(true);

    try {
      const res = await api.post("/order", response);
      console.log(res.data);
      navigate("/order-success");
      if (data.type === "cart") {
        await api.delete("/cart/clear");
        dispatch(clearCart());
      }
    } catch (error) {
      console.log("Error while placing order :", error);
      navigate("/order-failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center p-2">
        {showLogin ? (
          <LoginModal closeModal={() => setShowLogin(false)} />
        ) : (
          <div className="max-w-[700px] w-full">
            <div className="w-full h-[75vh] flex flex-col justify-center items-center gap-4">
              <p className="text-lg text-gray-800">
                Please log in to place an order.
              </p>
              <button
                className="bg-black text-white py-2 px-4"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-2">
      <div className="max-w-[1440px] w-full flex flex-col md:flex-row gap-4 p-0 sm:p-2 md:p-4">
        <div className="w-full md:w-[60%] flex flex-col gap-4">
          <Address
            addressDetail={addressDetail}
            setAddressDetail={setAddressDetail}
            handleInputChange={handleInputChange}
          />
          <PaymentOptions
            selectedPayment={selectedPayment}
            onPaymentChange={handlePaymentChange}
          />
          <div className="block md:hidden">
            <ItemListing data={data} />
          </div>
          <button
            onClick={handleCompleteOrder}
            className="bg-black py-2 text-white text-lg mb-4"
          >
            Complete Order
          </button>
        </div>
        <div className="hidden md:block w-[50%]">
          <ItemListing data={data} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
