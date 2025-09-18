import { useData } from "../../../context/DynamicContext";

export default function TopGuests() {
  const { booking } = useData();
  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full overflow-auto">
      <h3 className="text-gray-600 text-lg py-3 pl-3 font-semibold">
        Top Guests
      </h3>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-2 text-gray-600 font-semibold text-[13px] border-r border-gray-200 py-3">
              Guest Name
            </th>
            <th className="text-left px-2 text-gray-600 font-semibold text-[13px] border-r border-gray-200 py-3 w-[130px]">
              Total Booking
            </th>
            <th className="text-left px-2 text-gray-600 font-semibold text-[13px] py-3">
              Total Spent
            </th>
          </tr>
        </thead>
        <tbody>
          {booking.length > 0 ? (
            booking.map((guest: any, index: number) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="py-3 px-2 text-gray-900 text-[13px] border-r w-[100px] border-gray-200">
                  {guest.firstName} {guest.lastName}
                </td>
                <td className="py-3 px-2 text-gray-900 text-[13px] border-r border-gray-200">
                  01
                </td>
                <td className="py-3 px-2 text-gray-900 text-[13px] w-[100px]">
                  ${guest.room?.price.toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="py-3 px-2 text-gray-900 text-[12px] text-center"
              >
                No guests in the list.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
