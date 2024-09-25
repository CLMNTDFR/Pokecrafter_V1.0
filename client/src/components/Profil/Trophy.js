import React, { useState } from "react";

const Trophy = () => {
  const trophies = [
    { src: "/img/gold_trophy.svg", alt: "Gold Trophy, 1st place in a contest." },
    { src: "/img/silver_trophy.svg", alt: "Silver Trophy, 2nd place in a contest." },
    { src: "/img/bronze_trophy.svg", alt: "Bronze Trophy, 3rd place in a contest." },
    { src: "/img/black_trophy.svg", alt: "Black Trophy, Winner of an official contest." },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="trophy-container">
      {trophies.map((trophy, index) => (
        <div
          className="trophy"
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img src={trophy.src} alt={trophy.alt} />
          <div className="badge">x 0</div>
          {hoveredIndex === index && (
            <div className="trophy-popup-container">
              <div className="popup-description">{trophy.alt}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Trophy;
