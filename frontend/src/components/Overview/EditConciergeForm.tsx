import { useEffect, useState } from "react";
import { FiCamera, FiChevronDown } from "react-icons/fi";

import { Link, useParams } from "react-router-dom";

export default function AddConcierge() {
  const { employeId } = useParams();
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [assignedFloor] = useState(3);
  const [scheduleDay, setScheduleDay] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [dutyStatus, setDutyStatus] = useState(" ");
  const [specialNote, setSpecialNote] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [allEmployeeIds, setAllEmployeeIds] = useState<string[]>([]);
  const [originalData, setOriginalData] = useState<any>({});

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // local preview only
    }
  };

  useEffect(() => {
    const fetchConcierge = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://backend.bahamaslrb.com/api/concierges/${employeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data) {
          setName(data.name || "");
          setEmployeeId(data.employeeId || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setJobDescription(data.jobDescription || "");
          setScheduleDay(data.scheduleDay || "");
          setScheduleTime(data.scheduleTime || "");
          setSalary(data.salary || 0);
          setDutyStatus(data.dutyStatus || "");
          setSpecialNote(data.specialNote || "");
          setAddress(data.address || "");
          setOriginalData(data); // ✅ Save original for comparison
        }
      } catch (error) {
        console.error("Failed to fetch concierge:", error);
      }
    };

    fetchConcierge();
  }, [employeId]);

  // Fetch all concierges once on component load

  // const resetForm = () => {
  //   setName("");
  //   setEmployeeId("");
  //   setEmail("");
  //   setPhone("");
  //   setJobDescription("");
  //   setScheduleDay("");
  //   setScheduleTime("");
  //   setSalary(0);
  //   setDutyStatus("");
  //   setSpecialNote("");
  //   setAddress("");
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Compare and collect only changed fields
    const data: any = {};
    if (name !== originalData.name) data.name = name;
    if (employeeId !== originalData.employeeId) data.employeeId = employeeId;
    if (email !== originalData.email) data.email = email;
    if (phone !== originalData.phone) data.phone = phone;
    if (jobDescription !== originalData.jobDescription)
      data.jobDescription = jobDescription;
    if (Number(assignedFloor) !== Number(originalData.assignedFloor))
      data.assignedFloor = Number(assignedFloor);
    if (salary !== originalData.salary) data.salary = salary;
    if (dutyStatus !== originalData.dutyStatus) data.dutyStatus = dutyStatus;
    if (specialNote !== originalData.specialNote)
      data.specialNote = specialNote;
    if (address !== originalData.address) data.address = address;
    if (scheduleDay !== originalData.scheduleDay)
      data.scheduleDay = scheduleDay;
    if (scheduleTime !== originalData.scheduleTime)
      data.scheduleTime = scheduleTime;

    if (Object.keys(data).length === 0) {
      alert("No changes detected.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend.bahamaslrb.com/api/concierges/${employeId}`,
        {
          method: "PUT", // if your backend supports PATCH, consider changing this
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update concierge.");
      }

      const result = await response.json();
      alert(result?.message || "Concierge updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Error updating concierge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full text-black mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {/* Title */}
      <h2 className="text-center text-xl font-semibold mb-6 border-b-2 border-gray-300 pb-2">
        Edit Concierge
      </h2>

      <div className="flex flex-col items-center mb-6">
        <label className="relative w-28 h-28 rounded-full cursor-pointer group">
          {previewImage ? (
            <img
              title="Change Image"
              src={previewImage}
              alt="Housekeeper"
              className="w-28 h-28 rounded-full object-cover shadow-md border border-gray-200"
            />
          ) : (
            <div
              title="Chnage Image"
              className="w-26 h-26 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50 group-hover:bg-gray-100 transition"
            >
              <FiCamera className="w-8 h-8" />
            </div>
          )}

          {/* Overlay icon (optional, shows on hover) */}
          {previewImage && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
              <FiCamera className="text-white w-6 h-6" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="space-y-7">
        <div className="grid grid-cols-4 gap-4">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Name
            </label>
            <input
              type="text"
              placeholder="Angel Lara"
              className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 pl-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="EMP123"
              className="w-full border bg-gray-200 border-gray-300 rounded-md p-2 pl-4"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          {/* Duty Status */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Duty Status
            </label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-md p-2 appearance-none pl-4 bg-gray-200"
                value={dutyStatus}
                onChange={(e) => setDutyStatus(e.target.value)}
              >
                <option value="">Select</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Phone
            </label>
            <input
              type="text"
              placeholder="+12345678912"
              className="w-full border border-gray-300 rounded-md p-2 pl-4 bg-gray-200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Email
            </label>
            <input
              type="email"
              placeholder="angellara@gmail.com"
              className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 pl-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Schedule Type & Time */}
        <div className="grid grid-cols-4 gap-4">
          {/* Address */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Address
            </label>
            <input
              type="text"
              placeholder="Nyanirambo near green corn at kn192 st, house #3"
              className="w-full border border-gray-300 rounded-md p-2 pl-4 bg-gray-200"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Schedule Day(s)
            </label>
            <div className="relative">
              <select
                value={scheduleDay}
                onChange={(e) => setScheduleDay(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 pl-4 appearance-none bg-gray-200"
              >
                <option value="">Select</option>
                <option value="Sunday-Monday">Sunday-Monday</option>
                <option value="Tuesday-Wednesday">Tuesday-Wednesday</option>
                <option value="Thursday-Friday">Thursday-Friday</option>
                <option value="Saturday-Sunday">Saturday-Sunday</option>
              </select>
              <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Schedule Time */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Schedule Time(s)
            </label>
            <div className="relative">
              <select
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 pl-4 appearance-none bg-gray-200"
              >
                <option value="">Select</option>
                <option value="09AM-05PM">09AM-05PM</option>
                <option value="05PM-01AM">05PM-01AM</option>
                <option value="07AM-03PM">07AM-03PM</option>
                <option value="02PM-10PM">02PM-10PM</option>
              </select>
              <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Conditional Custom Day & Time Inputs */}
        {scheduleDay === "daily" && scheduleTime === "hourly" && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1 font-bold">
                Working Days
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 pl-4 bg-gray-200"
                value={scheduleDay}
                onChange={(e) => setScheduleDay(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-bold">
                Working Time
              </label>
              <input
                type="text"
                placeholder="e.g. 8AM - 4PM"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 pl-4 bg-gray-200"
              />
            </div>
          </div>
        )}

        {/* salary and job description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Job Description
            </label>
            <input
              type="text"
              placeholder="Job description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 pl-4 bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1 font-bold">
              Salary
            </label>
            <input
              type="number"
              placeholder="15,000Fr"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 pl-4"
            />
          </div>
        </div>

        {/* Special Note */}
        <div className="md:col-span-2">
          <label className="block text-gray-600 text-sm mb-1 font-bold">
            Special Note
          </label>
          <input
            type="text"
            placeholder="VIP guests only"
            className="w-full border pb-5 border-gray-300 rounded-md p-2 pl-4 bg-gray-200"
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        <Link to="/dashboard/concierge">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-[#F9862D] rounded-md text-gray-600 hover:text-white"
          >
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}
