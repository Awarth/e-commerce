import PropTypes from "prop-types";
import { useMemo } from "react";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";

function ItemListing({ data }) {
  const newPrice = useMemo(
    () => convertCurrencyIntoINS(data?.totalAmount || 0),
    [data?.totalAmount]
  );

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-4">
      <h3 className="font-medium text-2xl mb-1 ">Items</h3>
      {data?.items?.map((item) => {
        const itemPrice = convertCurrencyIntoINS(item.price);
        return (
          <div
            className="w-full border p-1 sm:p-2 mb-1 sm:mb-2 flex items-center"
            key={item?._id || item?.product}
          >
            <img src={item.image} alt={item.name} className="w-28 h-28 mr-4" />
            <div className="text-gray-600">
              <p className="font-medium text-lg text-black">{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{itemPrice}</p>
            </div>
          </div>
        );
      })}
      <div className="w-full flex justify-between items-end">
        <p className="text-xl font-medium">Total :</p>
        <p className="text-xl font-medium">₹{newPrice}</p>
      </div>
    </div>
  );
}

ItemListing.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ItemListing;
