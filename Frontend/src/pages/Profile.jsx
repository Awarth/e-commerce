import { useEffect, useState } from "react";
import api from "../utility/setUpAxios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import OrderCard from "../components/OrderCard";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import ChangePassword from "../components/ChangePassword";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { logout } from "../redux/slices/authSlice";
import LoginModal from "../components/LoginModal";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPasswordEditOpen, setIsPasswordEditOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const [profileResponse, ordersResponse] = await Promise.all([
          api.get("/user"),
          api.get("/order/user"),
        ]);

        setUserDetails(profileResponse.data.data);
        setOrderDetails(ordersResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleLogOut = async () => {
    try {
      const res = await api.post("/user/logout");
      console.log(res.data);
      toast.success("Logged out successfully");
      navigate("/");
      dispatch(logout());
    } catch (error) {
      console.log("Error while logging out :", error);
      toast.error("Error logging out");
    }
  };

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative w-full flex justify-center items-center ">
      {isPasswordEditOpen && (
        <ChangePassword setIsPasswordEditOpen={setIsPasswordEditOpen} />
      )}

      <div className="flex flex-col min-[800px]:flex-row gap-6 p-4 max-w-[1440px] w-full">
        <div className="bg-white rounded shadow-md p-6 relative w-[30%] max-[800px]:w-full h-fit">
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="rounded p-1 absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            {isPopupOpen ? <IoMdClose /> : <HiOutlineDotsVertical />}
          </button>
          {isPopupOpen && (
            <div className="absolute top-10 right-4 flex flex-col">
              <button
                onClick={() => setIsPasswordEditOpen(true)}
                className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-t text-gray-700"
              >
                Change Password
              </button>
              <button
                onClick={handleLogOut}
                className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-b text-gray-700"
              >
                Log out
              </button>
            </div>
          )}

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
          <div className="text-lg text-gray-600">
            <p className="mb-2">
              <span className="font-medium text-gray-800">Name:</span>{" "}
              {userDetails?.name}
            </p>
            <p>
              <span className="font-medium text-gray-800">Email:</span>{" "}
              {userDetails?.email}
            </p>
          </div>
        </div>

        <div className="bg-white rounded w-[70%] max-[800px]:w-full shadow-md px-3 py-6 sm:p-6 flex justify-center items-center flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>

          {orderDetails.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {orderDetails.map((item, index) => (
                <OrderCard key={index} data={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
