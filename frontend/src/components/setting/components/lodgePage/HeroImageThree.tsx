import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // make sure axios is installed
import imageCompression from "browser-image-compression";
import { usePageData } from "../../../../context/PageDataContext";
import { X } from "lucide-react";

export default function HeroImageThree() {
  const [image1, setImage1] = useState<File | null>(null);
  const [title1, setTitle1] = useState("");
  const [button1, setButton1] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pageData } = usePageData();

  const handleImageChange = async (
    setImage: (file: File | null) => void,
    file: File | null
  ) => {
    if (!file) {
      setImage(null);
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.2, // target ~500KB
        maxWidthOrHeight: 800, // resize to max 1280px
        useWebWorker: true,
      };

      const compressedBlob = await imageCompression(file, options);

      // Convert Blob back to File
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });

      setImage(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      setImage(file); // fallback original if compression fails
    }
  };
  const handleDeleteImage = () => {
    setImage1(null);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (image1) formData.append("img3", image1);
      formData.append("img3Title", title1);
      formData.append("button3", button1);

      const response = await axios.post(
        "https://backend.bahamaslrb.com/api/page/create-image3",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert(response.data.message || "Saved successfully!");
      setImage1(null);
      setTitle1("");
      setButton1("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md mt-5">
        Lodge page settings
      </h2>
      <form
        onSubmit={handleSubmit}
        className="px-8 py-4 w-full mx-auto bg-white rounded-b-xl shadow-md"
      >
        <h2 className="text-center text-xl font-bold mb-5">Hero Image 3</h2>
        <div>
          <div className="w-[280px] mx-auto bg-gray-300 rounded-md relative overflow-hidden cursor-pointer">
            {image1 ? (
              <>
                <img
                  src={URL.createObjectURL(image1)}
                  alt="Image 1"
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-5"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <img
                src={
                  pageData && pageData.img3
                    ? `https://backend.bahamaslrb.com/uploads/${pageData.img3}`
                    : "no image found"
                }
                alt="home page one"
              />
            )}
            <input
              title="click to change image"
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleImageChange(setImage1, e.target.files?.[0] || null)
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2 mb-7">Image 3</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-b border-gray-200 pb-8">
          <div>
            <label className="text-sm font-bold">Image 3 Title</label>
            <input
              type="text"
              placeholder="Enter title"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={title1}
              onChange={(e) => setTitle1(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold">Button 3</label>
            <input
              type="text"
              placeholder="Enter button text"
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
              value={button1}
              onChange={(e) => setButton1(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 w-full mb-6 mt-10">
          <Link to="/dashboard/profile">
            <button
              type="button"
              className="px-4 py-2 cursor-pointer hover:bg-[#F9862D] hover:text-white border border-orange-400 rounded text-gray-700"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
