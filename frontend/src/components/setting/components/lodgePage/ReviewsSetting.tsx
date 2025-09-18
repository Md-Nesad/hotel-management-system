import { useState } from "react";
import { Link } from "react-router-dom";

export default function SettingReviews() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      reviewsTitle: title,
      reviewsSubTitle: subTitle,
    };

    try {
      const res = await fetch(
        "https://backend.bahamaslrb.com/api/page/create-reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      alert("Review section saved successfully!");
      setTitle("");
      setSubTitle("");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save review section.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md mt-5">
        Lodge page settings
      </h2>

      <section className="px-8 py-4 w-full mx-auto bg-white rounded-b-xl shadow-md">
        <h2 className="text-center text-xl font-bold mb-10">REVIEWS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reviews title"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Sub Title</label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Enter reviews sub title"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>
        </div>

        {/* buttons */}
        <div className="flex justify-center gap-4 w-full mb-6 mt-10">
          <Link to="/dashboard/profile">
            <button className="px-4 py-2 cursor-pointer hover:bg-[#F9862D] hover:text-white border border-orange-400 rounded text-gray-700">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </>
  );
}
