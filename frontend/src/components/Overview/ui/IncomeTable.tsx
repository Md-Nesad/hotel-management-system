// IncomeTable.tsx

export default function IncomeTable() {
  return (
    <div className="w-full mx-auto mt-2 rounded-lg shadow-md overflow-hidden">
      <div className="w-full bg-[#F9862D] pl-7 py-3 text-white">INCOME</div>
      {/* Header Row */}
      <div className="bg-[#FFFFFF]  text-[#000000a7] text-sm font-semibold flex">
        <div className="w-[14.28%] border-r border-gray-300 px-2 py-3 text-center">
          GROSS INCOME
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          CASH
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          CARD
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          MOMO
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          CHECK
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          CONCIERGE
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          PROFIT
        </div>
        <div className="w-[12.28%] border-r border-gray-300 px-2 py-3 text-center">
          BLRB EXPENSES
        </div>
      </div>

      {/* Data Row */}
      <div className="flex text-sm font-medium">
        <div className="w-[14.28%] bg-[#EDEDED] px-2 py-3 text-center">0%</div>
        <div className="w-[12.28%] bg-[#2B2B2B] text-white px-2 py-3 text-center">
          0%
        </div>
        <div className="w-[12.28%] bg-[#845ADF] text-white px-2 py-3 text-center">
          0%
        </div>
        <div className="w-[12.28%] bg-[#2ED47A] text-white px-2 py-3 text-center">
          0%
        </div>
        <div className="w-[12.28%] bg-[#0099FF] text-white px-2 py-3 text-center">
          0%
        </div>
        <div className="w-[12.28%] bg-[#FEC100] text-white px-2 py-3 text-center">
          0%
        </div>
        <div className="w-[12.28%] bg-[#F9862D] text-white px-2 py-3 text-center">
          0%
        </div>
        <div className="w-[12.28%] bg-[#4D6472] text-white px-2 py-3 text-center">
          0%
        </div>
      </div>
    </div>
  );
}
