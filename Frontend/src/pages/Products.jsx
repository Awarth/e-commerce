import { useEffect, useState } from "react";
import CategoryTypes from "../utility/CategoryTypes";
import ProductCard from "../components/ProductCard";
import api from "../utility/setUpAxios";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

function Products() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useSelector((state) => state.search.query);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product", {
        params: {
          category: selectedCategories,
          query: query,
        },
      });
      console.log(res.data.data);
      setProducts(res.data.data.products);
      setError("");
      setCurrentPage(res.data.data.currentPage);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      setError("Failed to fetch products");
      console.log("Error while fetching products : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, selectedCategories]);

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row w-full max-w-[1960px]">
      <div className="p-4 w-full sm:min-w-[15rem] max-w-[15rem] h-full">
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <ul className="text-gray-800">
          {Object.keys(CategoryTypes).map((key, index) => (
            <li key={index} className="flex items-center gap-2 mb-1 text-lg">
              <input
                type="checkbox"
                id={key}
                value={CategoryTypes[key]}
                checked={selectedCategories.includes(CategoryTypes[key])}
                onChange={() => handleCheckboxChange(CategoryTypes[key])}
                className="cursor-pointer"
              />
              <label htmlFor={key} className="cursor-pointer">
                {CategoryTypes[key]}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {error ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <p className="text-2xl text-[gray]">{error}</p>
        </div>
      ) : (
        <div className=" flex flex-col gap-4">
          <div className="w-full border-l border-b p-4 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 cursor-pointer">
            {products && products.length > 0 ? (
              products.map((item) => (
                <ProductCard key={item._id} detail={item} />
              ))
            ) : (
              <p className="text-gray-600 text-xl w-full text-center aspect-square flex justify-center items-center">No products found.</p>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex w-full justify-between items-center text-xl">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={1}
                className="ml-2 border rounded py-1 px-3 cursor-pointer bg-[white] text-[black] duration-300 ease-in transition-all hover:bg-[black] hover:text-[white]"
              >
                Prev
              </button>
              <p>
                {currentPage} of {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={totalPages}
                className="mr-2 border rounded py-1 px-3 cursor-pointer bg-[white] text-[black] duration-300 ease-in transition-all hover:bg-[black] hover:text-[white]"
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
