import { useState } from "react";

import { Link } from "react-router-dom";
import NavbarSetting from "../../NavbarSetting";

export default function WelcomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle form submission logic here
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://backend.bahamaslrb.com/api/page/create-contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location, phoneNumber }),
        }
      );
      const data = await response.json();

      alert(data.message || "Welcome page data saved successfully!");

      setLocation("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error saving welcome page data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <NavbarSetting />
      <h2 className="text-xl font-bold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md">
        Lodge page settings
      </h2>
      <section className="px-8 py-4 w-full mx-auto bg-white rounded-b-xl shadow-md">
        <h2 className="text-center text-xl font-bold mb-10">Welcome Page</h2>

        {/* Location and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <label className="text-sm font-bold">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-bold">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>
        </div>

        {/* button */}
        <div className="flex justify-center gap-4 w-full mb-6 mt-10">
          <Link to="/dashboard/profile">
            <button className="px-4 py-2 cursor-pointer hover:bg-[#F9862D] hover:text-white border border-orange-400 rounded text-gray-700">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer"
          >
            {isSubmitting ? "saving..." : "Save"}
          </button>
        </div>
      </section>
    </>
  );
}
