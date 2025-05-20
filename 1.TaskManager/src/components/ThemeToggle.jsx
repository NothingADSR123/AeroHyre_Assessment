import React from "react";

export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button onClick={onToggle} className="theme-toggle">
      {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
