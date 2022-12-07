import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { FcPlus } from "react-icons/fc";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { FcRating } from 'react-icons/fc'

function CreateListing() {
  //eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)

    if(discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error('discounted price needs to be less than regular price')
      return
    }

    if(images.length > 6) {
      setLoading(false)
      toast.error('Cannot exceed 6 images')
      return
    }

    let geolocation = {}
    let location

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?
      address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

      location =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address

          if (location === undefined || location.includes("undefined")) {
            setLoading(false)
            toast.error('Please enter a correct address')
            return
          }

    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
    }

    //stores images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage, 'images/' + fileName)
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
                default:
                  break
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false);
        toast.error('failed to upload images')
        return
      })

      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp()
      }

      formDataCopy.location = address
      delete formDataCopy.images
      delete formDataCopy.address
      !formDataCopy.offer && delete formDataCopy.discountedPrice

      const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
      setLoading(false)
      toast.success('successfully added your new Listing')
      navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = true;
    }

    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    //text/bool/nums
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <h1 className="text-8xl text-bolder justify-center p-10">
        Create a Listing
      </h1>
      <div className="min-h-screen flex justify-center bg-stone-200">
        <main>
          <form className="flex-1 max-w-3x1 mx-auto p-10" onSubmit={onSubmit}>
            <div className="">
              <div className="grid grid-cols-8 grid-rows-2 gap-4 grid-flow-row">
                <label className="col-span-1 uppercase text-white text-lg font-bold mb-2">
                  Type:
                </label>
                <button
                  type="button"
                  className={
                    type === "sale" ? "formButtonActive" : "formButton"
                  }
                  onClick={onMutate}
                  id="type"
                  value="sale"
                >
                  Sell
                </button>
                <button
                  type="button"
                  className={type === "bnb" ? "formButtonActive" : "formButton"}
                  onClick={onMutate}
                  id="type"
                  value="bnb"
                >
                  BNB
                </button>
                <button
                  type="button"
                  className={
                    type === "rent" ? "formButtonActive" : "formButton"
                  }
                  onClick={onMutate}
                  id="type"
                  value="rent"
                >
                  Rent
                </button>
              </div>
              {/* <span className="pointer-events-none absolute bg-gradient-to-bl inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span> */}
            </div>
            <label className="block uppercase tracking-tight text-white text-xs focus:bg-primary font-bold mb-2">
              Name
            </label>
            <input
              className="col-span-6 w-1/2 bg-white text-primary border border-red-500 rounded-xl py-3 px-4 mb-3 focus:outline-none focus:bg-primary focus:text-white"
              type="text"
              value={name}
              id="name"
              onChange={onMutate}
              placeholder="Humanoid"
              minLength="10"
              maxLength="30"
              required
            />
            <p className="text-red-500 text-xs italic">
              Please fill out this field.
            </p>

            <div className="w-full md:w-1/2 px-3"></div>

            <div className="grid grid-cols-6 grid-rows-1 w-full gap-8 grid-flow-row my-20">
              <div className="col-span-2 ">
                <label
                  className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Address
                </label>
                <textarea
                  className="col-span-2 w-full text-primary formInputAddress focus:bg-primary focus:text-white mb-3"
                  id="address"
                  value={address}
                  onChange={onMutate}
                  type="address"
                  placeholder="234-b Asteroid block, Flangbush, Mars, 1234 "
                  required
                />
                <p className="text-gray-600 text-xs italic mt-3">
                  Please provide your complete address.
                </p>
              </div>

              {!geolocationEnabled && (
                <span className="col-span-2 gap-y-8">
                  <span className="">
                    <label
                      className="block uppercase text-white focus:text-primary text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      {" "}
                      Latitude
                    </label>
                    <input
                      className="input input-bordered input-xs p-5 bg-white focus:bg-primary focus:text-white"
                      type="number"
                      id="latitude"
                      value={latitude}
                      onChange={onMutate}
                      required
                    />{" "}
                  </span>
                  <span className="flex flex-wrap w-1/4 mt-5">
                    <label className="block uppercase text-white focus:text-primary text-xs font-bold mb-2">
                      Longitude
                    </label>
                    <input
                      className="input input-bordered input-xs p-5 bg-white focus:bg-primary focus:text-white"
                      type="number"
                      id="longitude"
                      value={longitude}
                      onChange={onMutate}
                      required
                    />
                  </span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-12 w-full grid-rows-1 gap-8 grid-flow-row">
              <div className="">
                <label className="block uppercase font-bold tracking-tight text-white text-xs mb-2">
                  Bedrooms
                </label>
                <input
                  className="col-span-6 input input-bordered
                bg-white text-primary
                input-sm p-5 mb-2
                focus:text-white
                focus:bg-primary"
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
              <div className="">
                <label className="block uppercase text-white text-xs font-bold mb-2 ">
                  Bathroom
                </label>
                <input
                  className="col-span-6 w-100% input input-bordered
                  bg-white text-primary
                  input-sm p-5 mb-2
                  focus:text-white
                  focus:bg-primary"
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-6 col-row-1 w-1/3  gap-4 grid-flow-col mb-10">
              <div className="col-span-2 col-row-1 block">
                <label
                  className="block uppercase text-gray-700 text-xs font-bold pt-5 mb-2"
                  htmlFor="grid-state"
                >
                  Parking
                </label>
                <div className="formButtons">
                  <button
                    className={parking ? "formButtonActive" : "formButton"}
                    type="button"
                    id="parking"
                    value={true}
                    onClick={onMutate}
                    min="1"
                    max="10"
                  >
                    Yes
                  </button>
                  <button
                    className={
                      !parking && parking !== null
                        ? "formButtonActive"
                        : "formButton"
                    }
                    type="button"
                    id="parking"
                    value={false}
                    onClick={onMutate}
                  >
                    No
                  </button>
                </div>
              </div>
              <div className="col-span-2 col-row-1 block">
                <label className="block uppercase text-gray-700 text-xs font-bold pt-5 mb-2">
                  Furnished
                </label>
                <div className="formButtons">
                  <button
                    className={furnished ? "formButtonActive" : "formButton"}
                    type="button"
                    id="furnished"
                    value={false}
                    onClick={onMutate}
                  >
                    Yes
                  </button>
                  <button
                    className={
                      !furnished && furnished !== null
                        ? "formButtonActive"
                        : "formButton"
                    }
                    type="button"
                    id="furnished"
                    value={true}
                    onClick={onMutate}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="col-span-2 col-row-1 block ">
                <label
                  className="block uppercase text-gray-700 text-xs font-bold pt-5 mb-2"
                  htmlFor="grid-state"
                >
                  Deal
                </label>
                <div className="formButtons">
                  <button
                    className={offer ? "formButtonActive" : "formButton"}
                    type="button"
                    id="offer"
                    value={true}
                    onClick={onMutate}
                  >
                    Yes
                  </button>
                  <button
                    className={
                      !offer && offer !== null
                        ? "formButtonActive"
                        : "formButton"
                    }
                    type="button"
                    id="offer"
                    value={false}
                    onClick={onMutate}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 col-row-2 w-1/3  gap-y-4 grid-flow-col static mb-10">
              <div className="col-span-2">
                <label className="block uppercase text-gray-700 text-xs font-bold mb-2 static">
                  Regular Price
                </label>
                <input
                  className="bg-white text-primary border-red-500 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-primary focus:text-white"
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required
                />
                {type === "sale" ? (
                  false
                ) : (
                  <p className="badge badge-outline static my-auto p-3">
                    ${regularPrice}/ Month
                  </p>
                )}
              </div>

              {offer && (
                <div className="col-span-2">
                  <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                    Discounted Price
                  </label>
                  <input
                    className="appearance-none block
                 bg-secondary text-white border border-red-500 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-secondary focus:text-bolder"
                    type="number"
                    id="discountedPrice"
                    value={discountedPrice}
                    onChange={onMutate}
                    min="50"
                    max="750000000"
                    required={offer}
                  />
                  {type === "sale" ? (
                    <p className="badge badge-warning mb-3 p-3">
                      {" "}
                      <FcRating />
                      SAVINGS: $
                      {(regularPrice - discountedPrice)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                  ) : (
                    <span className="col-span-1 col-row-1 my-auto block">
                      <p className="badge badge-outline mb-3 p-3">
                        $
                        {discountedPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        / Month
                      </p>
                      <p className="badge badge-success p-3">
                        <FcRating />
                        SAVINGS: $
                        {(discountedPrice - regularPrice)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="col-span-1 col-row-3 w-full py-20 mb-6 md:mb-10 relative">
              <label className="row-span-1 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Images
              </label>
              <input
                className="file-input file-input-bordered col-span-1 row-span-2 bg-white file-input-primary w-1/2"
                type="file"
                id="images"
                onChange={onMutate}
                max="6"
                accept=".jpg,.png,.jpeg"
                multiple
                required
              />
              <p className="text-red-500 text-xs italic py-4">
                The first image will be the cover (max 6).
              </p>
              <div className="p-20">
                <h1 className="text-center text-8xl"> </h1>
              </div>
              <button type="submit" className="btn btn-primary text-2xl">
                <span className="text-4xl">
                  <FcPlus />
                </span>
                Create Listing
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default CreateListing;
