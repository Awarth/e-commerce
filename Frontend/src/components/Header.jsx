import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaRegUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../redux/slices/searchSlice";
import api from "../utility/setUpAxios";

function Header() {
  const [scrollValue, setScrollValue] = useState(0);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [fetchItems, setFetchItems] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [active, setActive] = useState("home");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const handleScroll = () => setScrollValue(window.scrollY);

    const updateCartCount = async () => {
      if (isAuthenticated) {
        try {
          const res = await api.get(`/cart`);
          const cartItems = res.data.data.products || [];
          setCartCount(cartItems.length);
          setFetchItems(true);
        } catch (error) {
          console.error("Error fetching cart items from backend:", error);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(localCart.length);
      }
    };

    updateCartCount();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated, fetchItems]);

  const handleOpenSidebar = () => setSidebarIsOpen(true);
  const handleCloseSidebar = (value) => {
    setActive(value);
    setSidebarIsOpen(false);
  };
  const handleHomeNavigate = () => navigate("/");
  const handleInputChanges = (e) => setSearchValue(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));
    setShowSearchInput(false)
    navigate("/products");
  };

  const toggleSearchInput = () => setShowSearchInput(!showSearchInput);

  return (
    <>
      <header
        className={`w-full sticky top-0 px-2 sm:px-4 md:px-8 flex flex-col items-center backdrop-blur-lg duration-300 transition-all ease-in z-20 ${
          scrollValue > 60
            ? "bg-[#ffffff3d] text-black py-1"
            : "bg-[#0000003d] text-white py-2"
        }`}
      >
        <nav className="max-w-[1960px] w-full">
          <div
            className={`w-full flex justify-between items-center md:border-b py-2 ${
              scrollValue > 60 ? "border-[#00000059]" : "border-[#ffffff79]"
            }`}
          >
            <h2
              className="text-4xl font-medium cursor-pointer"
              onClick={handleHomeNavigate}
            >
              Luxera
            </h2>

            {/* Search input for larger screens */}
            <form
              onSubmit={handleSearchSubmit}
              className={`hidden md:flex rounded-md overflow-hidden border ${
                scrollValue > 60 ? "border-[#00000079]" : "border-[#ffffff79]"
              }`}
            >
              <input
                type="search"
                name="searchBar"
                value={searchValue}
                onChange={handleInputChanges}
                className={`bg-transparent px-2 py-1 focus:outline-none ${
                  scrollValue > 60
                    ? "placeholder-[#000000b1]"
                    : "placeholder-[#ffffffb1]"
                }`}
                placeholder="Search..."
                aria-label="Search"
              />
              <button type="submit" className="pr-1">
                <FaSearch />
              </button>
            </form>

            {/* Search and Menu for small screens */}
            <div className="flex gap-4 md:hidden items-center">
              {!showSearchInput ? (
                <FaSearch
                  onClick={toggleSearchInput}
                  className="text-2xl cursor-pointer"
                />
              ) : (
                <FaXmark
                  onClick={toggleSearchInput}
                  className="text-2xl cursor-pointer"
                />
              )}
              <IoMenuOutline
                onClick={handleOpenSidebar}
                className="text-4xl cursor-pointer"
              />
            </div>
          </div>

          {/* Navigation links for larger screens */}
          <div className="hidden md:flex justify-between items-center gap-4 text-xl py-2">
            <div className="flex items-center gap-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">All Products</NavLink>
            </div>
            <div className="flex items-center gap-4">
              <NavLink to="/cart" className="relative">
                Cart
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-2 rounded-full bg-black text-white text-xs w-4 h-4 flex justify-center items-center">
                    {cartCount}
                  </div>
                )}
              </NavLink>
              <NavLink to="/profile">
                <FaRegUser className="text-lg cursor-pointer" />
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Search Input for Small Screens */}
        {showSearchInput && (
          <form
            onSubmit={handleSearchSubmit}
            className="flex md:hidden w-full "
          >
            <input
              type="search"
              name="searchBar"
              value={searchValue}
              onChange={handleInputChanges}
              className="w-full bg-gray-100 text-black px-2 py-2 rounded-l-md focus:outline-none"
              placeholder="Search..."
              aria-label="Search"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 rounded-r-md"
            >
              Search
            </button>
          </form>
        )}
      </header>

      {/* Sidebar for Small Screens */}
      {sidebarIsOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black opacity-50 z-40"
          onClick={handleCloseSidebar}
        ></div>
      )}
      <aside
        className={`h-screen fixed md:hidden top-0 right-0 bg-white max-w-[400px] w-full transition-transform duration-300 ease-in-out z-50 ${
          sidebarIsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full relative flex flex-col gap-4 justify-center items-center text-2xl">
          <IoMdClose
            onClick={handleCloseSidebar}
            className="text-4xl absolute right-2 top-2 cursor-pointer"
          />
          <NavLink
            to="/"
            className={`${
              active === "home" ? "text-black font-semibold" : "text-gray-600"
            } block`}
            onClick={() => handleCloseSidebar("home")}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={`${
              active === "products"
                ? "text-black font-semibold"
                : "text-gray-600"
            } block`}
            onClick={() => handleCloseSidebar("products")}
          >
            All Products
          </NavLink>
          <NavLink
            to="/cart"
            className={`${
              active === "cart" ? "text-black font-semibold" : "text-gray-600"
            } block relative`}
            onClick={() => handleCloseSidebar("cart")}
          >
            Cart
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-4 rounded-full bg-black text-white text-xs w-4 h-4 flex justify-center items-center">
                {cartCount}
              </div>
            )}
          </NavLink>
          <NavLink
            to="/profile"
            className={`${
              active === "profile"
                ? "text-black font-semibold"
                : "text-gray-600"
            } block`}
            onClick={() => handleCloseSidebar("profile")}
          >
            Profile
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Header;
