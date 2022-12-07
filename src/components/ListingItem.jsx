import { Link } from "react-router-dom";
import { MdOutlineBed } from "react-icons/md";
import { TbBath } from "react-icons/tb";
import { TiDeleteOutline } from "react-icons/ti";
import { FaCarAlt } from "react-icons/fa";
import { BiEdit } from "react-icons/bi"

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <div className="grid-col-3 grid-flow-col-dense p-16 gap-8">
      <li className="col-span-1 row-span-1 static block">
        <div className="flex flex-row-reverse cursor-pointer z-40">
          <span
            className="tooltip tooltip-right tooltip-error"
            data-tip="delete"
          >
            {onDelete && (
              <TiDeleteOutline
                className="card-title inline-block items-left h-6 w-6 text-lg text-error tooltip tooltip-center m-auto"
                data-tip="Delete listing"
                onClick={() => onDelete(listing.id, listing.name)}
              />
            )}
          </span>
          <span className="tooltip tooltip-left tooltip-error" data-tip="edit">
            {onEdit && (
              <BiEdit
                className="card-title inline-block items-right h-6 w-6 text-lg text-error tooltip tooltip-center m-auto"
                data-tip="Edit listing"
                onClick={() => onEdit(id)}
              />
            )}
          </span>
        </div>
        {listing.offer === false ? null : (
          <div className="indicator">
            <span className="indicator-item indicator-top indicator-right badge badge-warning p-5">
              <p className="text-center">
                SAVINGS:{" "}
                <b>
                  $
                  {(listing.regularPrice - listing.discountedPrice)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </b>{" "}
              </p>
            </span>
          </div>
        )}
        <div className="card w-96 bg-base-100 shadow-xl rounded-8xl">
          <Link
            to={`/category/${listing.type}/${id}`}
            className="categoryListingLink"
          >
            <img
              src={listing.imgUrls[0]}
              className="rounded-t-box h-80"
              alt={listing.name}
            />

            <div className="card-body text-base-300 h-96 bg-white p-5 rounded-b-box">
              <p className="card-desc stat text-sm mx-auto p-0">
                {listing.location}
              </p>
              <p className="card-title text-lg text-white-focus text-bold italic">
                "{listing.name}"
              </p>

              <div>
                <p className="stat-value pb-5">
                  $
                  {listing.offer
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {listing.type === "rent" || listing.type === "bnb" ? (
                    <div className="stat-desc uppercase text-base-300">
                      {" "}
                      / month
                    </div>
                  ) : null}
                </p>

                <div className="stats shadow stats-vertical bg-white text-base-300">
                  <div className="stat flex justify-end">
                    <div className="stat-figure text-primary text-xl">
                      <MdOutlineBed />
                    </div>
                    <p className="stat-desc text-lg">
                      {listing.bedrooms > 1
                        ? `${listing.bedrooms} Bedrooms`
                        : "1 Bedroom"}
                    </p>
                  </div>
                  <div className="stat flex justify-end">
                    <div className="stat-figure text-primary text-xl">
                      <TbBath />
                    </div>
                    <p className="stat-desc text-lg">
                      {listing.bathrooms > 1
                        ? `${listing.bathrooms} Bathrooms`
                        : "1 Bathroom"}
                    </p>
                  </div>
                  <div className="stat flex justify-end">
                    <div className="stat-figure text-primary text-xl">
                      <FaCarAlt />
                    </div>
                    <p className="stat-desc text-lg">
                      {listing.parking === true ? "1 Slot" : "None"}
                    </p>
                  </div>
                </div>

                <span className="btn btn-disabled bg-success stats absolute justify-end text-base-300 shadow text-lg hover:bg-white font-bold uppercase">
                  <span className="flex text-4xl z-10"></span>
                  {listing.type}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </li>
    </div>
  );
}

export default ListingItem;
