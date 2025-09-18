import { Folder } from "lucide-react";
import React, { useState, Fragment } from "react";
import type { ChangeEvent } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";

const amenitiesOptions = [
  "Free Wifi",
  "Free Parking",
  "TV",
  "Food Available",
  "Kettle",
  "Iron",
  "1 queen bed",
  "Separate room",
  "Towel",
  "Private bathroom",
  "No smoking allow",
];

const RoomForm: React.FC = () => {
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [selected, setSelected] = useState<string[]>([]);
  const [roomName, setRoomName] = useState("");
  const [bedSize, setBedSize] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_IMAGE_SIZE_MB = 20; // Max 5MB
  const handleAddMore = () => {
    setImages((prev) => [...prev, null]); // add new slot
  };
  const handleImageChange = async (index: number, file: File | null) => {
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.1, // ~100KB per image
        maxWidthOrHeight: 600, // resize to 600px max (maintains aspect ratio)
        useWebWorker: true,
        fileType: "image/webp", // convert to WebP (much smaller than JPEG/PNG)
      };

      const compressedBlob = await imageCompression(file, options);

      // Convert Blob back to File
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.images;
        return newErrors;
      });

      const updatedImages = [...images];
      updatedImages[index] = compressedFile;
      setImages(updatedImages);
    } catch (err) {
      console.error("Error compressing image:", err);
      alert("Failed to compress image. Please try another one.");
    }
  };

  const toggleSelect = (value: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((v) => v !== value)
        : [...prevSelected, value]
    );
  };

  const removeSelected = (value: string) => {
    setSelected((prevSelected) => prevSelected.filter((v) => v !== value));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!roomName) newErrors.roomName = "Room name is required";
    if (!price) newErrors.price = "Price is required and it should be a number";
    if (!status) newErrors.status = "Status is required";
    if (selected.length === 0)
      newErrors.amenities = "Select at least 1 amenity";
    if (!images.some((img) => img)) {
      newErrors.images = "At least 1 image is required";
    } else {
      for (let img of images) {
        if (img && img.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          newErrors.images = `Each image must be under ${MAX_IMAGE_SIZE_MB}MB`;
          break;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", roomName);
      formData.append("bed_size", bedSize || "");
      formData.append("beds", beds || "");
      formData.append("baths", baths || "");
      formData.append("amenities", selected.join(","));
      formData.append("price", price);
      formData.append("status", status);
      formData.append("description", description);
      formData.append("housekeepingStatus", "clean");

      images.forEach((img) => {
        if (img) formData.append("images", img);
      });
      console.log(formData);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://backend.bahamaslrb.com/api/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("result", result);

      alert(result.message || "Room submitted successfully!");

      //Reset form
      setRoomName("");
      setBedSize("");
      setBeds("");
      setBaths("");
      setPrice("");
      setStatus("");
      setSelected([]);
      setImages([null, null, null, null]);
      setDescription("");
      setErrors({});
    } catch (error) {
      console.error("error", error);
      alert("Failed to submit room!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-[16px] font-semibold text-gray-800 border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)]">
        Add New Room Information
      </h2>
      <form className=" bg-[#f9f9f9] flex items-center justify-center h-auto">
        <div className="w-full h-auto bg-white rounded-md shadow-md px-13 py-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="w-full h-[180px] flex items-center justify-center rounded-md cursor-pointer overflow-hidden relative bg-gray-300"
              >
                {img ? (
                  <>
                    <img
                      src={URL.createObjectURL(img)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = [...images];
                        updatedImages[index] = null;
                        setImages(updatedImages);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-red-600 z-5"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <Folder className="w-4 h-4" />
                    <span className="underline">Browse Now</span>
                  </span>
                )}

                {/* Upload + Compression */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleImageChange(index, e.target.files?.[0] || null)
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            ))}

            {/* Always show Add More AFTER last image */}
            <div
              onClick={handleAddMore}
              className="w-full h-[180px] flex items-center justify-center rounded-md cursor-pointer overflow-hidden bg-gray-300"
            >
              <span className="text-gray-500 text-sm font-medium underline">
                + Add More Images
              </span>
            </div>
          </div>

          {errors.images && (
            <p className="text-red-500 text-xs">{errors.images}</p>
          )}
          {/* room name */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="roomName" className="font-semibold">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room Name"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>
            {/* room number */}
            <div>
              <label htmlFor="roomNumber" className="font-semibold">
                Room Number
              </label>
              <input
                type="text"
                placeholder="Room Number"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>
            {/* suite type */}
            <div className="flex flex-col">
              <label htmlFor="suiteType" className="font-semibold">
                Suite Type
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                >
                  <option value="">Select here</option>
                  <option value="Single Suite">Single Suite</option>
                  <option value="Multiple Suite">Multiple Suite</option>
                </select>
                <FiChevronDown className="absolute right-2 top-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* suite number */}
            <div className="flex flex-col">
              <label htmlFor="suiteType" className="font-semibold">
                Suite Number
              </label>
              <div className="flex overflow-hidden gap-2">
                <div className="relative mr-2">
                  <select
                    name="suiteType"
                    className="w-17 border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                    <option value="I">I</option>
                    <option value="J">J</option>
                    <option value="K">K</option>
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="N">N</option>
                    <option value="O">O</option>
                    <option value="P">P</option>
                    <option value="Q">Q</option>
                    <option value="R">R</option>
                    <option value="S">S</option>
                    <option value="T">T</option>
                    <option value="U">U</option>
                    <option value="V">V</option>
                    <option value="W">W</option>
                    <option value="X">X</option>
                    <option value="Y">Y</option>
                    <option value="Z">Z</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-4 text-gray-400 pointer-events-none" />
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                  placeholder="Qeen bed"
                />
              </div>
            </div>
          </div>

          {/* second row && bed size */}
          <div className="grid grid-cols-5 gap-4">
            {/* bed size */}
            <div className="flex flex-col">
              <label htmlFor="bedSize" className="font-semibold">
                Bed Size
              </label>
              <div className="relative">
                <input
                  name="bedSize"
                  placeholder="Queen"
                  value={bedSize}
                  onChange={(e) => setBedSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                />
              </div>
            </div>
            {/* beds */}
            <div>
              <label className="block text-sm mb-1 font-bold">Beds</label>
              <input
                type="number"
                name="beds"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                placeholder="2 beds"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>
            {/* baths */}
            <div>
              <label className="block text-sm mb-1 font-bold">Baths</label>
              <input
                type="number"
                name="baths"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                placeholder="2 baths"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>
            {/* price */}
            <div>
              <label className="block text-sm mb-1 font-bold">Price</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15,000Fr"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="currency" className="font-semibold">
                Currency
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                >
                  <option value="FRW">FRW</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
                <FiChevronDown className="absolute right-2 top-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* aminities */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm mb-1 font-bold">Amenities</label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 min-h-[43px] bg-gray-200 mt-2">
                  {selected.length > 0 ? (
                    selected.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center bg-gray-400 rounded-full px-2 py-1 text-xs font-medium text-gray-600"
                      >
                        {item}
                        <button
                          onClick={() => removeSelected(item)}
                          className="ml-1 text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Select Amenities
                    </span>
                  )}
                </div>
                <Listbox
                  as="div"
                  value={selected}
                  onChange={setSelected}
                  multiple
                >
                  {() => (
                    <>
                      <Listbox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                          {amenitiesOptions.map((option) => (
                            <Listbox.Option
                              key={option}
                              value={option}
                              as={Fragment}
                            >
                              {() => (
                                <li
                                  onClick={() => toggleSelect(option)}
                                  className="cursor-pointer select-none p-2 flex items-center gap-2"
                                >
                                  <span
                                    className={`inline-block w-4 h-4 rounded ${
                                      selected.includes(option)
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></span>
                                  <span>{option}</span>
                                </li>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </>
                  )}
                </Listbox>
              </div>
              {errors.amenities && (
                <p className="text-red-500 text-xs mt-1">{errors.amenities}</p>
              )}
            </div>

            {/* status */}
            <div className="flex flex-col">
              <label htmlFor="statss" className="font-semibold">
                Status
              </label>
              <div className="relative">
                <select
                  name="suiteType"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                >
                  <option value="">Select</option>
                  <option value="Available">Avaliable</option>
                  <option value="Unavailable">Unavaliable</option>
                  <option value="One Left">One Left</option>
                </select>
                <FiChevronDown className="absolute right-2 top-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* floor */}
            <div className="flex flex-col">
              <label htmlFor="floor" className="font-semibold">
                Floor
              </label>
              <input
                title="No need to type. It always will be ground floor"
                name="floor"
                placeholder="Ground Floor"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              ></input>
            </div>
          </div>
          {/* description */}
          <div className="flex flex-col">
            <label htmlFor="description">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something..."
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link to="/dashboard/room_list">
              <button
                type="button"
                className="border cursor-pointer hover:bg-[#F9862D] hover:text-white border-orange-500 text-orange-500 px-5 py-2 rounded"
              >
                Cancel
              </button>
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-6 py-2 rounded shadow cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default RoomForm;

// Tailwind Input Class (Optional)
// .input {
//   @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full;
// }
