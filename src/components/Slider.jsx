import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/navigation'
import Spinner from './Spinner'
SwiperCore.use([Navigation, Pagination, A11y, Autoplay])

function Slider() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser,
  })

  const name = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={3}
          pagination={{ clickable: true }}
          navigation
          modules={[Navigation, Pagination, A11y]}
          className='swiperSlideDiv'
          loop={true}
          autoplay={{ delay: 3000 }}
          speed={2200}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className='swiperSlideDiv'
                style={{
                  background: `url(${
                    data.imgUrls[
                      Math.floor(Math.random() * data.imgUrls.length)
                    ]
                  }) center no-repeat`,
                  backgroundSize: 'cover',
                  objectFit: 'cover',
                  height: '100vh',
                  width: 'auto',
                }}
              >
                <img src={id} alt='' className='h-full' />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
