"use client";

import { useState } from "react";

export function SortFilter() {
  const [sortBy, setSortBy] = useState("popular");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { id: "popular", label: "Popular" },
    { id: "newest", label: "Newest" },
    { id: "name-asc", label: "Name (A-Z)" },
    { id: "name-desc", label: "Name (Z-A)" },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortChange = (id) => {
    setSortBy(id);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative w-full max-w-xs">
      {/* Dropdown Button */}
      <button
        className="w-full flex items-center justify-between bg-black text-white border border-gray-700 py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
        onClick={toggleDropdown}
      >
        <span className="text-lg font-medium">
          Sort By: {sortOptions.find((option) => option.id === sortBy)?.label}
        </span>
        <span className="ml-4 text-sm transform transition-transform duration-300">
          {isDropdownOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown Options */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full bg-black border border-gray-700 rounded-lg shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              className={`w-full text-left px-6 py-2 text-lg hover:bg-gray-800 ${
                sortBy === option.id ? "text-white font-semibold" : "text-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
