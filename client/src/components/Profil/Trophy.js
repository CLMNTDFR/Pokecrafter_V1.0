import React, { useState } from "react";
import { useSelector } from "react-redux";

const Trophy = () => {
  const userData = useSelector((state) => state.userReducer);
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

  const userTrophies = userData.trophies || [];

  return (
    <div className="trophy-container">
      {trophies.map((trophy, index) => {
        const trophyCount = userTrophies.filter(
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
