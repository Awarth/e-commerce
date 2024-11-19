import { useNavigate } from "react-router";
import hero from "../assets/images/img.png";

function Home() {

  const navigate = useNavigate();

  const handleRedirect = ()=>{
    navigate('/products')
  }

  return (
    <div className="flex w-full justify-center items-center bg-gray-50">
      <div className="max-w-[1440px] w-full flex flex-col md:flex-row items-center justify-center px-2 py-4 md:px-8  gap-4 ">
        {/* Text Section */}
        <div className="w-full md:w-[50%] h-full p-2 sm:p-6 ">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 w-full md:w-[80%] lg:w-[60%] leading-tight">
            Welcome to Our Premium Shop
          </h1>
          <p className="text-gray-600 leading-relaxed text-xl w-full lg:w-[90%]">
            Explore a wide range of exclusive products tailored to meet your
            needs. From fashion to tech, we’ve got everything you need, all in
            one place. Shop now and elevate your lifestyle with our premium
            collection.
          </p>
          <button onClick={handleRedirect} className="mt-6 px-6 py-3 bg-black text-white text-lg hover:bg-gray-800">
            Shop Now
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[50%]">
          <img
            src={hero}
            alt="Hero"
            className="w-full rounded-md object-cover aspect-square"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
