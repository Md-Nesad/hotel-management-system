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
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  concerge: Concierge | null;
};

const ConciergeModal = ({ isOpen, onClose, concerge }: ModalProps) => {
  if (!isOpen || !concerge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] p-5 relative flex flex-col">
        <h2 className="text-center text-2xl font-bold text-black mb-4">
          Concierge Details
        </h2>
        <div className="flex-grow overflow-y-auto space-y-3 text-sm text-gray-700">
          {/* Guest Name */}
          <p>
            <strong>Name: </strong>
            {concerge.name.replace(/[0-9]/g, "")}
          </p>

          <p>
            <strong>Phone:</strong> {concerge.phone}
          </p>
          <p>
            <strong>Email:</strong> {concerge.email || "N/A"}
          </p>
          <p>
            <strong>Employee ID:</strong> {concerge.employeeId}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {concerge.address || "No address provided"}
          </p>

          <p>
            <strong>Job Description:</strong>{" "}
            {concerge.jobDescription.slice(0, 20)}
          </p>

          <p>
            <strong>Salary:</strong>{" "}
            {concerge?.salary === undefined ? "N/A" : concerge?.salary + "Fr"}
          </p>

          <p>
            <strong>Schedule Day(s): </strong> {concerge?.scheduleDay || "N/A"}
          </p>

          <p>
            <strong>Schedule Time(s): </strong>{" "}
            {concerge?.scheduleTime || "N/A"}
          </p>

          <p>
            <strong>Status:</strong> {concerge?.dutyStatus}
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-4 flex justify-center shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConciergeModal;
