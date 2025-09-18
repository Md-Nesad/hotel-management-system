import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { format } from "date-fns";
import { useState, Fragment, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const amenitiesOptions = [
  "AC",
  "TV",
  "Balcony",
  "Water Heater",
  "Mini Fridge",
  "1 king bed",
  "1 queen bed",
  "Separate room",
  "Towel",
  "Private bathroom",
  "Free WiFi",
  "Free parking",
  "No smoking allow",
];

interface Room {
  _id: string;
  id: number;
  name: string;
  beds: string;
  baths: string;
  bed_size: string;
  housekeepingStatus: string;
  description: string;
  roomType: string;
  price: number;
  amenities: string[];
  status: "Available" | "Booked";
  checkIn: string;
  checkOut: string;
}
const AddBookingForm = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [errors] = useState<{ [key: string]: string }>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [concierages, setConcierages] = useState<any[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guest, setGuest] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomId, setRoomId] = useState("");
  const [country, setCountry] = useState("");
  const [cardType, setCardType] = useState("credit");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiration, setExpiration] = useState("");
  const [number, setNumber] = useState("");
  const [promo, setPromo] = useState("");
  const [submiting, setSubmitting] = useState(false);
  const [roomAlerted, setRoomAlerted] = useState(false);

  const toggleSelect = (value: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((v) => v !== value)
        : [...prevSelected, value]
    );
  };
  const removeSelected = (value: string) => {
    setSelected((prevSelected) => prevSelected.filter((v) => v !== value));
  };

  useEffect(() => {
    const fetchRooms = async () => {
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
        console.log(
          "Failed to fetch rooms. Please try again later please. " + err
        );
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (roomId && !roomAlerted) {
      alert(
        "You don't need to type others datas, just select room name. \n\n" +
          "The system will automatically send the room number, suite type, suite number, bed size, beds, baths, price, currency and status."
      );
      setRoomAlerted(true);
    }
  }, [roomId, roomAlerted]);

  //employee data
  useEffect(() => {
    const fetchConcierges = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch(
          "https://backend.bahamaslrb.com/api/concierges/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch concierges: ${response.status}`);
        }

        const data = await response.json();
        setConcierages(data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConcierges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameParts = guest.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    // Prepare list of required fields with user-friendly names
    const requiredFields = [
      { key: "firstName", label: "Name", value: firstName },
      { key: "lastName", label: "Name", value: lastName },
      { key: "email", label: "Email", value: email },
      { key: "phone", label: "Phone", value: phone },
      { key: "promo", label: "Promo Code", value: promo },
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
        alert(`${field.label} is required.`);
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

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://backend.bahamaslrb.com/api/book`,
        bookingData,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response.data;
      alert(
        `✅ ${result.message}\n\n📄 Booking ID: ${result.bookingId}\n\n🔖 Confirmation Number: ${result.confirmationNumber}`
      );
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      } else {
        console.error("Booking error:", err);
      }
    } finally {
      setSubmitting(false);
      setGuest("");
      setRoomId("1");
      setCheckInDate(null);
      setCheckOutDate(null);
      setEmail("");
      setPhone("");
      setPromo("");
      setCountry("");
      setCardType("");
      setNumber("");
      setCardHolderName("");
      setExpiration("");
    }
  };

  return (
    <>
      <h2 className="text-[17px] text-[#F9862D] font-semibold  border-b py-3 bg-white pl-10 border-gray-300 rounded-t-md shadow-[0_0_3px_rgba(0,0,0,0.25)]">
        ADD NEW BOOKING INFORMATION
      </h2>
      <div className="w-full mx-auto bg-white px-12 py-5 rounded-b-lg shadow">
        {/* Guest Details */}
        <section className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Guest Details
          </h3>
          {/* guest name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="guestName" className="font-bold">
                Guest Name
              </label>
              <input
                type="text"
                placeholder="Guest Name"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
              />
            </div>

            {/* email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="guestEmail" className="font-bold">
                Email
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
              />
            </div>
            {/* phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="guestPhone" className="font-bold">
                Phone
              </label>
              <input
                type="number"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
              />
            </div>
          </div>

          {/* second row */}
          <div className="grid grid-cols-3 gap-4">
            {/* check in time in */}
            <div className="flex flex-row gap-1">
              <div>
                <label htmlFor="checkin" className="font-bold">
                  Check-in
                </label>
                <input
                  type="date"
                  placeholder="Tue 20 July, 2025"
                  value={
                    checkInDate ? checkInDate.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => setCheckInDate(new Date(e.target.value))}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                />
              </div>

              <div>
                <label htmlFor="timein" className="font-bold">
                  Time-in
                </label>
                <input
                  type="time"
                  placeholder="Guest Name"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                />
              </div>
            </div>

            {/* check out time out */}
            <div className="flex flex-row gap-1">
              <div>
                <label htmlFor="checkout" className="font-bold">
                  Check-Out
                </label>
                <input
                  type="date"
                  placeholder="Tue 20 July, 2025"
                  value={
                    checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                />
              </div>

              <div>
                <label htmlFor="timeout" className="font-bold">
                  Time-out
                </label>
                <input
                  type="time"
                  placeholder="Guest Name"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                />
              </div>
            </div>
            {/* duration and geust */}
            <div className="flex flex-row gap-1">
              <div>
                <label htmlFor="duration" className="font-bold">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="2 day(s) / Night(s) : 4.5 hour(s)"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                />
              </div>

              <div className="w-full ml-3">
                <label htmlFor="guest" className="font-bold">
                  Guest
                </label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* third row */}
          <div className="grid grid-cols-3 gap-4">
            {/* source */}
            <div className="flex flex-col gap-1">
              <label htmlFor="source" className="font-bold">
                Source
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  name="source"
                >
                  <option value="website">Website</option>
                  <option value="OnPhone">OnPhone</option>
                  <option value="walk in">walk in</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* booker */}
            <div className="flex flex-col gap-1">
              <label htmlFor="booker" className="font-bold">
                Booker
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  name="source"
                >
                  <option value="">Select Booker</option>
                  {concierages.map((emp) => (
                    <option key={emp._id} value={emp.name}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Room Details */}
        <section className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Room Details
          </h3>
          {/* room name */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label htmlFor="roomName" className="font-semibold">
                Room Name
              </label>
              <div className="relative">
                <select
                  id="roomName"
                  name="roomName"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-[14px] appearance-none bg-gray-200 cursor-pointer"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* room number */}
            <div>
              <label htmlFor="roomNumber" className="font-semibold">
                Room Number
              </label>
              <input
                type="text"
                placeholder="Room Number"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                disabled
              />
            </div>
            {/* suite type */}
            <div className="flex flex-col">
              <label htmlFor="suiteType" className="font-semibold">
                Suite Type
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  disabled
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                >
                  <option value="">Select here</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* suite number */}
            <div className="flex flex-col">
              <label htmlFor="suiteType" className="font-semibold">
                Suite Number
              </label>
              <div className="flex overflow-hidden gap-2">
                {/* Select box wrapper with flex-1 */}
                <div className="relative flex-1">
                  <select
                    name="suiteType"
                    className="w-full min-w-15 border border-gray-300 rounded-md py-2 pl-3 pr-8 appearance-none bg-gray-200"
                    disabled
                  >
                    <option value="A">A</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Input with flex-1 as well */}
                <input
                  type="text"
                  className="flex-1 w-full min-w-36 border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  placeholder="Queen bed"
                  disabled
                />
              </div>
            </div>
          </div>
          {/* second row && bed size */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label htmlFor="bedSize" className="font-semibold">
                Bed Size
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  disabled
                >
                  <option value="">Select here</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* beds */}
            <div className="flex flex-col">
              <label htmlFor="beds" className="font-semibold">
                Beds
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  disabled
                >
                  <option value="">Select here</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* baths */}
            <div className="flex flex-col">
              <label htmlFor="baths" className="font-semibold">
                Baths
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  disabled
                >
                  <option value="">Select here</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* price */}
            <div className="flex flex-col">
              <label htmlFor="price" className="font-semibold">
                Price
              </label>
              <input
                name="price"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                placeholder="Price"
                disabled
              ></input>
            </div>
            {/* currency */}
            <div className="flex flex-col">
              <label htmlFor="currency" className="font-semibold">
                Currency
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  disabled
                >
                  <option value="FRW">FRW</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="prpmocode" className="font-semibold">
                Promo Code
              </label>
              <input
                name="promocode"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                placeholder="Promo code"
              ></input>
            </div>
          </div>

          {/* animities row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm mb-1 font-bold">Amenities</label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 min-h-[43px] bg-gray-200">
                  {selected.length > 0 ? (
                    selected.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center bg-gray-200 rounded-full px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {item}
                        <button
                          onClick={() => removeSelected(item)}
                          className="ml-1 text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Select Amenities
                    </span>
                  )}
                </div>
                <Listbox
                  as="div"
                  value={selected}
                  onChange={setSelected}
                  multiple
                >
                  {() => (
                    <>
                      <Listbox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                          {amenitiesOptions.map((option) => (
                            <Listbox.Option
                              key={option}
                              value={option}
                              as={Fragment}
                            >
                              {() => (
                                <li
                                  onClick={() => toggleSelect(option)}
                                  className="cursor-pointer select-none p-2 flex items-center gap-2"
                                >
                                  <span
                                    className={`inline-block w-4 h-4 rounded ${
                                      selected.includes(option)
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></span>
                                  <span>{option}</span>
                                </li>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </>
                  )}
                </Listbox>
              </div>
              {errors.amenities && (
                <p className="text-red-500 text-xs mt-1">{errors.amenities}</p>
              )}
            </div>

            {/* status */}
            <div className="flex flex-col">
              <label htmlFor="statss" className="font-semibold">
                Status
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                  disabled
                >
                  <option value="avaliable">Avaliable</option>
                </select>
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* floor */}
            <div className="flex flex-col">
              <label htmlFor="floor" className="font-semibold">
                Country
              </label>
              <input
                name="suiteType"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Description</h3>
            <textarea
              rows={1}
              name="description"
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
            ></textarea>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Client Special Request Note
            </h3>
            <textarea
              rows={1}
              name="specialNote"
              placeholder="Enter special note"
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
            ></textarea>
          </div>
        </section>

        {/* Payment Section */}
        <section className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center mt-10">
            Payment Options
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1 mb-2">
              <label className="block text-sm text-gray-800 font-bold">
                Payment Method
              </label>
              <div className="relative">
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 cursor-pointer"
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
                <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-gray-800 font-bold">
                Card Holder Name
              </label>
              <input
                type="text"
                placeholder="Enter holder name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                required
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="block text-sm text-gray-800 font-bold">
                Expiry date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
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
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200"
                required
              />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Link to="/dashboard/dashboard_booking">
            <button
              type="button"
              className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md font-medium hover:bg-[#F9862D] hover:text-white cursor-pointer transition"
            >
              Cancel
            </button>
          </Link>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submiting}
            className={`px-4 py-2 rounded text-white transition-colors duration-200
            ${
              submiting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F9862D] hover:bg-orange-600 cursor-pointer"
            }`}
          >
            {submiting ? "Saving..." : "Save Booking"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddBookingForm;
