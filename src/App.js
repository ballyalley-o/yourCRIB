import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Explore from './pages/Explore'
import PrivateRoute from './components/PrivateRoute'
import ForgotPassword from './pages/ForgotPassword'
import Category from './pages/Category'
import Deals from './pages/Deals'
import Profile from './pages/Profile'
import SingleListing from "./pages/SingleListing";
import CreateListing from './pages/CreateListing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Contact from './pages/Contact'


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/category/:catgeoryName/:listingId" element={<SingleListing />} />
          <Route path="/contact/:landlordId" element={<Contact/>} />
        </Routes>
      </Router>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default App
