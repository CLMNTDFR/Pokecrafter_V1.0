import React, { useState } from "react";

const FilterContest = ({ setSelectedContestType, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle contest selection (current or past)
  const handleContestTypeSelect = (contestType) => {
    setSelectedContestType(contestType);
    setIsOpen(false);
  };

  return (
    <nav className="dropdown">
      <label
        className={`dropdown-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Current or Past
        <span className="dropdown-icon">{isOpen ? "" : ""}</span>
      </label>

      <ul className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        {["Current Contests", "Past Contests"].map((contestType) => (
          <li key={contestType}>
            <button
              className="dropdown-item"
              onClick={() => handleContestTypeSelect(contestType)}
            >
              {contestType}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FilterContest;
