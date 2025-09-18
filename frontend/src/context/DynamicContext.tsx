import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [rooms, setRooms] = useState<[]>([]);
  const [booking, setBooking] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [events, setEvents] = useState([]);
  const [promo, setPromo] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const [
        roomRes,
        bookingRes,
        empRes,
        canRes,
        eventRes,
        promoRes,
        reviewRes,
      ] = await Promise.all([
        fetch("https://backend.bahamaslrb.com/api/rooms"),
        fetch("https://backend.bahamaslrb.com/api/bookings/all"),
        fetch("https://backend.bahamaslrb.com/api/concierges/all"),
        fetch("https://backend.bahamaslrb.com/api/bookings/cancelled"),
        fetch("https://backend.bahamaslrb.com/api/event/all"),
        fetch("https://backend.bahamaslrb.com/promotion/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch("https://backend.bahamaslrb.com/api/reviews"),
      ]);

      const [
        roomData,
        bookingData,
        empData,
        canData,
        eventData,
        promoData,
        reviewData,
      ] = await Promise.all([
        roomRes.json(),
        bookingRes.json(),
        empRes.json(),
        canRes.json(),
        eventRes.json(),
        promoRes.json(),
        reviewRes.json(),
      ]);

      setRooms(roomData);
      setBooking(bookingData);
      setEmployee(empData?.data || []);
      setCancelled(canData?.bookings || []);
      setEvents(eventData);
      setPromo(promoData);
      setReviews(reviewData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <DataContext.Provider
      value={{
        rooms,
        booking,
        employee,
        cancelled,
        events,
        promo,
        reviews,
        loading,
        refresh: fetchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
