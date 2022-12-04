import { useLocation, useNavigate, Link } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'



function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            //check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            //if user, doesnt exists create a user
             if (!docSnap.exists()) {
                    await setDoc(doc(db, 'users', user.uid), {
                        name: user.displayName,
                        email: user.email,
                        timestamp: serverTimestamp()
                    })
            }
            navigate('/')
        } catch (error) {
            toast.error('Could not log in with Google')
    }
}

  return (
    <>
      <div className="form-control pt-10">
        <p className="text-sm">
          {" "}
          or Sign {location.pathname === "/sign-up" ? "up" : "in"} with
        </p>
        <div className="grid grid-col-3">
          <button
            className="col-span-1 w-10 h-10 py-10"
            onClick={onGoogleClick}
          >
            <img src={googleIcon} className="rounded-lg " alt="google" />
          </button>
        </div>
      </div>
    </>
  );
}

export default OAuth