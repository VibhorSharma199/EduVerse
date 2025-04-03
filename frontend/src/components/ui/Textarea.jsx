import React from "react";

export const Textarea = React.forwardRef(
  ({ className = "", rows = 4, ...props }, ref) => {
    return (
      <textarea
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
