import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import OAuth from '../components/OAuth'
import { toast } from 'react-toastify'
import {
  FaUserAstronaut,
  FaLock,
  FaEye,
  FaGlobe,
  FaGreaterThan,
} from "react-icons/fa";


function SignIn() {
    const [ showPassword, setShowPassword ] = useState(false)
    const [ formData, setFormData ] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth();

            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );

            if (userCredential.user) {
              navigate("/");
            }
        } catch (error) {
            toast.error('Incorrect Email/Password')
        }
    }

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-left lg:text-left">
            <h1 className="text-8xl font-bold ml-5">Welcome Back, Roomie!</h1>
            <p className="py-6 ml-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl p-10 bg-base-100">
              <div className="card-body">
                <div className="form-control">
                  <label className="input-group py-5">
                    <span className="label-text text-xl">
                      <FaUserAstronaut />
                    </span>
                    <input
                      type="text"
                      placeholder="human876@earth.com"
                      className="input input-bordered bg-white text-primary focus:text-white focus:bg-primary hover:ring-sky-500"
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
                      className="input input-bordered'
                      text:primary bg-white  focus:bg-primary focus:text-white  hover:ring-sky-500"
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
                <div className="form-control text-white p-6">
                  <button className="btn btn-secondary text-white">
                    <FaGlobe fill="#fcd34d" />
                    Sign in
                  </button>
                  <div className="pt-5">
                    <button className="btn btn-info px-10 text-base-400">
                      <Link to="/sign-up">Join us</Link>
                      <FaGreaterThan fill="#ec4899" />
                    </button>
                    <OAuth />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn