import PropTypes from "prop-types";
import { formatMongoDate } from "../utility/convertDate";
import { useNavigate } from "react-router";

function OrderCard({ data }) {
  const navigate = useNavigate();
  const date = formatMongoDate(data?.createdAt);

  const handleDetailedRedirect = () => {
    navigate(`/orders/${data._id}`);
  };

  return (
    <div className="cursor-pointer w-full border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow">
      {/* Order Info */}
      <div className="flex items-center border-b pb-3 mb-3">
        <p className="text-sm text-gray-500">
          Order date: <span className="font-semibold">{date || "N/A"}</span>
        </p>
      </div>

      <div className="w-full flex justify-start gap-4 items-end">
        <div className="w-36 h-36 flex items-center gap-2 mb-3">
          <img
            src={data?.product.image}
            alt={data?.product.name}
            className="w-36 h-36 object-cover rounded border"
          />
        </div>
        <div className="w-full h-full flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-600 w-fit">
              Current Status:{" "}
              <span
                className={`${
                  (data?.status == "pending" && "text-yellow-600") ||
                  (data?.status == "completed" && "text-green-600") ||
                  (data?.status == "failed" && "text-red-600")
                } font-medium`}
              >
                {data?.status || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-3 w-fit">
              Quantity: <span className="font-semibold">{data?.quantity}</span>
            </p>
          </div>

          <button
            onClick={handleDetailedRedirect}
            className="bg-black text-white text-sm py-2 px-4 w-fit"
          >
            Order Details
          </button>
        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OrderCard;
