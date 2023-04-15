import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore"
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import { BiRightArrow } from "react-icons/bi";
import { FcExport, FcEditImage } from "react-icons/fc"
import { MdFileDownloadDone } from "react-icons/md"
import ProfilePicture from '../components/ProfilePicture'



function Profile() {
    const auth = getAuth()
    const [ loading, setLoading ] = useState(true)
    const [ listings, setListings ] = useState(null)
    const [ changeDetails, setChangeDetails ] = useState(false)
    const [ formData, setFormData ] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })


    // const [ proName, setProName ] = useState()

    const { name, email } = formData

    const navigate = useNavigate()

    useEffect(() => {
      const fetchUserListings = async () => {
        const listingsRef = collection(db, "listings")
        const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))


      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try{
            if (auth.currentUser.displayName !== name) {
                //update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name,
                })
                // update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error('Couldn\'t update Profile')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (listingId) => {
      if (window.confirm('Are you sure you want to delete?')) {
        await deleteDoc(doc(db, 'listings', listingId))
        const updatedListings = listings.filter((listing) => listing.id !== listingId)
        setListings(updatedListings)
        toast.success('Successfully deleted your listing')

      }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    const profileNameChange = () => {
      if (name.endsWith('s')){
        return `${name}${'\' CRIB'}`
      } else {
        return `${name}${'\'s CRIB'}`
      }
    }

  return (
    <>
      <div className="hero min-h-screen mx-auto">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <ProfilePicture />
          <span className="inline-block">
            <p
              className="btn btn-accent subpixel-antialiased text-lg"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? (
                <span
                  className="text-4xl tooltip tooltip-left tooltip-info"
                  data-tip="Done"
                >
                  <MdFileDownloadDone />
                </span>
              ) : (
                <span
                  className="text-4xl tooltip tooltip-left tooltip-info"
                  data-tip="edit"
                >
                  <FcEditImage />
                </span>
              )}
            </p>
            <div className="pt-10">
              <button
                type="button"
                className="btn btn-accent text-xl subpixel-antialiased tooltip tooltip-left tooltip-info"
                data-tip="Log out"
                onClick={onLogout}
              >
                <span className="text-4xl">
                  <FcExport />
                </span>
              </button>
            </div>
          </span>

          <div>
            <h1 className="text-8xl font-bold">{profileNameChange()}</h1>
            <main>
              <div className="text-md font-bold py-5">
                <p className="stat-value subpixel-antialiased py-5 text-accent text-xl">
                  Personal Details
                </p>
              </div>
            </main>
            <div className="text-2xl rounded-bl-box gap-6">
              <form className="col-span-3 -shrink">
                <input
                  type="text"
                  id="name"
                  className={
                    !changeDetails ? "profileName" : "profileNameActive"
                  }
                  disabled={!changeDetails}
                  value={name}
                  onChange={onChange}
                />
                <br />
                <br />
                <input
                  type="email"
                  id="email"
                  className={
                    !changeDetails ? "profileEmail" : "profileEmailActive"
                  }
                  disabled={!changeDetails}
                  value={email}
                  onChange={onChange}
                />
              </form>
            </div>

            <div className="stat bg-ghost p-20">
              <div className="stat-value p-5">Bio:</div>
              <p className="stat-figure text-secondary py-6">
                "Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi."
              </p>
            </div>
            <Link to="/create-listing" className="">
              <div className="btn-group btn-group place-content-start">
                <button className="btn btn-active ">
                  Create your own listing
                  <BiRightArrow />
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {!loading && listings?.length > 0 && (
        <>
          <p className="text-8xl text-center mx-50 p-10">Your Listings</p>
          <div className="container mx-auto">
            <div className="grid grid-cols-4 grid-rows-2 gap-4 grid-flow-row">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile