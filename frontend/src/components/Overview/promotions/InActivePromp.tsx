import { Pen, Trash2 } from "lucide-react";
import { FaShareAltSquare } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Promotion {
  _id: string;
  promoTitle: string;
  startDate: string;
  endDate: string;
  promoCode: string;
  discount: number;
  status: string;
}

const InActivePromo = ({
  promotion,
  error,
  onDelete,
}: {
  promotion: Promotion[];
  error: string;
  onDelete: (id: string) => void;
}) => {
  return (
    <div>
      <div className="bg-white rounded-lg">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left bg-white text-gray-700 rounded-lg">
            <thead className=" py-5">
              <tr className="border border-gray-300">
                <th className="px-4 py-3 border border-gray-300">Promo Code</th>
                <th className="px-4 py-3 border border-gray-300">Discount</th>
                <th className="px-4 py-3 border border-gray-300">
                  Active-Expiration
                </th>
                <th className="px-4 py-3 border border-gray-300">Status</th>
                <th className="px-4 py-3 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {promotion.length > 0 ? (
                promotion.map((promo, i) => (
                  <tr key={i} className="border border-gray-300">
                    <td className="px-4 py-3 border border-gray-300">
                      {promo.promoCode}
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      {promo.discount}%
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      {new Date(promo.startDate).getUTCDate()}{" "}
                      {new Date(promo.startDate).toLocaleString("default", {
                        month: "long",
                      })}{" "}
                      - {new Date(promo.endDate).getUTCDate()}{" "}
                      {new Date(promo.endDate).toLocaleString("default", {
                        month: "long",
                      })}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 capitalize">
                      {promo.status}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 w-[120px]">
                      <div className="flex items-center ml-2 space-x-2">
                        <Link
                          title="Edit"
                          to={`/dashboard/edit-promotion/${promo._id}`}
                          className="text-black bg-gray-300 p-1 rounded-xs"
                        >
                          <Pen size={16} />
                        </Link>
                        {/* <button
                          title="archive"
                          className=" bg-gray-300 p-1 rounded-xs"
                        >
                          <FolderX className="text-black" size={16} />
                        </button> */}

                        <button
                          title="share"
                          className=" bg-gray-300 p-1 rounded-xs"
                        >
                          <FaShareAltSquare className="text-black" size={16} />
                        </button>

                        <button
                          title="Delete"
                          onClick={() => onDelete(promo._id)}
                          className=" text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No inactive promo code found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {error && <div className="p-4 text-center text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default InActivePromo;
