import { Pen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Events = ({
  events,
  error,
  onDelete,
}: {
  events: any[];
  error: any;
  onDelete: any;
}) => {
  return (
    <>
      <div className="text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs bg-white rounded-xl overflow-hidden">
            <thead className="text-[16px] text-[#00000080]">
              <tr>
                {[
                  "Title",
                  "Date & Time",
                  "Location",
                  "Description",
                  "Status",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="border border-gray-200 px-2 py-4 text-left"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {events.length > 0 ? (
                events.map((event, index: number) => (
                  <tr
                    key={index}
                    className="border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]"
                  >
                    <td className="border border-gray-200 px-3">
                      <span className=" rounded-full text-16 ">
                        {event.title || "N/A"}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {event.dateTime || "N/A"}
                    </td>

                    <td className="border border-gray-200 px-3 py-3">
                      {event.location.slice(0, 22) || "N/A"} <br />{" "}
                      {event.location.slice(23) || ""}
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {event.description.slice(0, 40) || "N/A"} <br />{" "}
                      {event.description.slice(41) || ""}
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {event.status || "N/A"}
                    </td>

                    <td className="border border-gray-300 px-2 py-1 w-[120px]">
                      <div className="flex items-center ml-2 space-x-2">
                        <Link to={`/dashboard/events/${event._id}`}>
                          <button
                            title="Edit"
                            className="text-black bg-gray-300 p-1 rounded-xs cursor-pointer"
                          >
                            <Pen size={16} />
                          </button>
                        </Link>

                        {/* <button
                          title="archive"
                          className=" bg-gray-300 p-1 rounded-xs"
                        >
                          <FolderX className="text-black" size={16} />
                        </button> */}

                        <button
                          onClick={() => onDelete(event._id)}
                          title="Delete"
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
                  {error ? (
                    <td colSpan={10} className="text-center py-4 text-gray-500">
                      {error}
                    </td>
                  ) : (
                    <td colSpan={10} className="text-center py-4 text-gray-500">
                      No Events found.
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Events;
