import { NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";

const CheckStayButton = () => {
  return (
    <button className="flex items-center gap-2 px-4 py-3 bg-[#D3D3D3] hover:bg-[#F9862D]  hover:border-orange-500 rounded transition-colors cursor-pointer">
      {/* <Info className="w-5 h-5" /> */}
      <NotebookPen />
      <Link to="/check-stay">
        <span className="text-gray-800 font-medium hover:text-[#FFFFFF] transition-colors">
          Check Your Stay
        </span>
      </Link>
    </button>
  );
};

export default CheckStayButton;
