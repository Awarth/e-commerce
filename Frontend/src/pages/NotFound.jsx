import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl mt-4">
        Oops! The page you{`&apos;`}re looking for doesn{`&apos;`}t exist.
      </p>
      <NavLink to="/" className="mt-8 text-blue-500 underline">
        Go back to Home
      </NavLink>
    </div>
  );
};

export default NotFound;
