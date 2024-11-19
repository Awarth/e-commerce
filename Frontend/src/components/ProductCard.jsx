import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";
function ProductCard({ detail }) {
  const navigate = useNavigate();

  const handleProductDetailRedirect = () => {
    navigate(`/products/${detail._id}`);
  };

  const newPrice = convertCurrencyIntoINS(detail.price);

  return (
    <div
      className="border w-full aspect-square rounded flex flex-col items-center "
      onClick={handleProductDetailRedirect}
    >
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
};

export default ProductCard;
