import React, { useState } from 'react';

const FilterButtons = ({ setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <nav className="dropdown">
      {/* Déclencheur du menu */}
      <label 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`} // Ajoutez la classe open ici
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Category 
        <span className="dropdown-icon">{isOpen ? '' : ''}</span> {/* Affiche le symbole approprié */}
      </label>

      {/* Menu déroulant */}
      <ul className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        {['All', 'AI', '3D', 'DigitalArt', 'Handcraft', 'Other'].map((category) => (
          <li key={category}>
            {/* Utilisation d'un bouton au lieu d'un lien */}
            <button
              className="dropdown-item"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FilterButtons;
