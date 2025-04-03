import React from "react";

const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3
      className={`text-xl font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className = "", children, ...props }) => {
  return (
    <p className={`mt-2 text-gray-600 ${className}`} {...props}>
      {children}
    </p>
  );
};

const CardFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Footer = CardFooter;

export { Card };
