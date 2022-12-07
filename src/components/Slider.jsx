import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/navigation";
import Spinner from './Spinner';
SwiperCore.use([ Navigation, Pagination, A11y, Autoplay ])

function Slider() {
    const auth = getAuth();
    const [ loading, setLoading ] = useState(true);
    const [ listings, setListings ] = useState(null);
    const [ formData, setFormData ] = useState({
        name: auth.currentUser
    })

    const name = formData;

    const navigate = useNavigate();


    useEffect(() => {
          const fetchListings = async () => {
          const listingsRef = collection(db, "listings");
          const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
          const querySnap = await getDocs(q);

          let listings = [];

          querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          setListings(listings);
          setLoading(false);
        };

    fetchListings()
    }, [])

    if(loading) {
        return <Spinner />
    }

     if (listings.length === 0) {
       return <></>;

     }
  return (
    listings && (
      <>
        <h1 className="text-8xl text-bolder p-20 justify-center">Kia Ora <i>manuhiri</i> </h1>
        <Swiper
          slidesPerView={3}
          pagination={{ clickable: true }}
          navigation
          modules={[Navigation, Pagination, A11y]}
          className="swiperSlideDiv"
          loop={true}
          autoplay={{ delay: 3000 }}
          speed={1200}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover,",
                }}
              >
                <img src={id} alt="" />
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  $
                  {(data.discountedPrice ?? data.regularPrice)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}
                    {data.type === 'rent' || data.type === 'bnb' ? '/ month' : null}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider