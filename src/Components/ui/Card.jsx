// filepath: /d:/Belajar Web/front-end/src/components/ui/Card.jsx
import React from "react";

export const Card = ({ children, className }) => {
  return <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>;
};

export const CardHeader = ({ children, className }) => {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
