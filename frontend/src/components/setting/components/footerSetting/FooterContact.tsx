import { useState } from "react";
import { Link } from "react-router-dom";

export default function FooterContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form field states
  const [location, setLocation] = useState("");
  const [phone1, setPhone1] = useState("");
  const [email, setEmail] = useState("");
  const [phone2, setPhone2] = useState("");

  const handleSubmit = async () => {
    if (!location || !phone1 || !email || !phone2) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      location: location,
      phoneNumber1: phone1,
      phoneNumber2: phone2,
      phoneNumber3: "kdjkasdj",
      email,
    };

    try {
      const res = await fetch(
        "https://backend.bahamaslrb.com/api/contact/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to send data");
      alert("Data submitted successfully!");

      setLocation("");
      setPhone1("");
      setEmail("");
      setPhone2("");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-md font-bold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md mt-5">
        FOOTER PAGE SETTING
      </h2>

      <section className="px-8 py-4 w-full mx-auto bg-white shadow-md border-t border-gray-300">
        <h2 className="text-center text-xl font-bold mb-10">FOOTER CONTACT</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full pb-8">
          <div>
            <label className="text-sm font-bold">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold">Phone Number 01</label>
            <input
              type="text"
              placeholder="Enter phone number 1"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold">Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold">Phone Number 02</label>
            <input
              type="text"
              placeholder="Enter phone number 2"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 w-full mb-6 mt-10">
          <Link to="/dashboard/profile">
            <button className="px-4 py-2 cursor-pointer hover:bg-[#F9862D] hover:text-white border border-orange-400 rounded text-gray-700">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </>
  );
}
