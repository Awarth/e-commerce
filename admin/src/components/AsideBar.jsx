import { NavLink } from "react-router-dom";
import { FaShoppingBag, FaClipboardList, FaUser } from "react-icons/fa";

function AsideBar() {
  return (
    <aside className="hidden sticky top-0 left-0 max-w-[12rem] min-w-[12rem] w-full h-screen bg-white border-r md:flex flex-col justify-between items-center py-6 px-2 z-50 shadow-md">
      <div className="flex flex-col gap-4 w-full">
        {/* Products Link */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:bg-blue-50 hover:text-blue-500`
          }
        >
          <FaShoppingBag className="text-lg" />
          <span>Products</span>
        </NavLink>

        {/* Orders Link */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${
              isActive
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:bg-blue-50 hover:text-blue-500`
          }
        >
          <FaClipboardList className="text-lg" />
          <span>Orders</span>
        </NavLink>
      </div>

      {/* Profile Link */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `w-full flex items-center gap-3 p-2 rounded-md ${
            isActive
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-700"
          } hover:bg-blue-50 hover:text-blue-500`
        }
      >
        <FaUser className="text-lg" />
        <span>Profile</span>
      </NavLink>
    </aside>
  );
}

export default AsideBar;
