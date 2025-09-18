// import React, { useEffect, useState } from "react";
// import axios from "axios";

import { NotepadText, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import StatusCell from "./Status";

const OnHold = ({
  houseKeeper,
  onDelete,
  onRefresh,
}: {
  houseKeeper: any[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) => {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  return (
    <>
      <div className="text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl">
        <div>
          <table className="min-w-full border border-gray-300 text-xs bg-white rounded-xl overflow-y-visible">
            <thead className="text-[15px] text-[#00000080]">
              <tr>
                {[
                  "Cleaning Status",
                  "Room No/Bed Size",
                  "Room Name",
                  "Beds/Baths",

                  "Notes",
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
            <tbody className="text-[13px]">
              {houseKeeper.length > 0 ? (
                houseKeeper.map((keeper, index: number) => (
                  <tr
                    key={index}
                    className="border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]"
                  >
                    <td className="border border-gray-200 px-3 py-3">
                      <StatusCell keeper={keeper} />
                    </td>

                    <td className="border border-gray-200 px-3">
                      <span className=" rounded-full text-16 ">
                        {keeper.room?.bed_size || "Queen Bed"}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {keeper.room?.name || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {keeper.room?.baths && keeper.room?.beds !== null
                        ? `${keeper.room?.beds} Beds, ${keeper.room?.baths} Baths`
                        : "N/A"}
                    </td>

                    <td className="border border-gray-200 px-3 py-3">
                      {keeper.notes || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-3 py-6 w-fit">
                      <div className="relative flex items-center space-x-2">
                        {/* Edit Button */}
                        <button
                          title="change notes and status"
                          onClick={() =>
                            setActiveModalId((prevId) =>
                              prevId === keeper._id ? null : keeper._id
                            )
                          }
                          className="text-black bg-gray-300 p-1 rounded-xs cursor-pointer"
                        >
                          <NotepadText size={16} />
                        </button>

                        {/* Modal */}
                        {activeModalId === keeper._id && (
                          <div className="absolute top-full right-23 mt-2 z-50 bg-white border border-gray-300 shadow-lg p-2 rounded-md w-60">
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                  setSubmitting(true);
                                  const token = localStorage.getItem("token");
                                  await axios.patch(
                                    `https://backend.bahamaslrb.com/housekeeping/${keeper._id}`,
                                    {
                                      houseKeeperName: "Nesad",
                                      notes:
                                        notes || "Room is ready for next guest",
                                      room: keeper?.room._id,
                                      status: status,
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  alert("Submitted successfully!");
                                  setNotes("");
                                  setStatus("");
                                  setSubmitting(false);
                                  setActiveModalId(null);
                                  onRefresh();
                                } catch (err) {
                                  alert("Failed to submit");
                                  setSubmitting(false);
                                }
                              }}
                            >
                              <strong className="text-[12px]">
                                Change status
                              </strong>{" "}
                              <br />
                              <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full pl-2 py-2 border border-gray-600 rounded mt-1"
                              >
                                <option value="">Change Status</option>
                                <option value="Clean">Clean</option>
                                <option value="Dirty">Dirty</option>
                                <option value="OnHold">On Hold</option>
                              </select>
                              <textarea
                                placeholder="Update Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-1 w-full rounded mt-2 text-sm"
                              />
                              <button
                                type="submit"
                                className="text-white cursor-pointer text-xs px-2 py-1 rounded w-full transition-colors duration-150 bg-blue-500 hover:bg-[#F9862D] mt-2"
                              >
                                {submitting ? "Submitting..." : "Submit"}
                              </button>
                            </form>
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(keeper._id)}
                          title="delete"
                          className="text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs cursor-pointer"
                        >
                          <X size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    Nothing on Hold
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OnHold;
