import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MenuListSetting() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !subTitle.trim()) {
      alert("Both Title and Sub Title are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://backend.bahamaslrb.com/api/menuBlock/create/menu-block",
        {
          title,
          subtitle: subTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message || "Menu settings saved successfully!");

      setTitle("");
      setSubTitle("");
    } catch (error) {
      console.error("Error saving menu settings:", error);
      alert("Error saving data. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-xl text-orange-400 font-semibold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md mt-10">
        Restaurant & Bar Page Settings
      </h2>
      <section className="px-8 py-4 w-full mx-auto bg-white rounded-b-xl shadow-md">
        <h2 className="text-center text-xl font-bold mb-10">Menu List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter menu title"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Sub Title</label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Enter menu subtitle"
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </>
  );
}
