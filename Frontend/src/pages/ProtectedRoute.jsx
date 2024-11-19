import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && showLoginModal) {
    return <LoginModal closeModal={() => setShowLoginModal(false)} />;
  }

  return element;
};

export default ProtectedRoute;
