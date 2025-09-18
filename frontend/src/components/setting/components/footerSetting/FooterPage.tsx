import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { X } from "lucide-react";

export default function Footeepage() {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState<string>("");
  const [latestImage, setLatestImage] = useState<any | null>(null);

  useEffect(() => {
    const handleImage = async () => {
      try {
        const res = await fetch("https://backend.bahamaslrb.com/branding");
        const data = await res.json();
        setLatestImage(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    handleImage();
  }, []);

  const footerImage = `https://backend.bahamaslrb.com/uploads/${latestImage?.logo}`;

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImage(null);
      return;
    }

    try {
      // compression option
      const options = {
        maxSizeMB: 0.2, // max file size = 0.5 MB
        maxWidthOrHeight: 800, // max width/height
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
      setImage(file); // fallback
    }
  };
  const handleDeleteImage = () => {
    setImage(null);
  };
  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image before saving.");
      return;
    }

    if (!note.trim()) {
      alert("Please enter a note before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("logo", image);
      formData.append("text", note);
      const res = await fetch("https://backend.bahamaslrb.com/branding/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error("Upload failed");

      setImage(null);
      setNote("");

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-md font-bold px-6 py-4 w-full mx-auto border-b border-gray-200 bg-white rounded-t-xl shadow-md">
        FOOTER PAGE SETTING
      </h2>

      <section className="px-8 py-4 w-full mx-auto bg-white shadow-md border-t border-gray-300">
        <h2 className="text-center text-xl font-bold mb-10">FOOTER PAGE</h2>

        {/* Footer Image Upload */}
        <div className="mt-5 place-items-center">
          <div className="w-[280px] h-[180px] flex items-center justify-center rounded-md cursor-pointer overflow-hidden relative bg-gray-300">
            <>
              <img
                src={image ? URL.createObjectURL(image) : footerImage}
                alt="Footer Preview"
                className="w-full h-full object-cover"
              />

              {image && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-5"
                >
                  <X size={16} />
                </button>
              )}

              <input
                title="Click to upload image"
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleImageChange(e.target.files?.[0] || null)
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          </div>
        </div>

        {/* Note (Optional) */}
        <div className="mt-6">
          <label className="text-sm font-bold">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter a note..."
            className="w-full pb-5 pt-2 pl-4 border border-gray-300 text-xs rounded bg-white mt-2"
          />
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
