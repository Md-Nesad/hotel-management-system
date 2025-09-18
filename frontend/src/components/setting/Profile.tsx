import { Switch } from "@headlessui/react";
import NavbarSetting from "./NavbarSetting";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import Security from "./components/Security";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

export default function AdminSettingsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastProfile, setLastProfile] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const res = await fetch("https://backend.bahamaslrb.com/api/profile/all");
      const data = await res.json();
      setLastProfile(data[data.length - 1]);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    timeZone: "",
    adminPreferenceLanguage: "",
    notifications: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);

        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
        });
        setSelectedFile(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
        alert("Image compression failed!");
      }
    } else {
      alert("Only image files are allowed!");
    }
  };

  const handleSubmit = async () => {
    for (let [key, value] of Object.entries(formData)) {
      if (
        key !== "notifications" && // notifications not required
        typeof value === "string" &&
        value.trim() === ""
      ) {
        alert(`${key} is required!`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      if (selectedFile) {
        form.append("profileImage", selectedFile);
      }
      form.append("fullName", formData.fullName);
      form.append("emailAddress", formData.emailAddress);
      form.append("phoneNumber", formData.phoneNumber);
      form.append("timeZone", formData.timeZone);
      form.append("adminPreferenceLanguage", formData.adminPreferenceLanguage);
      form.append("notifications", String(formData.notifications));

      // Debug: Log what is being sent
      console.log("==== FormData Preview ====");
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch(
        "https://backend.bahamaslrb.com/api/profile/register",
        {
          method: "POST",
          body: form,
        }
      );

      const result = await res.json();

      console.log("API Response:", result);

      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        timeZone: "",
        adminPreferenceLanguage: "",
        notifications: true,
      });

      setSelectedFile(null);

      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Error: " + result.error);
        console.error("API Error:", result);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  return (
    <>
      <NavbarSetting />
      <h2 className="text-2xl font-bold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md">
        Admin Page
      </h2>

      <div className="p-8 w-full mx-auto bg-white rounded-b-xl shadow-md">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : `https://backend.bahamaslrb.com/uploads/${lastProfile?.profileImage}`
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border border-white object-cover"
            />
            <label
              htmlFor="fileUpload"
              className="absolute bottom-1 right-1 bg-black p-1 rounded-full border border-white cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l3.536 3.536M12.293 9.707L15 7l2 2-2.707 2.707M9 13h.01M4 21h16"
                />
              </svg>
            </label>
            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            <Input
              label="Log In Email Address"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            {/* Select Fields */}
            <Select
              label="Time Zone"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              options={[
                { label: "Select", value: "" },
                { label: "Eastern Time (US)", value: "Eastern Time (US)" },
                {
                  label: "Central European Time (France)",
                  value: "Central European Time (France)",
                },
                {
                  label: "Central European Time (Germany)",
                  value: "Central European Time (Germany)",
                },
              ]}
            />
            <Select
              label="Admin Preferences Language"
              name="adminPreferenceLanguage"
              value={formData.adminPreferenceLanguage}
              onChange={handleChange}
              options={[
                { label: "Select", value: "" },
                { label: "English", value: "en" },
                { label: "French", value: "fr" },
              ]}
            />

            {/* Notification */}
            <div>
              <label className="text-sm">Notification</label>
              <div className="w-full mt-2 relative">
                <div className="py-2 pl-4 border border-gray-300 rounded bg-gray-300">
                  {formData.notifications ? "On" : "Off"}
                </div>
                <Switch
                  checked={formData.notifications}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, notifications: value }))
                  }
                  className={`absolute top-[-30px] right-4 float-end ${
                    formData.notifications ? "bg-green-500" : "bg-gray-300"
                  } relative inline-flex h-5 w-10 items-center rounded-full`}
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    className={`${
                      formData.notifications ? "translate-x-5" : "translate-x-1"
                    } inline-block h-3.5 w-3.5 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 w-full mb-6 mt-10">
          <Link to="/dashboard/room">
            <button className="px-4 py-2 border rounded text-gray-700 hover:bg-[#F9862D] hover:text-white hover:border-[#F9862D]">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <Security />
    </>
  );
}

// Reusable Input Component
function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
      />
    </div>
  );
}

// Reusable Select Component
function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-bold">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full py-2 pl-4 appearance-none border border-gray-300 rounded bg-gray-300 mt-2"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-5 text-gray-600 pointer-events-none" />
      </div>
    </div>
  );
}
