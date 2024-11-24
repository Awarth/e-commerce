import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router";
import api from "../utility/setUpAxios";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/authSlice";
import Loader from "../components/Loader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/user/login", { email, password });
      setError("Failed to login try again");
      dispatch(
        login({
          user: res.data.user,
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
        })
      );
      navigate("/products");
    } catch (err) {
      console.log("Error while login", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
      setError("");
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/sign-up");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white relative flex flex-col p-6 rounded-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-2">Login</h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <div className="relative w-full flex justify-between items-center border overflow-hidden rounded">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 w-full outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" text-gray-600 flex justify-center items-center text-xl pr-2"
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
            <p className="text-[grey]">
              Doesn&apos;t have an account?{" "}
              <span
                onClick={handleSignUpRedirect}
                className="text-[black] font-medium cursor-pointer"
              >
                Sign up
              </span>{" "}
            </p>
            <button
              type="submit"
              className="btn btn-primary w-full mt-1 border px-3 py-2 bg-black text-white rounded text-lg"
            >
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
