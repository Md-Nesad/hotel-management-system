import { Trash2, X } from "lucide-react";
import { FcApprove } from "react-icons/fc";
import { FaHandPaper } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewTable() {
  const [reviews, setReviews] = useState<any>([]);
  const [loading, letLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      letLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.bahamaslrb.com/api/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        letLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id: any) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://backend.bahamaslrb.com/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(reviews.filter((review: any) => review.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 min-w-full border border-gray-200">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Guest Name
              </th>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Rating
              </th>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Review
              </th>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Date
              </th>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Room Type
              </th>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Status
              </th>
              <th className="px-6 py-3 font-bold border border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review: any, index: number) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 relative"
                  >
                    <td className="px-6 py-4 font-medium border-r border-gray-200 text-gray-600">
                      {review.guestName || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200 text-gray-600">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-orange-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200 text-gray-600">
                      {review.review || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200 text-gray-600">
                      {review.date || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200 text-gray-600">
                      {review.roomType || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200 text-gray-600">
                      <span className="px-2 py-1 text-xs font-medium rounded-full">
                        {review.status || "N/A"}
                      </span>
                    </td>

                    {/* action */}
                    <td className="border border-gray-300 px-2 py-1 w-[120px]">
                      <div className="flex items-center ml-2 space-x-2">
                        <button
                          title="Approve"
                          className=" bg-[#00d78129] text-green-400 p-1 rounded-xs"
                        >
                          <FcApprove size={18} />
                        </button>
                        <button
                          title="Decline"
                          className=" text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>

                        <button
                          title="On Hold"
                          className=" text-gray-600 bg-gray-300 p-1 rounded-xs"
                        >
                          <FaHandPaper size={18} strokeWidth={3} />
                        </button>

                        <button
                          onClick={() => handleDelete(review?._id)}
                          title="Delete"
                          className=" text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
