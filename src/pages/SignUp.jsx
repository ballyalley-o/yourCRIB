import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import OAuth from "../components/OAuth"
import { toast } from "react-toastify"
import { db } from "../firebase.config"
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import {
  FaUserAstronaut,
  FaLock,
  FaGlobe,
  FaLessThan,
  FaChild
} from "react-icons/fa"


function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try{
        const auth = getAuth()

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        const user = userCredential.user

        updateProfile(auth.currentUser, {
            displayName: name
        })

        const formDataCopy = {
            ...formData
        }
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()

        await setDoc(doc(db, 'users', user.uid), formDataCopy)

        navigate('/')
    }catch (error) {
        toast.error('Check the required fields')
    }
  }

  return (
    <>
      <div className="hero min-h-screen m-0 bg-base-200">
        <div className="hero-content flex-col m-0 g:flex-row-reverse">
          <div className="text-center ">
            <h1 className="text-8xl text-center font-bold mt-20">Join Us, Roomie!</h1>
            <p className="hero py-6 justify-evenly text-center my-10">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl p-10 mb-20 bg-gray">
              <div className="card-body">
                <div className="form-control">
                  <label className="input-group py-5">
                    <span className="label-text text-xl">
                      <FaChild />
                    </span>
                    <input
                      type="text"
                      placeholder="Space Hopkins"
                      className="input input-bordered hover:ring-sky-500 text:primary bg-white  focus:bg-primary focus:text-white"
                      id="name"
                      value={name}
                      onChange={onChange}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="input-group py-5">
                    <span className="label-text text-xl">
                      <FaUserAstronaut />
                    </span>
                    <input
                      type="email"
                      placeholder="human876@earth.com"
                      className="input input-bordered hover:ring-sky-500 text:primary bg-white  focus:bg-primary focus:text-white "
                      id="email"
                      value={email}
                      onChange={onChange}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="input-group py-5">
                    <span className="label-text text-xl">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="input input-bordered hover:ring-sky-500 text:primary bg-white  focus:bg-primary focus:text-white"
                      id="password"
                      value={password}
                      onChange={onChange}
                    />
                  </label>
                  {/* <span>
                    <FaEye
                      alt="show password"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  </span> */}
                  <label className="label text-sm">
                    <Link to="/forgot-password">Forgot password?</Link>
                  </label>
                </div>
                <div className="form-control mt-6 px-5">
                  <button className="btn btn-secondary text-white">
                    <FaGlobe fill="#fcd34d" />
                    Sign up
                  </button>
                  <div className="pt-5">
                    <button className="btn btn-info px-10">
                      <span>
                        <FaLessThan fill="#ec4899" />
                      </span>
                      <Link to="/sign-in">Sign in</Link>
                    </button>
                  </div>
                  <OAuth />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
