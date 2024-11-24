import { useState, useMemo } from "react";
import { useLocation } from "react-router";
import CategoryTypes from "../utility/CategoryTypes";
import api from "../utility/setUpAxios";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loader from "../components/Loader";

function EditProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ image: "", detail: "" });

  const location = useLocation();
  const data = location.state.detail;

  const [imagePreview, setImagePreview] = useState(
    data?.image || "/default-image.jpg"
  );
  const [image, setImage] = useState(data?.image || null);
  const [productDetail, setProductDetail] = useState({
    name: data?.name || "",
    price: data?.price || "",
    stock: data?.stock || "",
    category: data?.category || "",
    description: data?.description || "",
  });

  const categoryOptions = useMemo(
    () =>
      Object.keys(CategoryTypes).map((key, index) => (
        <option key={index} value={CategoryTypes[key]}>
          {CategoryTypes[key]}
        </option>
      )),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInputs = () => {
    if (!productDetail.name || !productDetail.price || !productDetail.stock) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const updateProduct = async (url, data = null, successMessage, errorType) => {
    setLoading(true);
    try {
      const res = await api.patch(url, data);
      console.log(res.data);
      setError((prev) => ({ ...prev, [errorType]: "" }));
    } catch (error) {
      console.error(`Error while updating: ${error}`);
      setError((prev) => ({
        ...prev,
        [errorType]: "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleImagePatch = (e) => {
    console.log(image);
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    updateProduct(
      `/product/image/${data?._id}`,
      formData,
      "Image updated successfully",
      "image"
    );
  };

  const handleDetailChange = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    updateProduct(
      `/product/${data?._id}`,
      productDetail,
      "Details updated successfully",
      "detail"
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-lg shadow-lg p-3 md:p-6 mb-16 md:mb-0">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Edit Product
        </h1>
        <div className="flex flex-col justify-center items-center md:flex-row gap-4">
          {error.image ? (
            <p className="text-xl text-gray-500">{error.image}</p>
          ) : (
            <form
              onSubmit={handleImagePatch}
              className="w-full md:w-1/2 flex flex-col gap-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Change Image
              </h2>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Image
                </label>
                <div className="relative w-full border border-gray-300 rounded-md p-2">
                  <LazyLoadImage
                    src={imagePreview}
                    alt={productDetail.name || "Product"}
                    className="w-full aspect-square object-cover rounded-md mb-4"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-6 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-gray-700 hover:bg-gray-600 text-white transition duration-200"
                }`}
              >
                {loading ? "Saving..." : "Save Image"}
              </button>
            </form>
          )}

          {error.detail ? (
            <p className="text-xl text-gray-500">{error.detail}</p>
          ) : (
            <form
              onSubmit={handleDetailChange}
              className="w-full md:w-1/2 flex flex-col gap-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Details
              </h2>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productDetail.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={productDetail.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock
                </label>
                <input
                  type="text"
                  name="stock"
                  value={productDetail.stock}
                  required
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  name="category"
                  value={productDetail.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categoryOptions}
                </select>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={productDetail.description}
                  onChange={handleInputChange}
                  required
                  className="w-full h-52 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-6 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-gray-700 hover:bg-gray-600 text-white transition duration-200"
                }`}
              >
                {loading ? "Saving..." : "Save Details"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
