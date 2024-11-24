import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRedirect = () => {
    navigate("/products");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      {/* Main Heading */}
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
        Luxera Admin Panel
      </h2>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="px-6 py-3 mb-4 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
      >
        Login
      </button>

      {/* Admin Section Button */}
      <button
        onClick={handleRedirect}
        className="px-6 py-3 text-lg font-medium text-blue-600 border-2 border-blue-600 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
      >
        Admin Section
      </button>
    </div>
  );
}

export default Home;
