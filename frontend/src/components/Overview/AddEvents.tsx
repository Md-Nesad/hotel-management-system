import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import DatePicker from "react-datepicker";
import { Folder } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression"; // ✅ add this

interface EventFormProps {
  className?: string;
}

const AddEvents: React.FC<EventFormProps> = () => {
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [event, setEvent] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  // 📌 handle file selection with compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        // compression options
        const options = {
          maxSizeMB: 0.2, // max file size in MB
          maxWidthOrHeight: 800, // resize dimensions
          useWebWorker: true,
        };

        // compress image
        const compressedBlob = await imageCompression(selectedFile, options);

        // Convert Blob back to File
        const compressedFile = new File([compressedBlob], selectedFile.name, {
          type: selectedFile.type,
        });

        // save compressed file
        setFile(compressedFile);

        // preview (convert to base64)
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setPhotoUrl(reader.result);
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }
  };

  const formatCustomDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const dateNum = date.getDate();
    const ordinal =
      dateNum % 10 === 1 && dateNum !== 11
        ? "st"
        : dateNum % 10 === 2 && dateNum !== 12
        ? "nd"
        : dateNum % 10 === 3 && dateNum !== 13
        ? "rd"
        : "th";
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    return `${dayName} ${dateNum}${ordinal} ${monthName} ${year} @${hours}${
      minutes ? `:${minutes.toString().padStart(2, "0")}` : ""
    }${ampm}`;
  };

  // Save event to backend
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please log in.");
      return;
    }

    const errors: string[] = [];
    if (!title) errors.push("Title");
    if (!dateTime) errors.push("Date & Time");
    if (!location) errors.push("Location");
    if (!description) errors.push("Description");
    if (!status) errors.push("Status");

    if (errors.length > 0) {
      alert(`Please fill the following fields:\n${errors.join("\n")}`);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    const formattedDate = formatCustomDate(new Date(dateTime));
    formData.append("dateTime", formattedDate);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("status", status.toLowerCase().trim());
    formData.append("button", "Register Now");
    formData.append("content", event);

    if (file) {
      formData.append("image", file);
    }
    setIsSubmiting(true);
    try {
      const response = await fetch(
        "https://backend.bahamaslrb.com/api/event/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Response:", result);

      if (!response.ok) {
        alert(`Failed to save event: ${result.message || "Unknown error"}`);
        return;
      }

      alert("Event saved successfully!");
      handleCancel(); // Clear form after save
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Internal server error. Please try again later.");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleCancel = () => {
    setPhotoUrl("");
    setFile(null);
    setTitle("");
    setDateTime("");
    setLocation("");
    setDescription("");
    setStatus("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white border border-gray-200 w-full rounded-lg mb-0">
      <div className="flex flex-col items-center md:my-10 my-6 px-3 lg:my-16">
        <label className="w-[290px] h-[220px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-3 cursor-pointer">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Event"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="flex items-center gap-1 text-gray-400 text-sm underline">
              <Folder className="w-4 h-4" />
              Upload Photo
            </span>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange} // ✅ compression handler use হবে
          />
        </label>
      </div>

      <Formik
        initialValues={{ dateTime }}
        enableReinitialize
        onSubmit={() => {}}
      >
        {() => (
          <Form>
            <div className="mb-4 px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label className="block text-sm text-gray-500 mb-1 font-bold">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                    required
                  />
                </div>

                {/* Date & Time */}
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">
                      Date & Time
                    </label>
                    <DatePicker
                      selected={dateTime ? new Date(dateTime) : null}
                      onChange={(date) =>
                        date && setDateTime(date.toISOString())
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="yyyy-MM-dd h:mm aa"
                      placeholderText="Select date & time"
                      className="w-full border cursor-pointer border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                    />
                  </div>

                  {/* Time (just visual) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      placeholder="am/pm"
                      disabled
                      className="w-20 border border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                    />
                  </div>
                </div>

                {/* Content Type */}
                <div className="w-full">
                  <label htmlFor="contentType" className="font-bold">
                    Content Type
                  </label>
                  <div className="relative">
                    <select
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      className="w-full border border-gray-300 appearance-none rounded-md py-2 px-3 bg-gray-200"
                    >
                      <option value="">Select</option>
                      <option value="event">Event</option>
                      <option value="news">News</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="w-full mt-5 col-span-2">
                  <label className="block text-sm font-bold text-gray-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                    required
                  />
                </div>

                <div className="w-full mt-5">
                  <label className="block text-sm font-bold text-gray-500 mb-1">
                    Button
                  </label>
                  <input
                    type="text"
                    placeholder="Register Now"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                  />
                </div>

                <div className="w-full mt-5">
                  <label className="block text-sm font-bold text-gray-500 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border appearance-none border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="public">Public</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="Published">Published</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <label className="block text-sm font-bold text-gray-500 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-200"
                  required
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-4 my-8 px-6">
        <Link to="/dashboard/events">
          <button
            type="button"
            className="px-8 py-2 border border-orange-500 text-orange-500 rounded-md font-medium hover:bg-[#F9862D] hover:text-white cursor-pointer transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </Link>
        <button
          type="button"
          className="px-8 py-2 cursor-pointer bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
          onClick={handleSave}
        >
          {isSubmiting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddEvents;
