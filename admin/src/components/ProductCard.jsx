import { useNavigate } from "react-router";
import { useState } from "react";
import PropTypes from "prop-types";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import api from "../utility/setUpAxios";
import { toast } from "react-toastify";

function ProductCard({ detail, setChange, setLoading }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleProductDetailRedirect = () => {
    navigate(`/products/${detail._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const confirm = window.confirm("Do you want to delete this product?");
    if (confirm) {
      setLoading(true);
      const deleteAProduct = async () => {
        try {
          await api.delete(`/product/${detail?._id}`);
          toast.success("Product deleted successfully");
          setChange(true);
        } catch (error) {
          console.error("Error deleting product: ", error);
          toast.error("Failed to delete product");
        } finally {
          setLoading(false);
        }
      };
      deleteAProduct();
    }
  };

  const newPrice = convertCurrencyIntoINS(detail.price);

  const handleEditNavigate = (e) => {
    e.stopPropagation();
    navigate(`/edit-product/${detail._id}`, {
      state: {
        detail,
      },
    });
  };

  return (
    <div
      className="border w-full aspect-square rounded flex flex-col items-center relative"
      onClick={handleProductDetailRedirect}
    >
      <button
        className="absolute top-2 right-2 bg-[#00000022] rounded flex justify-center items-center p-1 z-10"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
      >
        {menuOpen ? <IoMdClose /> : <HiOutlineDotsVertical />}
      </button>

      {menuOpen && (
        <div className="absolute top-9 right-2 bg-white border rounded shadow-md z-20">
          <ul className="flex flex-col p-1">
            <li
              className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={handleEditNavigate}
            >
              Edit
            </li>
            <li
              className="px-2 py-1 text-sm text-red-500 hover:bg-red-100 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </li>
          </ul>
        </div>
      )}

      <img src={detail.image} alt={detail.name} className="h-[80%]" />
      <div className="flex flex-col justify-between items-center w-full gap-1 text-center">
        <p className="text-xl font-medium">{detail.name}</p>
        <p className="text-lg text-[#373737]">₹{newPrice}</p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  detail: PropTypes.object.isRequired,
  setChange: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ProductCard;
