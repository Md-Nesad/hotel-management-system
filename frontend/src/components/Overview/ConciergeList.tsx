import axios from "axios";
import { Pen, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConciergeModal from "../ConceirgeModel";

interface Concierge {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  phone: string;
  jobDescription: string;
  scheduleDay: string;
  specialNote: string;
  dutyStatus: string;
  address: string;
  salary: number;
  scheduleTime: string;
}

const ConciergeList: React.FC = () => {
  const [concierages, setConcierages] = useState<Concierge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConcierge, setSelectedConcierge] = useState<Concierge | null>(
    null
  );

  const openModal = (concierge: Concierge) => {
    setSelectedConcierge(concierge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConcierge(null);
  };

  useEffect(() => {
    const fetchConcierges = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch(
          "https://backend.bahamaslrb.com/api/concierges/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch concierges: ${response.status}`);
        }

        const data = await response.json();
        setConcierages(data?.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchConcierges();
  }, []);

  //handle search functionality
  const filteredConcierges = concierages.filter((emp) => {
    const search = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(search) ||
      emp.employeeId.toLowerCase().includes(search) ||
      emp.phone.includes(search)
    );
  });

  //handle delete functionality
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this concierge?"
    );
    if (!confirmed) return; // User canceled
    try {
      await axios.delete(
        `https://backend.bahamaslrb.com/api/concierges/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Concierge deleted successfully!");
      setConcierages(concierages.filter((concierge) => concierge._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-black">Error: {error}</div>;

  return (
    <div className="w-full mx-auto ">
      <div className=" flex justify-between items-center px-6 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-[0_0_3px_rgba(0,0,0,0.25)] mb-5">
        <h2 className="text-[24px] text-center border-gray-200 font-semibold text-gray-600">
          Concierge List
        </h2>

        <div className="sm:ml-auto sm:mr-10">
          <div className="relative w-[600px]">
            <input
              type="text"
              placeholder="Search by name, phone and employeeId"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
              <Search className="w-5 h-5" />
            </span>
          </div>
        </div>

        <Link
          to="/dashboard/addconcierge"
          className="add-button inline-block text-[#00000080] px-4 py-2 rounded-md border-2 border-gray-300 font-bold transition-colors bg-gray-300 hover:bg-[#F9862D] hover:text-white hover:border-[#F9862D]"
        >
          + Add New
        </Link>
      </div>
      {/* table area */}

      <div className="overflow-y-visible shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg">
        <table className="w-full text-sm border border-gray-300 border-collapse">
          <thead className="font-bold text-left text-[#00000080]">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 pl-3 rounded-tl-lg">
                Name
              </th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Employee ID</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Job Description</th>
              <th className="border border-gray-300 p-2">Salary</th>
              <th className="border border-gray-300 p-2">
                Schedule Day(s) <br /> and Time
              </th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody className=" text-[#00000066]">
            {filteredConcierges.length > 0 ? (
              filteredConcierges.map((concierge, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 text-base font-bold transition-colors "
                >
                  <td className="border text-base border-gray-300 py-2 px-2 text-[12px] w-[100px]">
                    {concierge.name.replace(/[0-9]/g, "")}
                  </td>
                  <td className="border text-base border-gray-300 py-2 px-2 text-[12px]">
                    {concierge.phone}
                  </td>
                  <td className="border text-base border-gray-300 py-2 px-2 text-[12px]">
                    {concierge.email}
                  </td>
                  <td className="border text-base  border-gray-300 py-2 px-2 text-[12px]">
                    {concierge.employeeId}
                  </td>
                  <td className="border text-base border-gray-300  px-2 py-2 w-[200px] text-[12px]">
                    {concierge.address || "No address provided"}
                  </td>

                  <td className="border border-gray-300 text-base px-2 py-2 text-[12px]">
                    {concierge.jobDescription.slice(0, 20)}
                  </td>

                  <td className="border border-gray-300 text-base px-2 py-2 text-[12px]">
                    {concierge?.salary === undefined
                      ? "N/A"
                      : concierge?.salary + "Fr"}
                  </td>

                  <td className="border border-gray-300 text-base px-2 py-2 text-[12px] w-[150px] relative ">
                    <button
                      onClick={() => openModal(concierge)}
                      className="bg-gray-300 px-2 py-1 rounded-xs relative z-10 cursor-pointer"
                    >
                      {isModalOpen ? "Hide" : "View"} details
                    </button>

                    <br />
                    <p className="ml-1 font-bold">{concierge?.scheduleTime}</p>
                  </td>

                  <td className="border border-gray-300 text-base px-2 py-2 text-[12px] w-[65px]">
                    {concierge?.dutyStatus.slice(0, 1).toLocaleUpperCase() +
                      concierge?.dutyStatus.slice(1)}
                  </td>

                  <td className="border border-gray-300 px-2 py-1 w-[120px]">
                    <div className="flex items-center ml-2 space-x-2">
                      <Link
                        title="Edit"
                        to={`/dashboard/updateConcierge/${concierge._id}`}
                        className="text-black bg-gray-300 p-1 rounded-xs"
                      >
                        <Pen size={16} />
                      </Link>
                      {/* <button
                        title="archive"
                        className=" bg-gray-300 p-1 rounded-xs"
                      >
                        <FolderX className="text-black" size={16} />
                      </button> */}

                      <button
                        title="Delete"
                        onClick={() => handleDelete(concierge?._id)}
                        className=" text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  No concierges found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConciergeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        concerge={selectedConcierge}
      />
    </div>
  );
};

export default ConciergeList;
