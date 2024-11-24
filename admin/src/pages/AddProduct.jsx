import { useState, useMemo } from "react";
import CategoryTypes from "../utility/CategoryTypes";
import api from "../utility/setUpAxios";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("/default-image.jpg");
  const [image, setImage] = useState(null);
  const [productDetail, setProductDetail] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
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
    const { name, price, stock, category, description } = productDetail;
    if (!name || !price || !stock || !category || !description || !image) {
      toast.error("All fields are required, including an image.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", productDetail.name);
    formData.append("price", productDetail.price);
    formData.append("stock", productDetail.stock);
    formData.append("category", productDetail.category);
    formData.append("description", productDetail.description);

    setLoading(true);
    try {
      const res = await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      toast.success("Product added successfully!");
      setProductDetail({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
      });
      setImage(null);
      setImagePreview("/default-image.jpg");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-2 md:p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add New Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-6"
        >
          {/* Image Upload */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Image
            </label>
            <div className="relative w-full border border-gray-300 rounded-md p-4 flex flex-col">
              {image ? (
                <LazyLoadImage
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full  aspect-square flex justify-center items-center ">
                  <p className="text-wrap text-center text-gray-500">Upload image to preview</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
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
                type="number"
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
                type="number"
                name="stock"
                value={productDetail.stock}
                onChange={handleInputChange}
                required
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
                className="w-full h-36 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`py-3 px-6  ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-white transition duration-200"
              }`}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
