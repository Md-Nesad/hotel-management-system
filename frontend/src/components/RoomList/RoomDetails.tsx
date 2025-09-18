import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomImageCarousel from "../RoomImageCarousel";
import Footer from "../common/footer";

interface Room {
  _id: string;
  name: string;
  beds: string;
  baths: string;
  amenities: string[];
  images: string[];
  price: number;
  description: string;
  bed_size: string;
  status: string;
}
const BASE_URL = "https://backend.bahamaslrb.com/";

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://backend.bahamaslrb.com/api/rooms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch rooms");
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const singleRoom = rooms.find((room) => room._id === id);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center my-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--color-orange)] mb-4"></div>
        <p className="text-gray-600 text-lg">Loading details...</p>
      </div>
    );

  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  if (!singleRoom) {
    return <div className="text-center py-8">Room not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="max-w-[1085px] mx-auto px-4 mt-44 mb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Image Section */}
            <div className="w-full max-w-md mx-auto">
              <RoomImageCarousel
                images={singleRoom?.images.map((img) =>
                  img.startsWith("/") ? img.slice(1) : img
                )}
                baseUrl={BASE_URL}
              />
            </div>

            {/* Room Info */}
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                {singleRoom?.name}
              </h2>
              <div className="space-y-1 font-semibold">
                <p className="text-gray-700">
                  <strong>Beds:</strong>{" "}
                  {singleRoom?.beds && singleRoom?.baths
                    ? `${singleRoom?.beds} BEDs`
                    : singleRoom?.bed_size
                    ? `${singleRoom?.bed_size}`
                    : ""}
                </p>
                <p className="text-gray-700">
                  <strong>Baths:</strong>{" "}
                  {singleRoom?.baths === null
                    ? "N/A"
                    : singleRoom?.baths + "BATHs"}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {singleRoom?.status}
                </p>

                <p className="text-gray-700">
                  <strong>Description:</strong>{" "}
                  {singleRoom?.description || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Amenities:</strong>{" "}
                  {singleRoom?.amenities?.length > 0
                    ? singleRoom?.amenities?.join(", ")
                    : "No amenities listed"}
                </p>
              </div>
              {userRole === "admin" && (
                <p className="text-gray-700 mt-4">
                  <strong>Note:</strong> Need a quiet room near the elevator.
                </p>
              )}
            </div>

            {/* Pricing & Booking */}
            <div className="w-full max-w-md mx-auto">
              <div className="border rounded-lg p-4 shadow-md">
                <div className="mb-2">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    LOWEST PRICE
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Member Rate:</span>{" "}
                    <span>Pay Now and Save</span>
                  </p>
                </div>
                <div className="mb-2">
                  <span className="line-through text-sm mr-2">
                    FRW{" "}
                    {Math.ceil(
                      singleRoom?.price * 1.333333333
                    )?.toLocaleString()}
                  </span>
                  <span className="text-[17px] font-bold text-black">
                    FRW {singleRoom?.price?.toLocaleString()} per night
                  </span>
                </div>
                <div className="border-t my-2"></div>
                <div className="mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Non-Refundable
                  </p>
                  <p className="text-sm text-gray-600">
                    Total incl. taxes & fees:{" "}
                    <span className="font-semibold">
                      FRW{" "}
                      {Math.ceil(
                        singleRoom?.price * 1.0433333333
                      )?.toLocaleString()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/booking?roomId=${singleRoom._id}`)}
                  className="w-full bg-[#F9862D] hover:bg-orange-500 cursor-pointer text-white py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Book Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Always Stays at Bottom */}

      <Footer />
    </div>
  );
};

export default RoomDetails;
