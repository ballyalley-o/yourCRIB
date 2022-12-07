import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/bundle"
import "swiper/css/navigation"
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { AiFillDollarCircle } from 'react-icons/ai'
import { MdOutlineBed } from "react-icons/md";
import { FaCarAlt } from "react-icons/fa";
import { TbBath, TbSofa } from "react-icons/tb";
import { BiShareAlt } from "react-icons/bi";

// SwiperCore.use([ Navigation, Pagination, Scrollbar, A11y ])

function SingleListing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />
  }
  return (
    <main>
      <Helmet>
        <title>{listing.name}</title>
      </Helmet>
      <div className=""></div>
      <div className="hero min-h-screen flex items-center">
        <div className="flex-1 max w-4x1 mx-auto p-10">
          <div className="grid grid-cols-6 grid-rows-4 gap-10 grid-flow-row w-full h-100 z-40">
            <div className="col-span-3 row-span-1 text-center  p-10">
              <Swiper
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                className="swiperSlideDiv"
                scrollbar={{ draggable: true }}
                loop={true}
              >
                {listing.imgUrls.map((index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="swiperSlideDiv object-fill"
                      style={{
                        background: `url(${listing.imgUrls[index]}) center no-repeat`,
                        backgroundSize: "fill",
                      }}
                    >
                      <img src={[index]} alt="" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="col-span-2 row-span-2 w-auto">
              <div className="grid-flow-row my-10 pr-5">
                <span
                  className="btn btn-outline cursor-pointer mr-5 "
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => {
                      setShareLinkCopied(false);
                    }, 2000);
                  }}
                >
                  <span className="text-xl ">
                    <BiShareAlt />
                  </span>
                </span>
                {shareLinkCopied && (
                  <div
                    className="tooltip tooltip-open text-white tooltip-info tooltip-no-arrow"
                    data-tip="Copied!"
                  ></div>
                )}
                <p className="badge badge-outline text-white font-bold text-xl p-5">
                  {" "}
                  <i>for </i>{" "}
                  {listing.type === "rent"
                    ? "Rent"
                    : listing.type === "bnb"
                    ? "BNB"
                    : "Sale"}
                </p>
              </div>
              <h1 className="w-full text-5xl text-left text-white font-bold py-10 pr-5">
                {listing.name}
              </h1>
              <h1 className="w-full text-5xl text-left text-white font-bold py-5">
                <br />$
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" || listing.type === "bnb" ? (
                  <p className="badge badge-outline text-sm ml-2">/ month</p>
                ) : null}
              </h1>

              <p className="block text-2xl text-left">{listing.location}</p>
              <div className="w-full py-5">
                {listing.offer && (
                  <p className="badge badge-warning text-xl">
                    <AiFillDollarCircle />
                    {(listing.regularPrice - listing.discountedPrice)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    discount
                  </p>
                )}
              </div>

              <ul className="col-span-1 stats shadow stats-vertical bg-outline text-lg text-white-300">
                <li className="stat flex justify-start">
                  <div className="stat-figure text-primary text-xl">
                    <MdOutlineBed />
                  </div>
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} Bedrooms`
                    : "1 Bedroom"}
                </li>
                <li className="stat flex justify-start">
                  <div className="stat-figure text-primary text-xl">
                    <TbBath />
                  </div>
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Bathrooms`
                    : "1 Bathroom"}
                </li>
                <li className="stat flex justify-start">
                  <div className="stat-figure text-primary text-xl">
                    <FaCarAlt />
                  </div>
                  {listing.parking ? `Parking Spot Available` : "Offstreet"}
                </li>
                <li className="stat flex justify-start">
                  <div className="stat-figure text-primary text-xl">
                    <TbSofa />
                  </div>
                  {listing.furnished && "Furnished"
                    ? "Fully Furnished"
                    : "Not Furnished"}
                </li>
              </ul>
              <h1 className="text-2xl pt-10">Location</h1>
              <div className="col-span-5 leafletContainer rounded-2xl mt-5">
                <MapContainer
                  style={{ height: "100%", width: "100%" }}
                  center={[listing.geolocation.lat, listing.geolocation.lng]}
                  zoom={17}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      listing.geolocation.lat,
                      listing.geolocation.lng,
                    ]}
                  >
                    <Popup>{listing.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>

              {auth.currentUser?.uid !== listing.userRef && (
                <Link
                  to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                  className="btn btn-primary"
                >
                  Contact Owner
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SingleListing;
