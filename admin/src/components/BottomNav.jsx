import { NavLink } from "react-router-dom";
import { FaHome, FaShoppingBag, FaUser } from "react-icons/fa";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 flex md:hidden w-full h-fit bg-[#ffffff8b] bg-opacity-50 backdrop-blur border-t justify-center items-center px-0 py-4 z-50 shadow-lg">
      <div className="h-full w-full flex justify-around items-center flex-row text-sm">
        {/* Products Link */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            } hover:text-blue-400`
          }
        >
          <FaShoppingBag className="text-xl" />
          <span>Products</span>
        </NavLink>

        {/* Orders Link */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            } hover:text-blue-400`
          }
        >
          <FaHome className="text-xl" />
          <span>Orders</span>
        </NavLink>

        {/* Profile Link */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            } hover:text-blue-400`
          }
        >
          <FaUser className="text-xl" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
}

export default BottomNav;
