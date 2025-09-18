import { useState } from "react";
import { Link } from "react-router-dom";

export default function Security() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "https://backend.bahamaslrb.com/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        setFormData({
          username: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(result.error || "Failed to update password.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 w-full mx-auto bg-white rounded-xl shadow-md mt-5 border border-gray-200">
      <h3 className="text-lg text-center font-bold my-7">Security</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Input
          label="User Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          type="text"
        />
        <Input
          label="Old Password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          placeholder="Enter old password"
          type="password"
        />
        <Input
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          type="password"
        />
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Enter confirm password"
          type="password"
        />
      </div>
      <div className="flex justify-end gap-4 w-full mb-6 mt-10">
        <Link to="/dashboard/room">
          <button className="px-4 py-2 border rounded text-gray-700 hover:bg-[#F9862D] hover:text-white hover:border-[#F9862D]">
            Cancel
          </button>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

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
