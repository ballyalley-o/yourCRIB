import { useNavigate, useLocation } from 'react-router-dom'
import { FaRocket, FaCommentDollar, FaUserAstronaut } from 'react-icons/fa'
import { FcShop } from "react-icons/fc";
import { GoMegaphone } from 'react-icons/go'

function Navbar() {
const navigate = useNavigate()
const location = useLocation()

const patchMatchRoute = (route) => {
    if(route === location.pathname) {
        return true
    }
}

  return (
    <div className="navbar bg-primary">
      <div
        className="flex-1 px-40 text-base-content cursor-pointer"
        onClick={() => navigate("/")}
        alt="home"
      >
        <span className="text-5xl animate-bounce text-secondary z-10">
          <FcShop />
        </span>
        <p
          className="pl-10 text-white bg-transparent absolute outline text-right
         hover:animate-pulse font-bold text-4xl px-5"
        >
          {"  "}your CRIB
        </p>
        <li
          className="tooltip tooltip-bottom tooltip-info"
          data-tip="home"
        ></li>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-10">
          <li
            onClick={() => navigate("/")}
            data-tip="Explore"
            className=" tooltip tooltip-bottom tooltip-info"
          >
            <p className="text-2xl text-white">
              <FaRocket fill={patchMatchRoute("/") ? "#be185d" : "#8f8f8f"} />
              Explore
            </p>
          </li>
          <li
            onClick={() => navigate("/deals")}
            data-tip="SAVINGS!"
            className=" tooltip tooltip-bottom tooltip-warning"
          >
            <p className="text-2xl text-white">
              <FaCommentDollar
                fill={patchMatchRoute("/deals") ? "#be185d" : "#8f8f8f"}
              />
              Deals
            </p>
          </li>
          <li
            onClick={() => navigate("/profile")}
            data-tip="Profile"
            className=" tooltip tooltip-bottom tooltip-info"
          >
            <p className="text-2xl text-white">
              <FaUserAstronaut
                fill={patchMatchRoute("/profile") ? "#be185d" : "#8f8f8f"}
              />
              Profile
            </p>
          </li>
          <li
            onClick={() => navigate("/create-listing")}
            data-tip="Create a new listing"
            className=" tooltip tooltip-bottom tooltip-info"
          >
            <p className="text-4xl text-white">
              <GoMegaphone
                fill={patchMatchRoute("/create-listing") ?
                    "#22c55e" : "#8f8f8f"}
              />
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar