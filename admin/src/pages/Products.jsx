import { useEffect, useState } from "react";
import CategoryTypes from "../utility/CategoryTypes";
import ProductCard from "../components/ProductCard";
import api from "../utility/setUpAxios";
import Loader from "../components/Loader";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [change, setChange] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product", {
        params: {
          category: selectedCategory,
          query: query,
          page: currentPage,
        },
      });
      setProducts(res.data.data.products);
      setError("");
      setCurrentPage(res.data.data.currentPage);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Error while fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, query, currentPage, change]);

  const handleCategoryChange = (event) => {
    setSearchValue("");
    setQuery("");
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    setQuery(searchValue);
    setCurrentPage(1);
  };

  const handleAddNavigate = () => {
    navigate("/add-product");
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[1960px]">
      {error ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <p className="text-2xl text-[gray]">{error}</p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4 mb-20 md:m-0">
          <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 border-b border-gray-200">
            <form
              onSubmit={handleQuerySubmit}
              className="flex items-center border border-gray-300 rounded overflow-hidden w-full max-w-[500px]"
            >
              <input
                type="search"
                placeholder="Search products..."
                className="px-4 py-2 w-full outline-none"
                value={searchValue}
                onChange={handleInputChange}
              />
              <button type="submit" className="px-4">
                <FaSearch className="text-lg" />
              </button>
            </form>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-2 border border-gray-300 rounded w-full max-w-[200px]"
            >
              <option value="">Select Category</option>
              {Object.keys(CategoryTypes).map((key, index) => (
                <option key={index} value={CategoryTypes[key]}>
                  {CategoryTypes[key]}
                </option>
              ))}
            </select>
            <button
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              onClick={handleAddNavigate}
            >
              + Add Product
            </button>
          </div>

          {products && products.length > 0 ? (
            <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 cursor-pointer">
              {products.map((item) => (
                <ProductCard
                  key={item._id}
                  detail={item}
                  setChange={setChange}
                  setLoading={setLoading}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-[80vh] flex flex-col justify-center items-center text-gray-600 text-xl">
              <p>No products found</p>
              <button
                className="mt-4 bg-[black] text-white px-4 py-2 transition-all duration-200 ease-in "
                onClick={() => {
                  setSearchValue("");
                  setQuery("");
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex w-full justify-between items-center text-xl">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className={`ml-2 border rounded py-1 px-3 cursor-pointer ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                Prev
              </button>
              <p>
                {currentPage} of {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className={`mr-2 border rounded py-1 px-3 cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;
