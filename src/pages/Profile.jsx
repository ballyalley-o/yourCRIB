import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc } from "firebase/firestore"
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BiRightArrow } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { FcExport } from "react-icons/fc"


function Profile() {
    const auth = getAuth()
    const [ changeDetails, setChangeDetails ] = useState(false)
    const [ formData, setFormData ] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    // const [ proName, setProName ] = useState()

    const { name, email } = formData

    const navigate = useNavigate()

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

    const profileNameChange = () => {
      if (name.endsWith('s')){
        return `${name}${'\' CRIB'}`
      } else {
        return `${name}${'\'s CRIB'}`
      }
    }

  return (
    <>
      <div className="hero min-h-screen mx-auto bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://placeimg.com/260/400/arch"
            className="max-w-sm rounded-lg shadow-2xl"
            />
          <span className="inline-block">
            <p
              className="btn btn-accent subpixel-antialiased text-lg "
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "edit"}
            </p>
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
                  Create your listing
                  <BiRightArrow />
                </button>
              </div>
            </Link>
            <div className="pt-40">
              <button
                type="button"
                className="btn btn-accent text-xl"
                onClick={onLogout}
              >
                <span className="text-4xl">
                  <FcExport />
                </span>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile