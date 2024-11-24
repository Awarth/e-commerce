import PropTypes from "prop-types";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import api from "../utility/setUpAxios";

function OrderCard({ data }) {
  const {
    _id,
    product,
    quantity,
    status,
    paymentStatus,
    paymentMode,
    createdAt,
    userDetail,
  } = data;

  const statusArray = ["pending", "failed", "completed"];
  const [newStatus, setNewStatus] = useState(status || "");
  const [prevStatus, setPrevStatus] = useState(status);
  const [editStatus, setEditStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateOrderStatus = async (id, updatedStatus) => {
    setLoading(true);
    try {
      await api.patch(`/order/status/${id}`, { status: updatedStatus });
      toast.success("Order status updated successfully!");
      setPrevStatus(updatedStatus);
      setEditStatus(false);
    } catch (error) {
      toast.error(
        "Failed to update order status. Please try again later.",
        error
      );
      setNewStatus(prevStatus);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusChange = (e) => {
    e.preventDefault();
    if (newStatus === prevStatus) {
      toast.info("No changes to save.");
      return;
    }
    updateOrderStatus(_id, newStatus);
  };

  const toggleEditStatus = () => {
    setEditStatus((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleOrderStatusChange}
      className={`relative bg-white shadow-md rounded-lg p-6 border w-full ${
        newStatus === "pending"
          ? "border-yellow-500"
          : newStatus === "failed"
          ? "border-red-500"
          : "border-green-500"
      }`}
    >
      {/* Edit/Cancel Button */}
      <div
        onClick={toggleEditStatus}
        className="p-2 bg-gray-200 rounded-full absolute top-3 right-3 cursor-pointer hover:bg-gray-300"
        title={editStatus ? "Cancel Editing" : "Edit Order"}
      >
        {editStatus ? <IoMdClose className="text-red-600" /> : <FiEdit2 />}
      </div>

      {/* Product Details */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {product.name}
        </h2>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Price:</span> ₹{product.price}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Quantity:</span> {quantity}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Total:</span> ₹
          {product.price * quantity}
        </p>
      </div>

      {/* Order Status */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Order Status:</span>{" "}
          {editStatus ? (
            <select
              name="status"
              value={newStatus}
              onChange={handleStatusChange}
              className="font-bold border rounded px-2 py-1"
            >
              {statusArray.map((item) => (
                <option value={item} key={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`${
                status === "pending"
                  ? "text-yellow-600"
                  : status === "failed"
                  ? "text-red-600"
                  : "text-green-600"
              } font-bold`}
            >
              {status.toUpperCase()}
            </span>
          )}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Payment Status:</span>{" "}
          <span
            className={`${
              paymentStatus === "paid" ? "text-green-600" : "text-red-600"
            } font-bold`}
          >
            {paymentStatus.toUpperCase()}
          </span>
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Payment Mode:</span> {paymentMode}
        </p>
      </div>

      {/* User Details */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Delivery Address
        </h3>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Name:</span> {userDetail.name}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Phone:</span> {userDetail.phoneNo}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Address:</span> {userDetail.address},{" "}
          {userDetail.cityTownVillage}, {userDetail.district},{" "}
          {userDetail.state}, {userDetail.pinCode}
        </p>
      </div>

      {/* Order Date */}
      <p className="text-gray-500 text-sm">
        <span className="font-medium">Order Date:</span>{" "}
        {new Date(createdAt).toLocaleDateString()}
      </p>

      {/* Save Button */}
      {editStatus && (
        <button
          className="absolute bottom-3 right-3 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50 flex items-center"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border animate-spin w-4 h-4 mr-2"></span>
          ) : (
            "Save"
          )}
        </button>
      )}
    </form>
  );
}

OrderCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OrderCard;
