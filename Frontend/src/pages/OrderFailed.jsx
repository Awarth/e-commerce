import { Link } from "react-router-dom";

function OrderFailure() {
  return (
    <div className="flex items-center justify-center p-4 w-full h-[80vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Order Failed</h1>
        <p className="mt-2 text-lg">
          There was an issue with your order. Please try again.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block bg-black text-white py-2 px-4"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default OrderFailure;
