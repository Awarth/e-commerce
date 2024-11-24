import { useParams } from "react-router";
import api from "../utility/setUpAxios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { convertCurrencyIntoINS } from "../utility/convertIntoINS";

function ProductDetail() {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/product/${productId}`);
      setProductDetail(res.data.data);
      setError("");
    } catch (error) {
      console.log("Error fetching product detail", error);
      setError("Failed to fetch product detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const newPrice = convertCurrencyIntoINS(productDetail?.price);

  if (loading && !productDetail) {
    return <Loader />;
  }

  return (
    <div>
      {error ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <p className="text-2xl text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row w-full p-2 sm:p-4 gap-4 text-gray-700">
          <div className="w-[100%] sm:w-[45%] flex items-center justify-center sm:items-start sm:justify-start">
            <img
              src={productDetail?.image}
              alt={productDetail?.name}
              className="rounded w-[80%] sm:w-full"
            />
          </div>
          <div className="details w-[100%] sm:w-[50%] flex flex-col gap-2 ">
            <h2 className="text-3xl font-medium text-black">
              {productDetail?.name}
            </h2>
            <p className="text-xl text-gray-800">₹ {newPrice}</p>
            <span>Stock: {productDetail?.stock}</span>
            <p className="text-gray-800 text-lg font-medium">Description :</p>
            <p className="mb-16 md:mb-0">{productDetail?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
