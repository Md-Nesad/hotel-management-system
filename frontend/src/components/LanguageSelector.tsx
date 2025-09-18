import React, { useState, useRef, useEffect } from "react";
// Optional: You can use your custom SVG too

const languages = [
  { code: "EN", label: "English" },
  { code: "FR", label: "French" },
  { code: "ES", label: "Spanish" },
  { code: "GER", label: "German" },
];

const LanguageSelector: React.FC = () => {
  const [selected, setSelected] = useState("EN");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setSelected(code);
    setOpen(false);
    // TODO: Hook into i18n / save to localStorage if needed
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1 text-sm text-black/70  cursor-pointer hover:bg-gray-100 transition z-48"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.06329 4.026C2.44323 1.62267 5.02979 0 7.99967 0C8.89696 0.000666667 9.75693 0.156 10.5622 0.429333C9.82492 0.904667 9.33294 1.72867 9.33294 2.66933V3.29C8.93429 2.69533 8.49231 2.13067 7.99967 1.608C7.14104 2.51933 6.41773 3.54933 5.85176 4.66667H9.33361V6H6.57173C6.3284 5.064 5.5931 4.33133 4.65514 4.09133C5.09579 3.194 5.63243 2.346 6.26641 1.57067C4.82847 1.96133 3.57385 2.822 2.68522 3.99933H1.33328C1.24062 3.99933 1.15329 4.01667 1.06329 4.026ZM15.9653 7.33333C15.984 7.554 15.9993 7.77467 16 8C16 12.418 12.4181 16 8.00033 16C4.77313 16 1.99858 14.0847 0.734636 11.332H2.15991C2.21057 11.3673 2.24724 11.392 2.29457 11.4253C3.18253 12.8993 4.60248 13.978 6.26574 14.4293C5.78176 13.8373 5.35778 13.2007 4.98513 12.5353C5.44577 12.4487 5.84776 12.206 6.14574 11.8667C6.66172 12.778 7.2797 13.6287 7.999 14.392C8.85763 13.4807 9.58093 12.4507 10.1469 11.3333H6.4924C6.60173 11.082 6.66439 10.806 6.66439 10.5147V10H10.6816C10.8329 9.522 10.9302 9.02933 10.9729 8.53133C11.1089 8.55933 11.2489 8.57533 11.3935 8.57533C11.7302 8.57533 11.9335 8.54733 12.3082 8.34267C12.2808 8.902 12.2088 9.458 12.0655 10H14.3567C14.6294 9.134 14.7161 8.22733 14.6267 7.33333H15.9653ZM13.7641 11.3333H11.6168C11.1362 12.4473 10.5036 13.4893 9.73626 14.4293C11.4342 13.9673 12.8808 12.8553 13.7641 11.3333ZM13.4208 6H15.9993V2.66667C15.9993 1.93133 15.4014 1.33333 14.6661 1.33333L11.9988 1.33467C11.2635 1.33467 10.6662 1.93333 10.6662 2.66867L10.6676 6.516C10.6676 6.92267 10.9869 7.24133 11.3942 7.24133C11.6315 7.24133 11.6388 7.24133 13.4208 6ZM5.33178 10.514L5.33311 6.66667C5.33311 5.93133 4.7358 5.33333 4.0005 5.33267H1.33328C0.597975 5.33267 0 5.92933 0 6.66467V9.998H2.57856C4.36049 11.2393 4.36782 11.2393 4.60514 11.2393C5.01246 11.2393 5.33178 10.9207 5.33178 10.514Z"
            fill="black"
            fillOpacity="0.5"
          />
        </svg>

        <span>{selected}</span>
        <svg
          className="w-3 h-3"
          viewBox="0 0 10 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 5L0 0H10L5 5Z" fill="black" fillOpacity="0.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute left-0 mt-2 w-32 bg-white shadow-md border border-gray-200 rounded text-sm z-50">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selected === lang.code
                  ? "font-medium text-black"
                  : "text-gray-700"
              }`}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
