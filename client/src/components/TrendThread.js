import React, { useEffect, useState } from 'react';
import Card from './Artwork/Card'; // Le composant Card pour afficher les détails des artworks

const TrendThread = ({ artworks }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null); // État pour l'artwork sélectionné
  const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour gérer l'ouverture du pop-up

  // Met à jour l'état du chargement lorsque les artworks sont disponibles
  useEffect(() => {
    if (artworks.length > 0) {
      setIsLoading(false);
    }
  }, [artworks]);

  // Ouvre le pop-up avec l'œuvre sélectionnée
  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsPopupOpen(true); // Ouvrir le pop-up
  };

  // Ferme le pop-up
  const closePopup = () => {
    setIsPopupOpen(false); // Fermer le pop-up
    setSelectedArtwork(null); // Réinitialiser l'artwork sélectionné
  };

  return (
    <div className="thread-container">
      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      ) : (
        <ul className="artwork-grid">
          {artworks && artworks.length > 0 ? (
            artworks.map((artwork) => (
              <li key={artwork._id} onClick={() => handleArtworkClick(artwork)}>
                <img
                  src={artwork?.picture ? artwork.picture : process.env.PUBLIC_URL + "/img/uploads/profil/random-artwork.png"}
                  alt={`${artwork?.title ? artwork.title : "Artwork"}`}
                  className="artwork-img"
                />
              </li>
            ))
          ) : (
            <li>No trending artwork available</li>
          )}
        </ul>
      )}

      {/* Pop-up pour afficher les détails de l'œuvre */}
      {isPopupOpen && selectedArtwork && (
        <div className="popup-overlay" onClick={closePopup}> {/* Ferme le pop-up en cliquant sur le fond */}
          <div className="popup-content" onClick={(e) => e.stopPropagation()}> {/* Empêche la fermeture en cliquant sur le contenu */}
            <button onClick={closePopup} className="close-button">×</button> {/* Bouton pour fermer le pop-up */}
            <Card artwork={selectedArtwork} /> {/* Passer l'artwork sélectionné au composant Card */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendThread;
