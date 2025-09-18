import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

const BedInputDropdown = () => {
  const [selectedBed, setSelectedBed] = React.useState("Select here");

  const options = [
    { label: "All room book", value: "all_room_book" },
    { label: "Two Bed", value: "two_bed" },
    { label: "Single Bed", value: "single_bed" },
  ];

  const getLabel = (val: string) =>
    options.find((opt) => opt.value === val)?.label || "Select here";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="w-full px-3 py-3 text-left border rounded-xl text-gray-400 bg-white flex items-center justify-between hover:border-gray-400 cursor-pointer"
        >
          <span>{getLabel(selectedBed)}</span>
          <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-gray-200 shadow-md rounded-md p-1 min-w-[225px] z-50 text-gray-700"
          sideOffset={4}
          side="bottom"
          align="end"
        >
          {options.map((opt) => (
            <DropdownMenu.CheckboxItem
              key={opt.value}
              checked={selectedBed === opt.value}
              onCheckedChange={() => setSelectedBed(opt.value)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded cursor-pointer"
            >
              <DropdownMenu.ItemIndicator>
                <CheckIcon />
              </DropdownMenu.ItemIndicator>
              {opt.label}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default BedInputDropdown;
