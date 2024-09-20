import React from "react";

const Trophy = () => {
  const trophies = [
    { src: "/img/gold_trophy.svg", alt: "Gold Trophy" },
    { src: "/img/silver_trophy.svg", alt: "Silver Trophy" },
    { src: "/img/bronze_trophy.svg", alt: "Bronze Trophy" },
    { src: "/img/black_trophy.svg", alt: "Black Trophy" },
  ];

  return (
    <div className="trophy-container">
      {trophies.map((trophy, index) => (
        <div className="trophy" key={index}>
            {trophy.alt}
            <br />
          <img src={trophy.src} alt={trophy.alt} />
          <div className="badge">x 0</div>
        </div>
      ))}
    </div>
  );
};

export default Trophy;
