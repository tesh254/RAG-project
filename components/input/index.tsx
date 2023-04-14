import React, { ForwardedRef, LegacyRef, forwardRef } from "react";

interface IInputProps {
  value?: string | number;
  onChange?: (name: string, value: string | number) => void;
  theme?: "light" | "dark";
  labelClassname?: string;
  inputClassname?: string;
  name?: string;
  label?: string;
  placeholder: string;
  type: string;
}

type InputRef = LegacyRef<HTMLInputElement> | undefined;

const Input = forwardRef<InputRef, IInputProps>(
  (
    {
      value,
      onChange,
      theme = "light",
      labelClassname = "",
      inputClassname = "",
      label = "",
      placeholder,
      name,
      type,
    },
    ref
  ) => {
    const localLabelClassname =
      theme === "light"
        ? "text-suportal-gray-dark"
        : theme === "dark"
        ? "text-white"
        : "";
    const localInputClassname =
      theme === "light"
        ? ""
        : theme === "dark"
        ? "bg-transparent placeholder:text-suportal-gray-dark text-suportal-gray-dark"
        : "";

    return (
      <div className="base-input__container">
        {label && (
          <label
            className={`base-label ${localLabelClassname} ${labelClassname}`}
          >
            {label}
          </label>
        )}
        <input
          className={`base-input ${localInputClassname} ${inputClassname}`}
          ref={ref as InputRef}
          placeholder={placeholder ?? ""}
          name={name}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.name, e.target.value);
            }
          }}
          type={type}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
