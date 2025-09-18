import { Folder } from "lucide-react";
import React, { useEffect, useState, Fragment } from "react";
import type { ChangeEvent } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";
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

const UpdateRoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const [images, setImages] = useState<(File | string | null)[]>([
    null,
    null,
    null,
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    roomName: "",
    beds: "",
    baths: "",
    price: "",
    status: "",
    description: "",
    bedSize: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //Fetch room details function
  const fetchRoomDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://backend.bahamaslrb.com/api/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;

      setFormData({
        roomName: data.name || "",
        beds: data.beds || "",
        baths: data.baths || "",
        price: data.price || "",
        status: data.status || "",
        description: data.description || "",
        bedSize: data.bed_size || "N/A",
      });

      setSelected(data.amenities || []);

      const mappedImages: (string | null)[] = [null, null, null, null];
      data.images.forEach((imgUrl: string, idx: number) => {
        mappedImages[idx] = imgUrl;
      });
      setImages(mappedImages);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  //fetch every time on page load
  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  //submit handler for put API
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.roomName);
      formDataToSend.append("beds", formData.beds);
      formDataToSend.append("baths", formData.baths);
      formDataToSend.append("bed_size", formData.bedSize); // check backend expects "bed_size"
      formDataToSend.append("price", formData.price);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("amenities", selected.join(","));

      images.forEach((img) => {
        if (img instanceof File) {
          formDataToSend.append("images", img);
        } else if (typeof img === "string" && img) {
          formDataToSend.append("existingImages[]", img);
        }
      });

      const res = await axios.put(
        `https://backend.bahamaslrb.com/api/rooms/${roomId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // set only this
          },
        }
      );

      const result = res.data;
      console.log("Update result:", result);

      alert(result.message || "Room updated successfully!");
      setMessage("Room updated successfully!");

      setFormData({
        roomName: "",
        beds: "",
        baths: "",
        price: "",
        status: "",
        description: "",
        bedSize: "",
      });
      setSelected([]);
      setImages([null, null, null, null]);
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room ❌");
      setMessage("Failed to update room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Room edit title */}
      <h2 className="text-[16px] font-semibold text-gray-800 border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)]">
        Edit Room Information
      </h2>

      <div className=" bg-[#f9f9f9] flex items-center justify-center h-auto">
        {/* Images */}
        <section className="w-full h-auto bg-white rounded-md shadow-md px-13 py-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="w-full h-[180px] flex items-center justify-center rounded-md cursor-pointer overflow-hidden relative bg-gray-300"
              >
                {img ? (
                  typeof img === "string" ? (
                    <>
                      <img
                        src={`https://backend.bahamaslrb.com/${
                          img.startsWith("/") ? img.slice(1) : img
                        }`}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />

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
                    <>
                      <img
                        src={URL.createObjectURL(img)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

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
                  )
                ) : (
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <Folder className="w-4 h-4" />
                    <span className="underline">Browse Now</span>
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(index, e.target.files?.[0] || null)
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Room Fields */}
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mt-6">
            <div>
              <label className="block text-sm mb-1 font-bold">Room Name</label>
              <input
                type="text"
                name="roomName"
                placeholder="VIP Single ROOM"
                value={formData.roomName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>

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

          {/* second row */}
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
                  value={
                    formData.bedSize === "N/A" ? "Queen bed" : formData.bedSize
                  }
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                />
              </div>
            </div>
            {/* beds */}
            <div>
              <label className="block text-sm mb-1 font-bold">Beds</label>
              <input
                type="text"
                name="beds"
                placeholder="2 beds"
                value={formData.beds}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>
            {/* baths */}
            <div>
              <label className="block text-sm mb-1 font-bold">Baths</label>
              <input
                type="text"
                name="baths"
                placeholder="2 baths"
                value={formData.baths}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              />
            </div>
            {/* price */}
            <div>
              <label className="block text-sm mb-1 font-bold">Price</label>
              <input
                type="text"
                name="price"
                placeholder="15,000Fr"
                value={formData.price}
                onChange={handleInputChange}
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
          {/* second row end */}
          <div className="grid grid-cols-4 gap-4">
            {/* Amenities */}
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
            </div>
            {/* status */}
            <div>
              <label className="block text-sm mb-1 font-bold">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
                >
                  <option>Available</option>
                  <option>Unavailable</option>
                  <option>One Left</option>
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
                name="suiteType"
                placeholder="Ground Floor"
                className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
              ></input>
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-bold">Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gray-200 mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>

          {/* Message */}
          {message && <p className="text-center text-sm">{message}</p>}
        </section>
      </div>
    </>
  );
};

export default UpdateRoomDetails;
