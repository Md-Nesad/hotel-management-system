import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/footer";

const CheckStay = () => {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheck = async () => {
    setError("");
    if (!confirmation.trim()) {
      setError("Please enter your confirmation number.");
      return;
    }

    try {
      const response = await axios.get(
        `https://backend.bahamaslrb.com/api/booking/${confirmation}`
      );
      const bookingData = response.data;

      navigate("/room-list", { state: { booking: bookingData } });
    } catch (err) {
      console.error(err);
      setError("Invalid confirmation number or booking not found.");
    }
  };

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white w-full max-w-md sm:rounded-lg shadow-md sm:p-8 p-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
            Check Your Stay
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
            Enter your booking confirmation number below to view your
            reservation.
          </p>

          <div className="mt-6">
            <label
              htmlFor="confirmation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirmation Number
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Enter confirmation number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheck}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md transition cursor-pointer"
            >
              Check Now
            </button>
            <button
              onClick={() => {
                setConfirmation("");
                setError("");
                navigate("/");
              }}
              className="w-full border border-orange-300 text-orange-500 font-medium py-2 rounded-md hover:bg-orange-50 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckStay;
