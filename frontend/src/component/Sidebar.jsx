import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Profile", path: "/dashboard/profile", icon: "👤" },
    { name: "Product", path: "/dashboard/product", icon: "📦" },
    { name: "Order", path: "/dashboard/order", icon: "🛒" },
    { name: "History", path: "/dashboard/history", icon: "📜" },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition ${
              location.pathname === item.path ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : ""
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
