import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dateParser } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import LikeButton from "./LikeButton";

const Card = ({ artwork }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false); // État pour le pop-up de partage
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setIsLoading(false);
    }
  }, [usersData]);

  const poster = artwork && artwork.posterId 
    ? usersData.find((user) => String(user._id) === String(artwork.posterId)) 
    : null;

  const handleImageClick = () => {
    setIsImageFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsImageFullScreen(false);
  };

  // Gestion du pop-up de partage
  const handleShareClick = () => {
    setIsSharePopupOpen(true); // Ouvre le pop-up de partage
  };

  const handleCloseSharePopup = () => {
    setIsSharePopupOpen(false); // Ferme le pop-up de partage
  };

  // URLs de partage pour les réseaux sociaux
  const shareUrl = window.location.href; // URL actuelle de la page ou du post
  const twitterShareUrl = `https://twitter.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(artwork.title)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <li className="card-container" key={artwork?._id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="card-left">
            <img
              src={poster && poster.picture 
                ? poster.picture 
                : process.env.PUBLIC_URL + "/img/uploads/profil/random-user.png"}
              alt={poster ? `Photo de profil de ${poster.username}` : "Photo de profil par défaut"}
            />
          </div>
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h4>{poster ? poster.username : "Utilisateur inconnu"}</h4>
                {artwork && artwork.posterId !== userData._id && (
                  <FollowHandler idToFollow={artwork.posterId} type={"card"} />
                )}
              </div>
              <span className="publication-date">{artwork ? dateParser(artwork.createdAt) : ""}</span>
            </div>

            <img 
              src={artwork?.picture ? artwork.picture : process.env.PUBLIC_URL + "/img/uploads/profil/random-artwork.png"}
              alt={`${poster ? poster.username : "Utilisateur inconnu"} - ${artwork?.title ? artwork.title : "Artwork"}`}
              className="card-pic"
              onClick={handleImageClick} 
            />

            <p className="description">{artwork?.description}</p>

            <div className="card-footer">
              <div className="comment-icon">
                <img src="/img/icons/message1.svg" alt="comment" />
                <span>{artwork.comments.length}</span>
              </div>

              <LikeButton artwork={artwork} />

              {/* Bouton de partage */}
              <img 
                src="./img/icons/share.svg" 
                alt="share" 
                onClick={handleShareClick} 
                style={{ cursor: "pointer" }} 
              />
            </div>
          </div>

          {/* Fullscreen image modal */}
          {isImageFullScreen && (
            <div className="fullscreen-modal" onClick={handleCloseFullScreen}>
              <img 
                src={artwork?.picture ? artwork.picture : process.env.PUBLIC_URL + "/img/uploads/profil/random-artwork.png"} 
                alt="Fullscreen artwork" 
                className="fullscreen-image"
              />
            </div>
          )}

          {/* Share popup */}
          {isSharePopupOpen && (
            <div className="popupwindowshare" onClick={handleCloseSharePopup}>
              <div className="popupwindowshare-content" onClick={(e) => e.stopPropagation()}>
                <span className="popupwindowshare-cross" onClick={handleCloseSharePopup}>×</span>
                <h3>Share this artwork</h3>
                <ul className="popupwindowshare-options">
                  <li className="popupwindowshare-icons">
                    <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                      <img src="/img/icons/facebook.svg" alt="Facebook" style={{ width: '50px', height: '50px' }} />
                    </a>
                  </li>
                  <li className="popupwindowshare-icons">
                    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                      <img src="/img/icons/twitter.svg" alt="Twitter" style={{ width: '50px', height: '50px' }} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default Card;
