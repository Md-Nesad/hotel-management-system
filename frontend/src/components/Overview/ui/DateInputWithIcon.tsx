import { Field, useFormikContext } from "formik";
import { useRef } from "react";

interface DateInputWithIconProps {
  id: string;
  name: string;
  type?: "date" | "datetime-local";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const DateInputWithIcon = ({
  id,
  name,
  type = "date",
  value,
  onChange,
  disabled,
}: DateInputWithIconProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  let formikContext: any = null;
  try {
    formikContext = useFormikContext();
  } catch (e) {
    formikContext = null;
  }

  const handleIconClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <div className="relative">
      {formikContext ? (
        <Field
          innerRef={dateInputRef}
          id={id}
          name={name}
          type={type}
          className="block w-full p-2 pr-10 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          disabled={disabled}
        />
      ) : (
        <input
          ref={dateInputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="block w-full p-2 pr-10 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          disabled={disabled}
        />
      )}
      {/* Custom CSS to hide default date/datetime-local picker icon */}
      <style>{`
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            opacity: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          input[type="date"]::-webkit-inner-spin-button,
          input[type="date"]::-webkit-outer-spin-button,
          input[type="datetime-local"]::-webkit-inner-spin-button,
          input[type="datetime-local"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="date"],
          input[type="datetime-local"] {
            -moz-appearance: textfield;
          }
        `}</style>

      {/* Custom clickable icon */}
      <div
        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
        onClick={handleIconClick}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.501 4.63666C16.8369 4.63666 20.3653 8.17779 20.3553 12.5139C20.3453 16.84 16.8144 20.3611 12.491 20.3586C8.15762 20.3561 4.62671 16.8149 4.63674 12.4813C4.64677 8.15522 8.17517 4.63666 12.501 4.63666ZM11.7412 10.4876C11.7412 11.1421 11.7412 11.7967 11.7412 12.4537C11.7412 12.7346 11.834 12.9754 12.0772 13.1183C12.9575 13.6375 13.8427 14.1541 14.7354 14.6531C15.0765 14.8437 15.5028 14.6983 15.7034 14.3698C15.9291 13.9986 15.8088 13.5447 15.4075 13.3089C14.758 12.9252 14.1035 12.549 13.4465 12.1779C13.306 12.0976 13.2484 12.0123 13.2509 11.8443C13.2584 10.7609 13.2559 9.6775 13.2559 8.5941C13.2559 8.09754 12.9549 7.76148 12.5111 7.75647C12.0547 7.75145 11.7462 8.08751 11.7437 8.59661C11.7437 9.22609 11.7437 9.85556 11.7437 10.485L11.7412 10.4876Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M4.64854 4.82977C4.98458 4.82977 5.26796 4.82475 5.55133 4.82977C6.00523 4.83729 6.33626 5.15078 6.34378 5.5721C6.3513 5.99593 6.00523 6.33701 5.54632 6.33952C4.64854 6.34453 3.74826 6.34453 2.85049 6.33952C2.37151 6.33701 2.05804 6.02854 2.05553 5.55204C2.04801 4.64419 2.05051 3.73633 2.05553 2.83099C2.05804 2.38207 2.36147 2.06608 2.77776 2.05354C3.20909 2.041 3.53259 2.34696 3.56269 2.80089C3.57272 2.95136 3.56519 3.10434 3.56519 3.25482C3.56519 3.39526 3.56519 3.53821 3.56519 3.72881C3.65297 3.65608 3.70814 3.61345 3.75829 3.5658C5.79458 1.5946 8.21205 0.428433 11.0257 0.0898687C17.5258 -0.690083 23.5194 3.68617 24.7707 10.1289C26.0321 16.6168 21.9645 23.0144 15.5522 24.622C14.5868 24.8627 13.6062 24.9906 12.6132 24.9957C12.1016 24.9982 11.753 24.7022 11.743 24.2558C11.7329 23.7994 12.079 23.4934 12.6081 23.4834C17.5133 23.4057 21.7664 20.158 23.0579 15.5058C24.5676 10.0687 21.8642 4.50124 16.6556 2.3269C12.6483 0.651635 7.81081 1.61717 4.74885 4.70438C4.72628 4.72695 4.70622 4.75453 4.64603 4.82977H4.64854Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M1.17123 16.2858C0.747424 16.2883 0.413894 15.9698 0.40637 15.556C0.398847 15.1347 0.744917 14.776 1.1587 14.7811C1.56997 14.7861 1.91353 15.1246 1.91353 15.5309C1.91353 15.9472 1.5825 16.2833 1.17123 16.2858Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M4.19987 20.0501C4.62117 20.0501 4.94467 20.3812 4.94467 20.805C4.94467 21.2238 4.60362 21.5599 4.18984 21.5574C3.78108 21.5523 3.43501 21.2038 3.43751 20.795C3.44002 20.3787 3.78108 20.0476 4.19987 20.0501Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M1.15607 8.70948C1.57235 8.70697 1.90588 9.03299 1.91341 9.4493C1.92093 9.8631 1.56734 10.2167 1.14854 10.2142C0.744796 10.2142 0.40625 9.86561 0.40625 9.45181C0.40625 9.03801 0.734765 8.70948 1.15607 8.70697V8.70948Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M8.71094 23.8345C8.71094 23.4182 9.04698 23.0847 9.46577 23.0847C9.87203 23.0847 10.2156 23.4333 10.2156 23.8445C10.2156 24.2533 9.86952 24.5919 9.45323 24.5919C9.03945 24.5919 8.71094 24.2558 8.71094 23.832V23.8345Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M1.50968 12.5039C1.50717 12.9127 1.15609 13.2563 0.747323 13.2538C0.33856 13.2487 -0.00249401 12.9002 1.3742e-05 12.4889C0.00252149 12.0801 0.351099 11.7365 0.759862 11.7415C1.17113 11.744 1.51219 12.0926 1.50717 12.5014L1.50968 12.5039Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M3.07502 18.3723C3.07502 18.7936 2.74399 19.1197 2.32269 19.1171C1.90139 19.1146 1.56535 18.7761 1.57037 18.3648C1.57538 17.9485 1.91393 17.6174 2.33022 17.6174C2.75152 17.6174 3.07752 17.9485 3.07752 18.3698L3.07502 18.3723Z"
            fill="black"
            fillOpacity="0.5"
          />
          <path
            d="M6.6363 21.9185C7.0576 21.921 7.3811 22.252 7.37609 22.6759C7.37107 23.0947 7.03002 23.4307 6.61875 23.4232C6.20246 23.4182 5.87395 23.0771 5.87896 22.6583C5.88398 22.237 6.21249 21.9135 6.6363 21.916V21.9185Z"
            fill="black"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};
