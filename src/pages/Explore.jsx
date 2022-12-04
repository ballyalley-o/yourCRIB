import { Link } from 'react-router-dom'
import bnbImage from '../assets/houses/bnbImage.jpeg'
import rentImage from "../assets/houses/rentImage.jpeg"
import sellImage from "../assets/houses/sellImage.jpeg";
import Slider from "../components/Slider"



function Explore() {
  return (
    <div>
      <main>
        <h1 className="min-h-screen text-left text-8xl mx-auto text-light p-10">
          Explore
        </h1>
        <Slider />
        <div className="hero min-h-screen static">
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
        <div className="hero min-h-screen static">
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
        <div className="hero min-h-screen static">
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
                  Book now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore
