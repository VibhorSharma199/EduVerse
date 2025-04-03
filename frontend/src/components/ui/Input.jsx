import React from "react";

export const Input = React.forwardRef(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
