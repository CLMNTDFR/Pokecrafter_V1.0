import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArtworks } from '../actions/artwork.actions';
import Card from './Artwork/Card';

const Thread = ({ selectedCategory }) => {
    const [loadArtwork, setLoadArtwork] = useState(true);
    const [count, setCount] = useState(20);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArtwork, setSelectedArtwork] = useState(null); // État pour l'artwork sélectionné
    const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour gérer l'ouverture du pop-up

    const dispatch = useDispatch();
    const artworks = useSelector((state) => state.artworkReducer);

    useEffect(() => {
        const loadMore = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 > document.documentElement.offsetHeight
            ) {
                setLoadArtwork(true);
                setCount((prevCount) => prevCount + 15); // Utilisation d'une fonction dans setCount pour garantir une mise à jour correcte
            }
        };

        if (loadArtwork) {
            dispatch(getArtworks(count));
            setLoadArtwork(false);
        }

        window.addEventListener("scroll", loadMore);
        return () => window.removeEventListener("scroll", loadMore);
    }, [loadArtwork, count, dispatch]);

    useEffect(() => {
        if (artworks.length > 0) {
            setIsLoading(false);
        }
    }, [artworks]);

    const filteredArtworks = selectedCategory === "All" 
        ? artworks 
        : artworks.filter(artwork => artwork.category === selectedCategory);

    const handleArtworkClick = (artwork) => {
        setSelectedArtwork(artwork);
        setIsPopupOpen(true); // Ouvrir le pop-up
    };

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
                    {filteredArtworks && filteredArtworks.length > 0 ? (
                        filteredArtworks.map((artwork) => (
                            <li key={artwork._id} onClick={() => handleArtworkClick(artwork)}> {/* Ouvrir le pop-up sur click */}
                                <img
                                    src={artwork?.picture ? artwork.picture : process.env.PUBLIC_URL + "/img/uploads/profil/random-artwork.png"}
                                    alt={`${artwork?.title ? artwork.title : "Artwork"}`}
                                    className="artwork-img"
                                />
                            </li>
                        ))
                    ) : (
                        <li>No artwork available in this category</li>
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

export default Thread;
