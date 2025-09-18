import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Input from "../ui/Input";
import Label from "../ui/Label";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import BedInputDropdown from "../ui/DropDown";
import ResturentTopBar from "../restaurant-bar/ResturentTopBar";
import RoomImageCarousel from "../RoomImageCarousel";
import Footer from "../common/footer";

// Define Room interface
interface Room {
  _id: string;
  id: string | number;
  name: string;
  beds: number;
  baths: number;
  description: string;
  amenities: string[];
  price: string;
  images: string[];
  features: string[];
  status?: string;
}

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("roomId");
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  // const [beds, setBeds] = useState(1);
  const [guests, setGuests] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  //payment state
  const [cardType, setCardType] = useState("credit");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiration, setExpiration] = useState("");
  const [number, setNumber] = useState("");
  const [calendarVisibleCheckIn, setCalendarVisibleCheckIn] = useState(false);
  const [calendarVisibleCheckOut, setCalendarVisibleCheckOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = "https://backend.bahamaslrb.com";
  const BASE_URL = "https://backend.bahamaslrb.com/";

  // Fetch room details based on roomId from URL
  useEffect(() => {
    const fetchRoom = async () => {
      setLoadingRoom(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/rooms`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const foundRoom = response.data.find(
          (r: Room) => r.id === roomId || r._id === roomId
        );
        setRoom(
          foundRoom || {
            id: 1,
            name: "Comfort",
            description: "Basic accommodation with all essentials",
            price: "$149",
            image:
              "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
            features: [
              "Single/Twin Bed",
              "Shared Bathroom",
              "Courtyard View",
              "Essential Amenities",
            ],
          }
        );
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Something is wrong. Please try again later.");
      } finally {
        setLoadingRoom(false);
      }
    };
    if (roomId) fetchRoom();
  }, [roomId]);

  // Timer for holding the reservation
  const [holdTime, setHoldTime] = useState(870);
  useEffect(() => {
    const timer = setInterval(() => {
      setHoldTime((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // Format time in MM:SS
  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${min}:${remSec < 10 ? "0" : ""}${remSec}`;
  };

  //if user clicks outside the date picker, close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        checkInRef.current &&
        !checkInRef.current.contains(event.target as Node)
      ) {
        setCalendarVisibleCheckIn(false);
      }
      if (
        checkOutRef.current &&
        !checkOutRef.current.contains(event.target as Node)
      ) {
        setCalendarVisibleCheckOut(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sign-in
  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        username: email,
        password: password,
      });
      const { token } = response.data; // Adjust based on API response
      localStorage.setItem("token", token);
      localStorage.setItem(
        "userId",
        response.data.userId || "68594e5ecdd7e9ffec55bf5d"
      );
      console.log("Logged in successfully");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates.");
      alert("Please select both check-in and check-out dates.");
      return;
    }

    // Prepare list of required fields with user-friendly names
    const requiredFields = [
      { key: "firstName", label: "First Name", value: firstName },
      { key: "lastName", label: "Last Name", value: lastName },
      { key: "email", label: "Email", value: email },
      { key: "phone", label: "Phone", value: phone },
      { key: "country", label: "Country", value: country },
      { key: "cardType", label: "Payment Method", value: cardType },
      { key: "card.number", label: "Card Number", value: number },
      {
        key: "card.cardHolderName",
        label: "Card Holder Name",
        value: cardHolderName,
      },
      { key: "card.expiration", label: "Card Expiration", value: expiration },
    ];

    // Validate required fields
    for (const field of requiredFields) {
      if (!field.value || field.value.trim() === "") {
        alert(`❌ ${field.label} is required.`);
        return;
      }
    }

    const bookingData = {
      room: roomId || "1",
      checkIn: format(checkInDate, "yyyy-MM-dd"),
      checkOut: format(checkOutDate, "yyyy-MM-dd"),
      guestAccess: "Full access",
      firstName,
      lastName,
      email,
      phone,
      country,
      paymentMethod: cardType,
      card: {
        number,
        cardType,
        cardHolderName,
        expiration,
      },
    };
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(bookingData);
      const response = await axios.post(
        `${API_BASE_URL}/api/book`,
        bookingData,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response.data;
      console.log(result);
      alert(
        `✅ ${result.message}\n\n📄 Booking ID: ${result.bookingId}\n\n🔖 Confirmation Number: ${result.confirmationNumber}`
      );
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setError("Session expired. Please sign in again.");
      } else {
        setError("Booking failed. Please try again later.");
      }
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingRoom)
    return (
      <div className="flex flex-col items-center justify-center my-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--color-orange)] mb-4"></div>
        <p className="text-gray-600 text-lg">Loading reservation...</p>
      </div>
    );

  return (
    <>
      <ResturentTopBar />
      <div className="min-h-screen bg-white text-gray-800 mt-15">
        <div className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="mb-6">
              <button
                onClick={() => navigate("/")}
                className="mb-4 text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-[#F9862D] p-3 rounded-sm transition duration-300 ease-in-out hover:text-white font-bold "
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Rooms
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Complete Your Reservation
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
              {/* Booking Form (LEFT) */}
              <div className="space-y-6 order-2 lg:order-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Guest Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Sign In Form */}
                    <form className="space-y-4 mb-6">
                      <div className="flex gap-x-4">
                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="email" className="text-gray-600">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="password" className="text-gray-600">
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input type="checkbox" />
                        <span className="text-gray-600 text-[10px] ml-2 font-semibold">
                          If you would like promo code or our newsletter, check
                          the box to be emailed for updates
                        </span>
                      </div>
                      <button
                        type="button"
                        className="w-full bg-gradient-to-r bg-[#C5C5C5] text-[#000000] py-2 rounded-md shadow-md hover:bg-[#F9862D] hover:text-white transition-colors font-bold cursor-pointer "
                        onClick={handleSignIn}
                      >
                        Sign Up
                      </button>
                    </form>

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <p className="text-red-600 text-center">{error}</p>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="firstName"
                            className="text-gray-600 mb-1 ml-1"
                          >
                            First Name
                          </Label>
                          <Input
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="lastName"
                            className="text-gray-600 mb-1 ml-1"
                          >
                            Last Name
                          </Label>
                          <Input
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      {/* email */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-gray-600 mb-1 ml-1"
                        >
                          Email
                        </Label>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <small className="text-[11px] text-gray-600 font-semibold">
                          We need your email to send you a confirmation number
                          if you booked online
                        </small>
                      </div>
                      {/* phone */}
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-gray-600 mb-1 ml-1"
                        >
                          Phone
                        </Label>
                        <Input
                          type="tel"
                          placeholder="Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      {/* beds and guests */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="beds" className="text-gray-600">
                            Number of beds
                          </Label>

                          <BedInputDropdown />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guests" className="text-gray-600">
                            Guests
                          </Label>
                          <Input
                            type="number"
                            value={guests.toString()}
                            onChange={(e) =>
                              setGuests(parseInt(e.target.value))
                            }
                            min={1}
                            max={5}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1">
                        <Label
                          htmlFor="country"
                          className="text-gray-600 mb-1 ml-1"
                        >
                          Country
                        </Label>
                        <Input
                          placeholder="Country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <small>
                          <strong>Check in/out Policies:</strong> You can check
                          in anytime you want but check out is before noon. We
                          also have hourly base price for more information ask
                          our manager.
                        </small>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Room Info (RIGHT) */}
              <div className="space-y-6 order-1 lg:order-2 relative">
                <Card>
                  {room ? (
                    <>
                      <RoomImageCarousel
                        images={room.images.map((img) =>
                          img.startsWith("/") ? img.slice(1) : img
                        )}
                        baseUrl={BASE_URL}
                      />
                      <p className="text-sm absolute top-3 left-3 bg-[#ffffffaa] text-[#343434] font-bold py-1 px-2 rounded-md">
                        Reservation held for:{" "}
                        <span className="text-[#343434] font-bold ">
                          {formatTime(holdTime)}
                        </span>
                      </p>
                      {/* <CardHeader> */}
                      {/* <CardContent>
                          <div></div>
                        </CardContent> */}
                      {/* </CardHeader> */}
                      <CardContent>
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold">{room.name}</h2>

                          <p className="text-sm text-gray-600">
                            <strong>Beds:</strong>{" "}
                            {room.beds === null
                              ? "1 king Bed"
                              : room.beds + " Beds"}
                          </p>

                          <p className="text-sm text-gray-600">
                            <strong>Baths:</strong>{" "}
                            {room.baths === null
                              ? "1 Bath"
                              : room.baths + " Baths"}
                          </p>

                          <p className="text-sm text-gray-600">
                            <strong>Status:</strong> {room.status}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Description:</strong>{" "}
                            {room.description || "N/A"}
                          </p>

                          <p className="text-sm text-gray-600">
                            <strong>Amenities:</strong>{" "}
                            {room?.amenities && room.amenities.length > 0
                              ? room.amenities.join(", ")
                              : "No amenities listed"}
                          </p>

                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> Nyamirambo near green
                            corn at kn 192 st, house #3
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Phone:</strong> +250 788 948 148
                          </p>

                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(room.features || []).map((f, i) => (
                              <li
                                key={i}
                                className="flex items-center bg-gray-100 px-3 py-2 rounded-md shadow-sm"
                              >
                                <span className="w-2 h-2 rounded-full bg-orange-500 mr-3"></span>
                                <span className="text-sm text-gray-700">
                                  {f}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="text-center py-4">
                      Room data not available
                    </CardContent>
                  )}
                </Card>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2" ref={checkInRef}>
                    <Label
                      htmlFor="checkin"
                      className="font-semibold text-gray-700"
                    >
                      Check-in
                    </Label>
                    <div className="relative">
                      <input
                        id="checkin"
                        type="text"
                        readOnly
                        value={
                          checkInDate ? format(checkInDate, "yyyy-MM-dd") : ""
                        }
                        placeholder="Select"
                        onFocus={() => setCalendarVisibleCheckIn(true)}
                        className="w-full border border-gray-300 h-12 px-3 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm transition duration-200"
                      />
                      <CalendarIcon
                        className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer transition-colors duration-200 ${
                          calendarVisibleCheckIn
                            ? "text-[var(--color-orange)]"
                            : "text-gray-400"
                        }`}
                        onClick={() =>
                          setCalendarVisibleCheckIn(!calendarVisibleCheckIn)
                        }
                      />
                      {calendarVisibleCheckIn && (
                        <div className="absolute top-full left-0 z-[200] mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto">
                          <DatePicker
                            selected={checkInDate}
                            onChange={(date) => {
                              if (date) setCheckInDate(date);
                              setCalendarVisibleCheckIn(false);
                            }}
                            dateFormat="yyyy-MM-dd"
                            inline
                            minDate={new Date()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2" ref={checkOutRef}>
                    <Label
                      htmlFor="checkout"
                      className="font-semibold text-gray-700"
                    >
                      Check-out
                    </Label>
                    <div className="relative">
                      <input
                        id="checkout"
                        type="text"
                        readOnly
                        value={
                          checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : ""
                        }
                        placeholder="Select"
                        onFocus={() => setCalendarVisibleCheckOut(true)}
                        className="w-full border border-gray-300 h-12 px-3 rounded-lg focus:border-gray-300 focus:outline-none  shadow-sm transition duration-200"
                      />
                      <CalendarIcon
                        className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer transition-colors duration-200 ${
                          calendarVisibleCheckOut
                            ? "text-[var(--color-orange)]"
                            : "text-gray-400"
                        }`}
                        onClick={() =>
                          setCalendarVisibleCheckOut(!calendarVisibleCheckOut)
                        }
                      />
                      {calendarVisibleCheckOut && (
                        <div className="absolute top-full left-0 z-[200] mt-2 bg-white rounded-lg shadow-lg border-gray-200 max-h-[300px] overflow-y-auto">
                          <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => {
                              if (date) setCheckOutDate(date);
                              setCalendarVisibleCheckOut(false);
                            }}
                            dateFormat="yyyy-MM-dd"
                            inline
                            minDate={checkInDate || new Date()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-md">{error}</p>}
                {/* payment */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 space-y-4">
                  <h2 className="text-lg font-bold text-gray-800 px-4 pt-2 pb-2 border-b-2 border-gray-300">
                    Payment
                  </h2>{" "}
                  <div className="max-w-xl mx-auto px-4 ">
                    <div className="space-y-1 mb-2">
                      <label className="block text-sm text-gray-800 font-bold">
                        Payment Method
                      </label>
                      <div className="relative w-full">
                        <select
                          value={cardType}
                          onChange={(e) => setCardType(e.target.value)}
                          className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                        >
                          <option value="">Select a Payment Method</option>
                          <option value="momo">Momo</option>
                          <option value="cash">Cash</option>
                          <option value="credit card">Credit Card</option>
                          <option value="debit">Debit</option>
                          <option value="visa">Visa</option>
                          <option value="cashier check boridelo ya bank">
                            Cashier Check"Boridelo ya bank"
                          </option>
                          <option disabled value="paypal">
                            Paypal (Up coming)
                          </option>
                        </select>

                        {/* Custom dropdown icon */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-800 mt-3 font-bold">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter holder name"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />
                    </div>
                    <div className="flex gap-4 mt-3">
                      <div className="flex-1 space-y-1">
                        <label className="block text-sm text-gray-800 font-bold">
                          Expiry date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiration}
                          onChange={(e) => setExpiration(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="block text-sm text-gray-800 font-bold">
                          Security Code
                        </label>
                        <input
                          type="text"
                          placeholder="000"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#F9862D] hover:bg-orange-500 mt-8 mb-5 text-white py-3 rounded-md font-medium transition cursor-pointer"
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;
