import React from "react";

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
    <Icon className="text-blue-500 mr-4" size={24} />
    <div>
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;
