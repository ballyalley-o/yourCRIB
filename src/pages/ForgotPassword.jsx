import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import {} from 'react-icons/fa'

function ForgotPassword() {
  const [ email, setEmail ] = useState('')

  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch(error) {
      toast.error('Failed to process submitted request')
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Forgot Password?</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <form onSubmit={onSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text"></span>
                </label>
                <label className="input-group input-group-vertical">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="demensia234@forget.com"
                    className="input input-bordered'
                      text:primary bg-white  focus:bg-primary focus:text-white  hover:ring-sky-500"
                    value={email}
                    onChange={onChange}
                  />
                  <button className="btn btn-primary focus:bg-warning">
                    <h4>Send reset link</h4>
                  </button>
                </label>
                <div className="content-center">
                  <button className="badge badge-error mt-10 text-md">
                    <Link to="/sign-in">
                      <h4 className="text-white">Sign-in instead</h4>
                    </Link>
                  </button>
                  <span></span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword
