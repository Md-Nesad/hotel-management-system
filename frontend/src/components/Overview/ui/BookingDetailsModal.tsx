import Input from '../../ui/Input';
import { DateInputWithIcon } from './DateInputWithIcon';

export default function BookingDetailsModal({
  open,
  onClose,
  booking,
}: {
  open: boolean;
  onClose: () => void;
  booking: any;
}) {
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-5xl mx-4 sm:mx-6 md:mx-8 lg:mx-auto shadow-lg relative animate-fade-in overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Title */}
        <div className="border-b border-gray-200 px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-700 text-center">Booking Details</h2>
        </div>

        {/* Form Content */}
        <form className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Guest Name" value={booking.guestName} />
            <SelectField
              label="Booking Method"
              value={booking.bookingMethod}
              options={['offline', 'online']}
            />
            <SelectField
              label="Room No/Type"
              value="Room 01 (Family Suite)"
              options={['Room 01 (Family Suite)', 'Room 02 (Family Suite)']}
            />
            <InputField label="No of Guest" value="4" />
            <DateInput label="Check in Date" id="checkInDate" />
            <DateInput label="Check out Date" id="checkOutDate" />
            <InputField
              label="Booking Date & Time"
              value="20 June, 2025 (Auto filed)"
            />
            <SelectField label="Payment Status" value="Paid" options={['Paid', 'Un paid']} />
            <SelectField
              label="Booking Status"
              value="Confirmed"
              options={['Confirmed', 'Reject']}
            />
            <SelectField
              label="Assigned By"
              value="Admin"
              options={['Admin', 'Modaretor']}
            />
            <div className="md:col-span-2">
              <InputField label="Special Note" value={booking.specialNote} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md font-medium hover:bg-orange-50 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 👇 Helper components for cleaner JSX
function InputField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <Input
        id={label.replace(/\s+/g, '').toLowerCase()}
        type="text"
        placeholder={label}
        value={value}
        onChange={() => {}}
        className=""
        required={false}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <select
        className="w-full p-2 rounded-md bg-gray-100 text-gray-500 "
        value={value}
        onChange={() => {}}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateInput({ label, id }: { label: string; id: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <DateInputWithIcon id={id} name={id} type="date" />
    </div>
  );
}
