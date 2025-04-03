import React from "react";

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary:
    "bg-white text-primary-600 border border-primary-600 hover:bg-primary-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

export const Button = React.forwardRef(
  (
    { className = "", variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;

    const Comp = props.href ? "a" : "button";

    return (
      <Comp
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
