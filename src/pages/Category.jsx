import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //fetch refs
        const listingsRef = collection(db, "listings");

        //create a query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        //execute query
        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, [params.categoryName]);

  return (
    <div className="category">
      <header>
        <p className="hero text-5xl font-light p-20">
          {params.categoryName === "rent"
            ? "Places for rent"
            : params.categoryName === "sale"
            ? "Place for Sale"
            : "Perfect spots to have your next Bed and Breakfast"}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <div className="min-h-screen flex items-center">
              <div className="flex-1 max w 4x1 mx-auto p-10">
                <ul className="grid lg:grid-cols-4 md:grid-cols-2 grid-rows-3 md:grid-rows-5 gap-4 gap-y-20 grid-flow-row block">
                  {listings.map((listing) => (
                    <ListingItem
                      listing={listing.data}
                      id={listing.id}
                      key={listing.id}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </>
      ) : (
        <p className="hero text-xl italic font-light">
          No listings for {params.categoryName}, ATM
        </p>
      )}
    </div>
  );
}

export default Category;
