import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  NotepadText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import InlineReadMore from "./InlineReadMore";
import { usePageData } from "../../context/PageDataContext";
// import { format } from "date-fns";

interface Event {
  button: string;
  description: string;
  location: string;
  dateTime: string;
  status: "upcoming" | "ongoing" | "completed";
  title: string;
  image: string;
}

const BASE_URL = "https://backend.bahamaslrb.com/uploads/";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { pageData } = usePageData();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Event[]>(
          "https://backend.bahamaslrb.com/api/event/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  const eventsPerPage = 3;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * eventsPerPage;
  const selectedEvents = events.slice(startIndex, startIndex + eventsPerPage);

  return (
    <section className="w-full h-auto bg-black text-white py-16 font-inter">
      <div className="max-w-[1082px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            {pageData?.eventTitle || "Upcoming Events and News"}
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming events found.</p>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={prevPage}
              className="absolute left-[-80px] top-1/2 transform -translate-y-1/2  border-2 border-gray-400 shadow-md w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500 max-sm:hidden"
            >
              <ArrowLeft strokeWidth={3} className="text-gray-400" />
            </button>

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedEvents.map((event, index) => (
                <Card
                  key={index}
                  className="bg-white border border-gray-200 overflow-hidden rounded-2xl shadow-md group flex flex-col justify-between min-h-[400px]"
                >
                  <div className="relative h-60 w-full">
                    <img
                      src={
                        event?.image?.startsWith("http")
                          ? event?.image
                          : `${BASE_URL}${event?.image}`
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <CardHeader className="p-6 bg-white flex flex-col gap-4 flex-1">
                    <CardTitle className="text-2xl text-center font-bold text-black mb-2 ">
                      {event?.title}
                    </CardTitle>

                    <div className="space-y-4 text-black text-sm font-medium">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-[1px]" />
                        <span>{event?.dateTime}</span>
                      </div>
                      <div className="flex items-start gap-2 min-h-[14px]">
                        <MapPin className="w-4 h-4 mt-[1px]" />
                        <span>{event?.location}</span>
                      </div>
                      <div className="flex items-start gap-2 min-h-[14px]">
                        <span>
                          <NotepadText className="w-4 h-4 mt-[2px]" />
                        </span>
                        <InlineReadMore text={event?.description} />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 pt-0 bg-white">
                    <button
                      onClick={() =>
                        setSelectedEvent({
                          ...event,
                          button: "Read More",
                          image: `${BASE_URL}${event?.image}`,
                          status: "upcoming",
                        })
                      }
                      className="w-full bg-[#FAA13E] hover:bg-orange-400 text-white font-semibold px-8 py-3 rounded-md transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                    >
                      Read More
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextPage}
              className="absolute right-[-80px] top-1/2 transform -translate-y-1/2 border-2 border-gray-400 shadow-md w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none max-sm:hidden"
            >
              <ArrowRight strokeWidth={3} className="text-gray-400" />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {!loading && events.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage ? "bg-[#F9862D]" : "bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] p-5 relative flex flex-col">
              {/* Scrollable Content Area */}
              <div className="flex-grow overflow-y-auto">
                {/* Image */}
                <div className="w-full sm:h-60 mb-4 rounded-md overflow-hidden">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedEvent.title}
                </h3>

                {/* Date & Time */}
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{selectedEvent.dateTime}</span>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{selectedEvent.location}</span>
                </div>

                {/* Description */}
                <div className="flex items-start text-gray-700 mb-2">
                  <NotepadText className="w-5 h-5 mt-1 mr-2" />
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 flex justify-center shrink-0">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
