import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const features = [
  "General Operation Management",
  "Booking Management",
  "Reservation Management",
  "Housekeeping Management",
  "Guest Information Management",
  "Staff Role Management",
  "Event Management",
  "Marketing & Offer Management",
  "Reputation Management",
  "Inventory / Room Management",
  "Reporting & Data Management",
];

type Concierge = {
  id: string;
  username: string;
  employeeId: string;
};

const FeatureAccess = () => {
  const [concierges, setConcierges] = useState<Concierge[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [lockType, setLockType] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [access, setAccess] = useState<Record<string, boolean>>(
    features.reduce((acc, feature) => {
      acc[feature] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Fetch all concierges on mount
  useEffect(() => {
    const fetchConcierges = async () => {
      try {
        const res = await fetch(
          "https://backend.bahamaslrb.com/user/all/houseKeeper",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        setConcierges(data?.data || []);
      } catch (error) {
        console.error("Error fetching concierge data:", error);
        setError("Failed to load employee list.");
      }
    };
    fetchConcierges();
  }, []);

  const handleToggle = (feature: string) => {
    setAccess((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployeeId(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setError("");
    setSuccess("");

    // Validate required fields
    if (!employeeId) {
      alert("Please select an housekeeper.");
      return;
    }

    if (!lockType) {
      alert("Please select status (Lock/Unlock).");
      return;
    }

    const selectedEmployee = concierges.find((emp) => emp.id === employeeId);

    if (!selectedEmployee) {
      alert("Selected employee not found. Please try again.");
      return;
    }

    // Payload
    const payload = {
      houseKeeperName: selectedEmployee.username,
      houseKeeperId: selectedEmployee.id,
      lockType,
      featureAccess: {
        generalOperationManagement: access["General Operation Management"],
        bookingManagement: access["Booking Management"],
        reservationManagement: access["Reservation Management"],
        houseKeepingManagement: access["Housekeeping Management"],
        guestInformationManagement: access["Guest Information Management"],
        staffRoleManagement: access["Staff Role Management"],
        eventManagement: access["Event Management"],
        marketingOfferManagement: access["Marketing & Offer Management"],
        reputationManagement: access["Reputation Management"],
        roomManagement: access["Inventory / Room Management"],
        reportingDataManagement: access["Reporting & Data Management"],
      },
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(
        "https://backend.bahamaslrb.com/api/houseKeeper/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("HouseKeeper feature access saved successfully!");
      } else {
        alert("HouseKeeper already exists!");
      }
      setLockType("");
      setEmployeeId("");
    } catch (error) {
      console.error("Error:", error);
      setError("Error submitting data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="text-xl w-full font-bold px-6 py-4 mx-auto border-b-0 border-gray-200 bg-white rounded-t-md shadow-md">
        HouseKeeper Management & Feature Access
      </h2>

      <div className="w-full mx-auto bg-white p-6 rounded-b-md shadow border border-gray-200">
        {/* employee details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Employee Name dropdown */}
          <div>
            <label className="text-sm font-bold">HouseKeeper Name</label>
            <div className="relative">
              <select
                className="w-full py-2 pl-4 appearance-none border border-gray-300 rounded bg-gray-300 mt-2"
                onChange={handleEmployeeSelect}
                value={employeeId}
              >
                <option className="text-black" value="">
                  Select HouseKeeper
                </option>
                {concierges.map((emp) => (
                  <option className="text-black" key={emp.id} value={emp.id}>
                    {emp?.username}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-5 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Employee ID (auto filled) */}
          <div>
            <label className="text-sm font-bold">HouseKeeper ID</label>
            <input
              type="text"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={
                concierges.find((emp) => emp.id === employeeId)?.id ||
                "Auto generated"
              }
              disabled
            />
          </div>

          {/* Lock/Unlock */}
          <div>
            <label className="text-sm font-bold">Lock/Unlock</label>
            <div className="relative">
              <select
                className="w-full py-2 pl-4 appearance-none border border-gray-300 rounded bg-gray-300 mt-2"
                value={lockType}
                onChange={(e) => setLockType(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="permanent">Lock</option>
                <option value="temporary">Unlock</option>
              </select>
              <FiChevronDown className="absolute right-3 top-5 text-gray-600 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error / Success message */}
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        {success && <p className="text-green-600 mt-4 text-sm">{success}</p>}

        <h2 className="text-center text-gray-600 text-md font-bold mb-5 mt-9">
          Feature Access
        </h2>
        <ul className="divide-y divide-gray-200">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex justify-between items-center py-3 text-sm text-[#012135a8] font-bold"
            >
              {feature}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={access[feature]}
                  onChange={() => handleToggle(feature)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-200"></div>
              </label>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/dashboard/profile">
            <button className="px-4 py-2 cursor-pointer hover:bg-[#F9862D] hover:text-white border border-orange-400 rounded text-gray-700">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureAccess;
