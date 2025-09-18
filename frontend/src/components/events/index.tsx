import * as Tabs from "@radix-ui/react-tabs";
import { Box } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import AllEvents from "./AllEvents";
import Events from "./Events";
import News from "./News";
import { useNavigate } from "react-router-dom";

interface Event {
  _id: string;
  button: string;
  description: string;
  location: string;
  content: string;
  dateTime: string;
  status: "upcoming" | "ongoing" | "completed";
  title: string;
  image: string;
}

export default function ReservationTabs() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Your session has expired. Please log in again.");
          return;
        }

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
        setError("Failed to load events. please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  //handl delete
  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return; // User canceled
    try {
      await axios.delete(
        `https://backend.bahamaslrb.com/api/event/delete/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Event deleted successfully!");
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center ">Loading...</div>;
  return (
    <div>
      {/* Tabs */}
      <Tabs.Root defaultValue="allEvents">
        <Tabs.List className="text-[16px] font-bold flex gap-x-4 items-center border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)] mb-4">
          <Tabs.Trigger
            value="allEvents"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            ALL EVENTS & NEWS
          </Tabs.Trigger>
          <Tabs.Trigger
            value="events"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            EVENTS
          </Tabs.Trigger>
          <Tabs.Trigger
            value="news"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            NEWS
          </Tabs.Trigger>

          <div className="sm:ml-auto sm:mr-10">
            <button
              onClick={() => navigate("add_event")}
              className="border bg-gray-400 py-2 px-3 rounded-md cursor-pointer hover:bg-orange-400 text-white hover:border-orange-400 transition-colors duration-300"
            >
              + Add Events & News
            </button>
          </div>
        </Tabs.List>

        <Box pt="2">
          <Tabs.Content value="allEvents">
            <AllEvents events={events} error={error} onDelete={handleDelete} />
          </Tabs.Content>
          <Tabs.Content value="events">
            <Events
              events={events.filter((event) => event.content === "event")}
              error={error}
              onDelete={handleDelete}
            />
          </Tabs.Content>
          <Tabs.Content value="news">
            <News
              events={events.filter((event) => event.content === "news")}
              error={error}
              onDelete={handleDelete}
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}
