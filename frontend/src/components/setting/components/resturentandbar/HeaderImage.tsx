import { useState } from "react";
import { Link } from "react-router-dom";
import type { ChangeEvent } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useFoodData } from "../../../../context/ResturentDataContext";
import { X } from "lucide-react";

export default function HeaderImage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { foodData } = useFoodData();

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
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
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
    selectedImage && setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("headerImage", selectedImage);

    try {
      setIsSubmitting(true);

      const res = await axios.post(
        "https://backend.bahamaslrb.com/api/food/create/header-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(res.data);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setIsSubmitting(false);
      setSelectedImage(null);
    }
  };

  return (
    <>
      <h2 className="text-xl text-orange-400 font-semibold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md">
        Restaurant & Bar Page Settings
      </h2>

      <section className="px-8 py-4 w-full mx-auto bg-white shadow-md border-t border-gray-300 rounded-b-xl">
        <h2 className="text-center text-xl font-bold mb-10">HEADER IMAGE</h2>

        <div>
          <div className="w-[280px] mx-auto bg-gray-300 rounded-md relative overflow-hidden cursor-pointer">
            {selectedImage ? (
              <>
                <img
                  src={URL.createObjectURL(selectedImage)}
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
                  foodData && foodData.headerImage
                    ? `https://backend.bahamaslrb.com/uploads/${foodData.headerImage}`
                    : "no image found"
                }
                alt="header image"
              />
            )}
            <input
              title="click to change image"
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleImageChange(setSelectedImage, e.target.files?.[0] || null)
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Cancel Button */}
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
