import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateCart, removeFromCart } from "../redux/slices/cartSlice";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";
import api from "../utility/setUpAxios";

function CartCard({ detail, onRemove }) {
  const [quantity, setQuantity] = useState(detail.quantity || 1);
  const [isQuantityChanged, setIsQuantityChanged] = useState(false);
  const stock = detail.stock;
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (detail) {
      setQuantity(detail.quantity);
    }
  }, [detail]);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setIsQuantityChanged(true);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
      setIsQuantityChanged(true);
    }
  };

  const updateCartQuantity = async () => {
    if (isAuthenticated) {
      try {
        const res = await api.patch("/cart/update-quantity", {
          productId: detail._id,
          quantity,
        });
        console.log("Updated on server:", res.data.data);
      } catch (error) {
        console.log("Error while updating quantity:", error);
      }
    } else {
      dispatch(updateCart({ ...detail, quantity }));
    }
    setIsQuantityChanged(false);
  };

  const handleRemoveItem = async () => {
    if (isAuthenticated) {
      console.log({ productId: detail._id });
      try {
        const res = await api.delete("/cart/remove", {
          data: { productId: detail._id },
        });
        console.log(res.data);
        onRemove(detail._id);
      } catch (error) {
        console.log("Error while removing item from cart : ", error);
        onRemove(detail.productId);
      }
    } else {
      dispatch(removeFromCart(detail.productId));
    }
  };

  const newPrice1 = convertCurrencyIntoINS(detail.price);
  const newPrice2 = convertCurrencyIntoINS(detail.price * quantity);

  return (
    <div className="border relative flex p-2 sm:p-4 gap-4 w-full">
      <img src={detail.image} alt={detail.name} className="max-h-32" />
      <div className="flex flex-col sm:flex-row w-full justify-start sm:justify-between items-start gap-2 sm:items-center">
        <div>
          <h3 className="text-xl">{detail.name}</h3>
          <p className="text-gray-600">₹ {newPrice1}</p>
        </div>
        <div className="flex sm:gap-2 flex-col items-center sm:flex-row">
          <span className="flex w-fit gap-1 border rounded justify-between items-center">
            <button className="px-1" onClick={handleQuantityDecrease}>
              <FiMinus />
            </button>
            {quantity}
            <button className="px-1" onClick={handleQuantityIncrease}>
              <FiPlus />
            </button>
          </span>
          <button
            className="border-b px-1 cursor-pointer text-[grey] text-sm"
            onClick={handleRemoveItem}
          >
            Remove
          </button>
        </div>
        <p className="hidden sm:block">₹{newPrice2}</p>
      </div>
      {isQuantityChanged && (
        <button
          className="absolute bottom-2 right-3 px-2 py-[0.1rem] bg-gray-700 text-white rounded-sm "
          onClick={updateCartQuantity}
        >
          Save
        </button>
      )}
    </div>
  );
}

CartCard.propTypes = {
  detail: PropTypes.shape({
    _id: PropTypes.string,
    productId: PropTypes.string,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    quantity: PropTypes.number,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartCard;
