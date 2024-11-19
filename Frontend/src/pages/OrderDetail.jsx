import { useParams } from "react-router";
import api from "../utility/setUpAxios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { formatMongoDate } from "../utility/convertDate";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";
import { toast } from "react-toastify";

function OrderDetail() {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const { orderId } = useParams();

  // Fetch order details
  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order/${orderId}`);
      setOrderDetail(res.data.data);
      setError("");
    } catch (error) {
      console.error("Error while fetching order detail:", error);
      setError("Failed to get order detail");
    } finally {
      setLoading(false);
    }
  };

  // Cancel the order
  const cancelOrder = async () => {
    const confirm = window.confirm("Do you want to cancel this order?");
    if (!confirm) return;

    setIsCancelling(true);
    try {
      await api.patch(`/order/${orderId}`);
      setOrderDetail((prev) => ({ ...prev, status: "cancelled" }));
      toast.success("Order cancelled");
    } catch (error) {
      console.error("Error while cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  // Derived values
  const totalAmount = orderDetail?.quantity * orderDetail?.product?.price;
  const orderDate = formatMongoDate(orderDetail?.createdAt);
  const pricePerItem = convertCurrencyIntoINS(orderDetail?.product?.price);
  const totalPrice = convertCurrencyIntoINS(totalAmount);
  const orderStatusClass =
    orderDetail?.status === "pending"
      ? "text-yellow-600"
      : orderDetail?.status === "completed"
      ? "text-green-600"
      : "text-red-600";

  // Render loading state
  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-center bg-white text-black px-3 sm:px-6 py-6">
      {error ? (
        <div className="bg-red-600 p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      ) : (
        <div className="max-w-[1080px] w-full text-black flex flex-col justify-center items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-medium">My Order</h2>

          {/* Order Item Section */}
          <div className="w-full flex flex-col border rounded shadow-md">
            <p className="text-xl border-b py-3 px-6">Item</p>
            <div className="flex w-full p-2 gap-2">
              <img
                className="w-28 h-28 object-cover"
                src={orderDetail?.product?.image || "/placeholder-image.png"}
                alt={orderDetail?.product?.name || "Product Image"}
              />
              <div className="text-gray-600">
                <p className="text-lg text-black">
                  {orderDetail?.product?.name || "Product Name"}
                </p>
                <p>₹{pricePerItem || "N/A"}</p>
                <p>Qty: {orderDetail?.quantity || 0}</p>
              </div>
            </div>
          </div>

          {/* Order and Payment Info */}
          <div className="w-full flex flex-col sm:flex-row gap-4">
            {/* Order Info */}
            <div className="w-full sm:w-[50%] shadow-md">
              <h3 className="text-xl border-b py-3 px-6">Order Info</h3>
              <div className="w-full flex p-4">
                <div className="w-[50%] text-sm font-light">
                  <span className="text-xs text-[#969696] font-normal block mb-1">
                    Delivery address
                  </span>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <p className="font-medium w-full">
                      {orderDetail?.userDetail?.name || "N/A"}
                    </p>
                    <p>{orderDetail?.userDetail?.address || "N/A"},</p>
                    <p>{orderDetail?.userDetail?.cityTownVillage || "N/A"},</p>
                    <p>{orderDetail?.userDetail?.district || "N/A"},</p>
                    <p>{orderDetail?.userDetail?.state || "N/A"},</p>
                    <p>{orderDetail?.userDetail?.pinCode || "N/A"}</p>
                    <p className="w-full font-normal">{orderDetail?.userDetail?.phoneNo || "N/A"}</p>
                    <p className="w-full font-normal">{orderDetail?.userDetail?.alternatePhoneNo || "N/A"}</p>
                  </div>
                </div>

                <div className="w-[50%] text-right flex flex-col gap-3">
                  <div>
                    <span className="text-xs text-[#969696] font-normal">
                      Order placed on
                    </span>
                    <p className="font-medium">{orderDate || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[#969696] font-normal">
                      {orderDetail?.paymentMode || "N/A"}
                    </span>
                    <p className="font-medium">₹{totalPrice || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[#969696] font-normal">
                      Status
                    </span>
                    <p className={`font-medium ${orderStatusClass}`}>
                      {isCancelling ? "Cancelling..." : orderDetail?.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="w-full sm:w-[50%] shadow-md h-fit">
              <h3 className="text-xl border-b py-3 px-6">Payment Info</h3>
              <div className="w-full p-4 flex flex-col justify-center items-center">
                <div className="w-full p-2 pt-0 flex justify-between items-center border-b mb-1 text-sm">
                  <p className="w-fit font-medium">
                    {orderDetail?.paymentMode || "N/A"}
                  </p>
                  <p className="w-fit">{orderDetail?.paymentStatus || "N/A"}</p>
                </div>
                <div className="w-full p-2 pb-0 flex justify-between items-center">
                  <p>Total:</p>
                  <p>₹{totalPrice || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Order Button */}
          <button
            onClick={cancelOrder}
            disabled={isCancelling}
            className={`w-fit px-4 py-2 text-white ${
              isCancelling
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
