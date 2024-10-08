import React, { useState } from "react";

const Trophy = ({ userTrophies }) => {
  const trophies = [
    {
      type: "gold-trophy",
      src: "/img/gold_trophy.svg",
      alt: "Gold Trophy, 1st place in a contest.",
    },
    {
      type: "silver-trophy",
      src: "/img/silver_trophy.svg",
      alt: "Silver Trophy, 2nd place in a contest.",
    },
    {
      type: "bronze-trophy",
      src: "/img/bronze_trophy.svg",
      alt: "Bronze Trophy, 3rd place in a contest.",
    },
    {
      type: "black-trophy",
      src: "/img/black_trophy.svg",
      alt: "Black Trophy, Winner of an official contest.",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Utiliser les trophées de l'utilisateur si fournis, sinon utiliser un tableau vide par défaut
  const trophiesToDisplay = userTrophies || [];

  return (
    <div className="trophy-container">
      {trophies.map((trophy, index) => {
        // Compter les trophées de l'utilisateur correspondant au type de trophée
        const trophyCount = trophiesToDisplay.filter(
          (userTrophy) => userTrophy.type === trophy.type
        ).length;

        return (
          <div
            className="trophy"
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={trophy.src} alt={trophy.alt} />
            <div className="badge">x {trophyCount}</div>
            {hoveredIndex === index && (
              <div className="trophy-popup-container">
                <div className="popup-description">{trophy.alt}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Trophy;
