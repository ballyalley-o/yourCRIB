import { Link } from 'react-router-dom'
import bnbImage from '../assets/houses/bnbImage.jpeg'
import rentImage from "../assets/houses/rentImage.jpeg"
import sellImage from "../assets/houses/sellImage.jpeg";
import Slider from "../components/Slider"



function Explore() {
  return (
    <div>
      <main>
        {/* <h1 className="hero hero-content text-8xl text-center text-bolder justify-center p-20">
         Kia Ora!
        </h1> */}
        <div className="hero min-h-screen flex items-center">
          <div className="flex-1 max w-4x1 mx-auto p-10">
            <div className="grid grid-cols-3 grid-rows-15 grid-flow-row gap-5">
              <div className="col-span-3 pt-10 text-center p-10 rounded-xl ">
                <Slider />
              </div>

        <div className="col-span-3 hero min-h-screen static">
          <div className="hero-content flex-col lg:flex-row">
            <img src={rentImage} alt="rent" className="rounded-3xl" />
            <div>
              <h1 className="text-7xl pl-6 font-bold">Rent</h1>
              <p className="badge badge-accent text-lg ml-6">Places for rent</p>
              <p className="p-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <Link to="/category/rent" className="p-6">
                <button className="btn btn-accent text-lg">Book now</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-3 hero min-h-screen static">
          <div className="hero-content flex-col lg:flex-row">
            <img src={bnbImage} alt="bnb" className="rounded-3xl" />
            <div>
              <h1 className="text-7xl pl-6 font-bold">Bed & Breakfast</h1>
              <p className="badge badge-success ml-6">Places to BNB</p>
              <p className="p-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi. Lorem ipsum dolor sit amet.
              </p>
              <Link to="/category/bnb" className="p-6">
                <button className="btn btn-accent text-lg text-white">
                  Book now
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-3 hero min-h-screen static">
          <div className="hero-content flex-col lg:flex-row">
            <img src={sellImage} alt="sell" className="rounded-3xl" />
            <div>
              <h1 className="text-7xl pl-6 font-bold">Buy</h1>
              <p className="badge badge-primary text-lg ml-6">Places to Buy</p>
              <p className="p-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <Link to="/category/sale" className="p-6">
                <button className="btn btn-white text-lg bg-primary text-white">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        </div>
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore
