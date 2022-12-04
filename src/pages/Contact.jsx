import { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'



function Contact() {
    const [ message, setMessage ] = useState('')
    const [ landlord, setLandlord ] = useState(null)
    const [ searchParams, setSearchParams ] = useSearchParams()
    const [formData, setFormData] = useState({
    type: "bnb",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    });




    const params = useParams()
    const navigate = useNavigate()

    const auth = getAuth();
    const isMounted = useRef(true);

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setLandlord(docSnap.data())
            } else {
                toast.error('can not find the Owner contact info')

            }
        }

        getLandlord()

    }, [params.landlordId])


     useEffect(() => {
       if (isMounted) {
         onAuthStateChanged(auth, (user) => {
           if (user) {
             setFormData({ ...formData, userRef: user.uid });
           } else {
             navigate("/sign-in");
           }
         })}

       return () => {
         isMounted.current = false;
       };
       //eslint-disable-next-line react-hooks/exhaustive-deps
     }, [isMounted]);

    const onChange = (e) => setMessage(e.target.value)



  return (
    <div className="hero min-h-screen bg-base-200">
      <h1 className="hero-content text-5xl block w-full font-light">
        Contact the Owner
      </h1>
      <div className="hero-content text-center">
        <main>
          {landlord !== null && (
            <div className="hero hero-content">
              <div className="card w-96 bg-white shadow-xl">
                <div className="grid grid-col-4 grid-row-2 justify-start card-body">
                  <h2 className="card-title">Contact</h2>
                  <p className="text-2xl text-base-300 card-title">
                    {landlord?.name}
                  </p>
                  <div className="cols-span-2 card-actions justify-end">
                    <form className="">
                      <div className="messageDiv">
                        <label
                          htmlFor="message"
                          className="card-title text-sm pt-2 content-right font-bold"
                        >
                          Message
                        </label>
                      </div>
                      <div className="justify-start py-3  ">
                        <textarea
                          name="message"
                          id="message"
                          className="textarea text-base-300 bg-amber shadow-lg w-80"
                          value={message}
                          onChange={onChange}
                        ></textarea>
                      </div>
                      <a
                        href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                        <button type="button" className="btn btn-primary justify-end">
                          Send message
                        </button>
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Contact