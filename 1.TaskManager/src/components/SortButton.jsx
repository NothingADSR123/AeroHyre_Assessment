import React from "react";

export default function SortButton({ onSortToggle }) {
  return <button onClick={onSortToggle}>Sort by Urgency</button>;
}
