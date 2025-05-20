import React from "react";

export default function FilterDropdown({ onFilterChange }) {
  return (
    <select onChange={(e) => onFilterChange(e.target.value)}>
      <option value="All">All</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  );
}
