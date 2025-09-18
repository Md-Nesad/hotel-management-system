import { Trash2 } from "lucide-react";
import { useState } from "react";
import { FaLock, FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ cardNumber, expDate, name });
  };

  return (
    <section className="my-20 px-4 md:px-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Section */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black">Payment</h2>
            <div className="flex gap-2 text-2xl text-black">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcAmex />
            </div>
          </div>
          <div className="p-5 border border-black rounded-md shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="radio" checked readOnly />
                  <p className="font-semibold text-black">
                    Credit / Debit Card
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium border border-black px-2 py-1 rounded-md text-black">
                  <FaLock />
                  SECURE
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Card number *"
                  className="flex-1 p-2 border border-black rounded text-sm text-black placeholder-gray-700"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <input
                  type="text"
                  required
                  placeholder="Expiration date *"
                  className="w-full sm:w-1/3 p-2 border border-black rounded text-sm text-black placeholder-gray-700"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                />
              </div>

              <input
                type="text"
                required
                placeholder="Name on card *"
                className="w-full p-2 border border-black rounded text-sm text-black placeholder-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>

        {/* Room & Charges Section */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Room</h2>
            <button className="py-1 px-3 text-sm border border-black rounded-lg text-black font-semibold hover:bg-gray-100 transition">
              + Add another room
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
              <div>
                <h3 className="font-medium text-black">
                  1 King Bed, 1 Room Suite
                </h3>
                <p className="text-sm text-black">No smoking, 1 adult</p>
              </div>
              <div className="text-right">
                <Trash2 className="mx-auto mb-2 text-black cursor-pointer" />
                <h4 className="text-black text-sm mb-1">12% off</h4>
                <div className="flex items-center gap-2 justify-end">
                  <span className="line-through text-black text-sm">$100</span>
                  <h5 className="text-lg font-semibold text-black">$88</h5>
                </div>
                <p className="text-xs text-black underline">Avg/night</p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-black mb-2">
                Summary of charges
              </h3>
              <div className="flex justify-between text-sm text-black mb-2">
                <span>Room 1</span>
                <span>$88.35 x 1 night</span>
              </div>
              <div className="flex justify-between text-sm text-black mb-2">
                <span>Estimated taxes</span>
                <span>$14.58</span>
              </div>
              <div className="border-t border-black my-3" />
              <div className="flex justify-between font-semibold text-black">
                <span>Total (USD)</span>
                <span>$102.93</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mt-2">
              <span className="bg-gray-300 px-2 py-1 rounded font-semibold text-black">
                123x OFF
              </span>
              <span className="line-through text-black">$100</span>
              <span className="font-semibold text-black">$88.00</span>
            </div>

            <div className="text-black text-sm font-medium">
              You've saved $11!
            </div>

            <div className="text-xs text-black bg-gray-100 px-3 py-2 rounded text-center">
              No cancellations, charges, or refunds.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
