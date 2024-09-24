import React from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Trophy = () => {
  const trophies = [
    { src: "/img/gold_trophy.svg", alt: "Gold Trophy, 1st place in a contest." },
    { src: "/img/silver_trophy.svg", alt: "Silver Trophy, 2nd place in a contest." },
    { src: "/img/bronze_trophy.svg", alt: "Bronze Trophy, 3rd place in a contest." },
    { src: "/img/black_trophy.svg", alt: "Black Trophy, Winner of an official contest." },
  ];

  return (
    <div className="trophy-container">
      {trophies.map((trophy, index) => (
        <div className="trophy" key={index}>
          <Popup
            trigger={<img src={trophy.src} alt={trophy.alt} />}
            position={["bottom center", "bottom right", "bottom left"]}
            closeOnDocumentClick
          >
            <div>{trophy.alt}</div>
          </Popup>
          <div className="badge">x 0</div>
        </div>
      ))}
    </div>
  );
};

export default Trophy;

