import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useFoodData } from "../../../../context/ResturentDataContext";
import { X } from "lucide-react";

export default function FoodListImageTwo() {
  const [image1, setImage1] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
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

  const handleSubmit = async () => {
    if (!title || !price || !image1) {
      alert("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title2", title);
    formData.append("price2", price);
    formData.append("img2", image1);

    try {
      const response = await axios.post(
        "https://backend.bahamaslrb.com/api/food/create/block2", // replace with actual API
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message || "Food list image saved successfully!");
      console.log(response.data);
      setImage1(null);
      setTitle("");
      setPrice("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to save data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-xl text-orange-400 font-semibold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md mt-5">
        Restaurant & Bar Page Settings
      </h2>
      <div className="px-8 py-4 w-full mx-auto bg-white rounded-b-xl shadow-md">
        <h2 className="text-center text-xl font-bold mb-5">
          FOOD LIST IMAGE 2
        </h2>
        <div>
          <div className="w-[280px] h-40 mx-auto bg-gray-300 rounded-md relative overflow-hidden cursor-pointer">
            {image1 ? (
              <>
                <img
                  src={URL.createObjectURL(image1)}
                  alt="Image 1"
                  className="w-full h-full object-center object-cover"
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
                  foodData && foodData.img2
                    ? `https://backend.bahamaslrb.com/uploads/${foodData.img2}`
                    : "no image found"
                }
                alt="First food two"
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
        </div>

        {/* Titles & Price Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-gray-200 pb-8 mt-10">
          <div>
            <label className="text-sm font-bold">Title</label>
            <input
              type="text"
              placeholder="Enter food title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Price</label>
            <input
              type="number"
              placeholder="Enter food price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
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
            className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
