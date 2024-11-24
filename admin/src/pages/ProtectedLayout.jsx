import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AsideBar from "../components/AsideBar";
import BottomNav from "../components/BottomNav";

const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <AsideBar />
      <BottomNav />
      <div className="p-3 sm:p-6 w-full h-screen overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
