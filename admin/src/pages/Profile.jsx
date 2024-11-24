import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import api from "../utility/setUpAxios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import ChangePassword from "../components/ChangePassword";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

function Profile() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user");
      setUserDetail(res.data.data);
      setError("");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await api.post("/user/logout");
      toast.success("Logged out successfully");
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {error ? (
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 relative w-[90%] max-w-lg mx-auto mt-10">
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="rounded-full p-2 absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 shadow-md text-gray-700 transition"
          >
            {isPopupOpen ? (
              <IoMdClose size={20} />
            ) : (
              <HiOutlineDotsVertical size={20} />
            )}
          </button>

          {isPopupOpen && (
            <div className="absolute top-14 right-4 bg-white shadow-md rounded-lg divide-y divide-gray-200 w-40 z-10">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                Change Password
              </button>
              <button
                onClick={handleLogOut}
                className="px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-b-lg"
              >
                Log Out
              </button>
            </div>
          )}

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-500">
                {userDetail?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {userDetail?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {userDetail?.role || "User"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800">{userDetail?.email}</span>
            </div>
          </div>

          {isPasswordModalOpen && (
            <ChangePassword onClose={() => setIsPasswordModalOpen(false)} />
          )}
        </div>
      )}
    </>
  );
}

export default Profile;
