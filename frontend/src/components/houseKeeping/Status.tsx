import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const statusOptions = ["Clean", "Dirty", "OnHold"];

export default function StatusCell({ keeper }: { keeper: any }) {
  const [status, setStatus] = useState(keeper.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    // Optional: Call backend update function here
    // updateStatus(keeper.id, e.target.value);
  };

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleStatusChange}
        className="w-full pr-10 pl-2 py-2 border border-gray-100 rounded focus:outline-none focus:border-transparent transition appearance-none"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown
        size={16}
        className="absolute right-4 top-2 pointer-events-none"
      />
    </div>
  );
}
