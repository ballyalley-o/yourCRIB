import { useLocation, useNavigate, Link } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { FaGoogle } from 'react-icons/fa'
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
      <div className='form-control'>
        <div className=''>
          <button className='col-span-1 w-full flex justify-center gap-2 h-10 my-5' onClick={onGoogleClick}>
             Sign In with Google <FaGoogle size={25} />
          </button>
        </div>
      </div>
    </>
  )
}

export default OAuth