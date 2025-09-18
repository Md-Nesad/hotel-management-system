import React from "react";

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  className,
  required,
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`h-12 w-full px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-none focus:ring-1 focus:rounded-xl  focus:ring-gray-300 ${className}`}
      required={required}
    />
  );
};

export default Input;
