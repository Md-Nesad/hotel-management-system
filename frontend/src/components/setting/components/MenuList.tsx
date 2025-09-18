import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { X } from "lucide-react";

export default function MenuList({ image }: any) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [menuTitle, setMenuTitle] = useState("");
  const [items, setItems] = useState(
    Array.from({ length: 5 }, () => ({ name: "", price: "" }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleItemChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.2, // target ~500KB
        maxWidthOrHeight: 800, // resize max dimension
        useWebWorker: true,
      };

      const compressedBlob = await imageCompression(file, options);

      // Convert Blob back to File
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });
      setImageFile(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      setImageFile(file); // fallback
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  const handleSubmit = async () => {
    const filledItems = items.filter(
      (item) => item.name.trim() && item.price.trim()
    );

    if (!menuTitle) {
      alert("Menu Title is required.");
      return;
    }

    if (!imageFile) {
      alert("Image file is required.");
      return;
    }

    if (filledItems.length < 2) {
      alert("Please fill at least 2 menu items with name and price.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", menuTitle);

    filledItems.forEach((item, index) => {
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][price]`, item.price);
    });

    setIsSubmitting(true);
    try {
      const res = await fetch(
        "https://backend.bahamaslrb.com/api/menuSection/create",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      console.log(result);
      alert(result?.message || "Menu saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save menu.");
    } finally {
      setIsSubmitting(false);
      setImageFile(null);
      setMenuTitle("");
      setItems(Array.from({ length: 5 }, () => ({ name: "", price: "" })));
    }
  };

  return (
    <>
      <h2 className="text-xl text-orange-400 font-semibold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md mt-5">
        Restaurant & Bar Page Settings
      </h2>
      <section className="px-8 py-4 w-full mx-auto bg-white shadow-md border-t border-gray-300">
        <h2 className="text-center text-xl font-bold mb-10">MENU LIST</h2>

        {/* Image preview */}
        <div className="mt-5 place-items-center">
          <div
            title="Upload Menu Image"
            className="w-[280px] h-[180px] flex items-center justify-center rounded-md overflow-hidden relative bg-gray-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {imageFile ? (
              <>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-5"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <img
                src={image}
                alt="MAIN COURSE"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Hidden file input using ref */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          />
        </div>

        {/* Menu Title */}
        <div className="mt-5 grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-bold">Menu Title</label>
            <input
              type="text"
              placeholder="Enter Menu Title"
              value={menuTitle}
              onChange={(e) => setMenuTitle(e.target.value)}
              className="w-full py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
            />
          </div>
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pb-8 mt-4">
          {items.map((item, index) => (
            <div key={index}>
              <label className="text-sm font-bold">Item {index + 1}</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder={`Item ${index + 1}`}
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  className="w-[600px] py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
                />
                <input
                  type="text"
                  placeholder="4,000Fr"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  className="w-[140px] py-2 pl-4 border border-gray-300 rounded bg-gray-300 mt-2"
                />
              </div>
            </div>
          ))}
        </div>

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
