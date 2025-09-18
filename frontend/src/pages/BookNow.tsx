import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";

import {
  Wifi,
  Car,
  UtensilsCrossed,
  Ban,
  Users,
  ShowerHead,
  Tv,
  ConciergeBell,
  Droplet,
  Snowflake,
  Building2,
  Laptop,
  Fan,
  ShowerHeadIcon,
  Bed,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MdOutlineIron } from "react-icons/md";
import { BiSolidBowlHot } from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import Footer from "../components/common/footer";

const RoomImageCarousel = lazy(() => import("../components/RoomImageCarousel"));

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export interface ApiRoom {
  _id: string;
  name: string;
  price: number;
  status: "Available" | "Unavailable" | string;
  images: string[];
  beds: string;
  baths: string;
  bed_size: string;
  description: string;
  amenities: string[];
}

const BASE_URL = "https://backend.bahamaslrb.com/";
//icon for amenities
const amenityIconMap: { [key: string]: React.ElementType } = {
  "Free Wifi": Wifi,
  "Free Parking": Car,
  TV: Tv,
  "Food Available": UtensilsCrossed,
  Kettle: BiSolidBowlHot,
  Iron: MdOutlineIron,
  "1 queen bed": Bed,
  "Separate room": Users,
  Towel: ConciergeBell,
  "Private bathroom": ShowerHead,
  "No smoking allow": Ban,
  AC: Snowflake,
  "Water Heater": Droplet,
  "Private Balcony": Building2,
  Desk: Laptop,
  Fan: Fan,
  "Shared Bathroom": ShowerHeadIcon,
};

const RoomSelection = () => {
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.bahamaslrb.com/api/rooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data);
      } catch (err) {
        setError("Failed to fetch rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <section className="bg-white">
          <div className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-nunito font-extrabold text-gray-900 tracking-wide skeleton h-10 w-1/2 mx-auto"></h2>
                <p className="mt-2 sm:mt-4 text-gray-600 font-inter text-base sm:text-lg skeleton h-6 w-1/3 mx-auto"></p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                {Array(9)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 text-center skeleton h-40"
                    ></div>
                  ))}
              </div>
            </div>
          </div>
          <div className="py-12 sm:py-16 bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-nunito font-extrabold text-white skeleton h-10 w-1/2 mx-auto"></h2>
                <p className="mt-2 text-gray-400 font-inter text-sm sm:text-base skeleton h-6 w-1/3 mx-auto"></p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="w-full max-w-sm mx-auto bg-gray-800 rounded-xl border border-gray-700 skeleton h-72"
                    >
                      <></>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) return <p className="text-center text-red-600 py-20">{error}</p>;

  return (
    <>
      <style>{styles}</style>
      <section className="bg-white">
        {/* Room Booking Section */}
        <div className="py-12 sm:py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-10 fade-in">
              <h2 className="text-2xl mt-20 sm:text-3xl font-nunito font-extrabold text-white tracking-wide">
                Stay With Us by Booking Today
              </h2>
              <p className="mt-2 text-[#FFFFFF] font-inter text-sm sm:text-base">
                Find the idea room tailored to your comfort
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-5 max-w-[1050px] mx-auto">
              {rooms.map((room, index) => (
                <Card
                  key={index}
                  className="w-full max-w-6xl mx-auto bg-[#000000] rounded border border-gray-600 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 fade-in"
                >
                  <div className="relative">
                    <div className=" inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 rounded-t-xl"></div>
                    {/* image */}
                    <Suspense fallback="Loading...">
                      <RoomImageCarousel
                        images={room.images.map((img) =>
                          img.startsWith("/") ? img.slice(1) : img
                        )}
                        baseUrl={BASE_URL}
                      />
                    </Suspense>
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20">
                      <Badge className="bg-gradient-to-r bg-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-md shadow-md">
                        {room?.price?.toLocaleString()}
                        Fr
                      </Badge>
                    </div>

                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
                      <Badge
                        className={`${
                          room.status === "Available"
                            ? "bg-[#00FF11]"
                            : room.status === "Unavailable"
                            ? "bg-[#FF8888]"
                            : "bg-[#0033FF]"
                        } text-[#FFFFFF] text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-md shadow-md `}
                      >
                        {room.status}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CardTitle className="text-base sm:text-lg font-nunito font-bold text-white">
                        {room?.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-400 font-inter text-xs sm:text-sm">
                      {room.beds && room.baths
                        ? `${room?.beds} BEDs & ${room?.baths}BATHs`
                        : room?.bed_size
                        ? `${room?.bed_size}`
                        : ""}{" "}
                      <br />
                      <span
                        title={
                          room.description.length > 52 ? room.description : ""
                        }
                        className="text-[12px] mt-1"
                      >
                        {room.description.slice(0, 52) || "N/A"}
                        {room.description.length > 52 ? "..." : ""}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-3 sm:px-4 pt-1 pb-3 sm:pb-4 h-36 flex flex-col justify-between">
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 overflow-auto">
                      <div className="grid grid-cols-2 gap-y-3 gap-x-5 ml-5">
                        {room?.amenities?.slice(0, 4).map((amenity, index) => {
                          const Icon = amenityIconMap[amenity];
                          return (
                            <div
                              key={index}
                              className="flex items-center text-xs text-gray-300 gap-3"
                            >
                              {Icon && (
                                <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                                  <Icon className="w-3.5 h-3.5 text-white" />
                                </div>
                              )}
                              {amenity}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {room.status === "Unavailable" ? (
                      <button
                        disabled
                        className="w-full bg-[#939393] text-[#FFFFFF] text-[10px] sm:text-sm font-inter font-medium py-1.5 sm:py-2 rounded-md opacity-60 cursor-not-allowed"
                        style={{ height: "40px" }}
                      >
                        Unavailable
                      </button>
                    ) : (
                      <Link to={`/room-details/${room._id}`}>
                        <button className="w-full bg-gradient-to-r cursor-pointer bg-[#F9862D] text-[#FFFFFF] text-[10px] sm:text-sm font-inter font-medium rounded-md transition duration-200 shadow-md hover:shadow-lg transform hover:scale-105 py-[9px]">
                          View Details
                        </button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default RoomSelection;
