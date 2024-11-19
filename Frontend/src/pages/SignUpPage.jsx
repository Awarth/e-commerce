import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!passwordRegex.test(userDetail.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
      );
      return;
    }

    if (userDetail.password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setErrorMessage("");
    console.log("Signing up with:", userDetail);
    setUserDetail({
      name: "",
      email: "",
      password: "",
    });
    setConfirmPassword("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "confirmPassword") {
      setUserDetail((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={userDetail.name}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />

          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userDetail.email}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />

          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <div className="relative flex items-center border rounded">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userDetail.password}
              onChange={handleInputChange}
              className="px-3 py-2 w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 flex justify-center items-center text-xl pr-2"
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>

          <label htmlFor="confirmPassword" className="font-medium">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />

          <div className="text-sm text-gray-600 ">
            <p className="font-medium">Password Requirements:</p>
            <ul className="list-disc pl-6">
              <li>At least 8 characters long</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character (e.g., @$!%*?&)</li>
            </ul>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <p className="text-gray-600">
            Already have an account?
            <Link to={"/profile"} className="text-black font-medium">
              Log in
            </Link>
          </p>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded text-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
