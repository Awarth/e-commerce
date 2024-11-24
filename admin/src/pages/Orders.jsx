import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../utility/setUpAxios";
import Loader from "../components/Loader";
import OrderCard from "../components/OrderCard";

function Orders() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const { data } = await api.get("/order");
        setOrderDetails(data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white w-full mb-[4.5rem] md:mb-0">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Orders
        </h2>
        {orderDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderDetails.map((order, index) => (
              <OrderCard key={index} data={order} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;
