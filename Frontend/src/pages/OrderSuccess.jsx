import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="flex items-center justify-center p-4 w-full h-[80vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-lg">
          Thank you for your purchase. Your order is on the way.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block bg-black text-white py-2 px-4"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
