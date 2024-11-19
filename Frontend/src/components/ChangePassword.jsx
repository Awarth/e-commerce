import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import api from "../utility/setUpAxios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Loader from "./Loader";

function ChangePassword({ setIsPasswordEditOpen }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password.newPassword)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
      );
      return;
    }

    const patchPassword = async () => {
      setLoading(true);
      try {
        const res = await api.patch("/user/change-password", password);
        console.log(res.data);

        toast.success("Password changed successfully");
        setIsPasswordEditOpen(false);
      } catch (error) {
        console.log("Error while changing password :", error);

        setError("Error while changing the password, Try again later");
      } finally {
        setLoading(false);
      }
    };
    patchPassword();
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <form
            onSubmit={handlePasswordChange}
            className="flex relative flex-col w-full max-w-sm gap-4 border border-gray-300 bg-white p-6 rounded-lg "
          >
            <span
              onClick={() => setIsPasswordEditOpen(false)}
              className="cursor-pointer rounded-full p-2 absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              <IoMdClose />
            </span>

            <h2 className="text-2xl font-semibold text-gray-900">
              Change Password
            </h2>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="oldPassword"
                className="text-gray-700 font-medium"
              >
                Old Password
              </label>
              <input
                type="text"
                name="oldPassword"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter your old password"
                value={password.oldPassword}
                onChange={handlePasswordInput}
                required
              />
            </div>

            {/* New Password Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="newPassword"
                className="text-gray-700 font-medium"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordInput}
                  className="px-3 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium">Password Requirements:</p>
              <ul className="list-disc pl-6">
                <li>At least 8 characters long</li>
                <li>At least one uppercase letter</li>
                <li>At least one number</li>
                <li>At least one special character (e.g., @$!%*?&)</li>
              </ul>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </>
  );
}

ChangePassword.propTypes = {
  setIsPasswordEditOpen: PropTypes.func.isRequired,
};

export default ChangePassword;
