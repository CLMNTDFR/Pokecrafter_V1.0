import React, { useState } from "react";

const FilterButtons = ({ setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <nav className="dropdown">
      <label
        className={`dropdown-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Category
        <span className="dropdown-icon">{isOpen ? "" : ""}</span>
      </label>

      <ul className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        {["All", "AI", "3D", "DigitalArt", "Handcraft", "Other"].map(
          (category) => (
            <li key={category}>
              <button
                className="dropdown-item"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default FilterButtons;
