import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dateParser } from "../Utils";
import LikeButton from "./LikeButton";
import CardComments from "./CardComments";

const Card = ({ artwork }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [likersCount, setLikersCount] = useState(artwork.likers.length);
  const [showComments, setShowComments] = useState(false);
  const usersData = useSelector((state) => state.usersReducer);

  // Set loading state to false once usersData is available
  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setIsLoading(false);
    }
  }, [usersData]);

  // Find the poster of the artwork from the usersData using the posterId
  const poster = artwork && artwork.posterId
    ? usersData.find((user) => String(user._id) === String(artwork.posterId))
    : null;

  // Handle the click event on the image to open it in fullscreen mode
  const handleImageClick = () => {
    setIsImageFullScreen(true);
  };

  // Handle the click event to close the fullscreen image
  const handleCloseFullScreen = () => {
    setIsImageFullScreen(false);
  };

  // Handle the click event to share the artwork URL
  const handleShareClick = async () => {
    try {
      const shareUrl = new URL(artwork.picture, window.location.origin).href;
      await navigator.clipboard.writeText(shareUrl);

      const toast = document.getElementById("custom-toast");
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    } catch (err) {}
  };

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
                : `${process.env.PUBLIC_URL}/img/uploads/profil/random-user.png`}
              alt={poster ? `Profile picture of ${poster.username}` : "Default user picture"}
            />
          </div>
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h4>{poster ? poster.username : "Unknown user"}</h4>
              </div>
              <span className="publication-date">
                {artwork ? dateParser(artwork.createdAt) : ""}
              </span>
              <br />
            </div>

            <img
              src={artwork?.picture
                ? artwork.picture
                : `${process.env.PUBLIC_URL}/img/uploads/profil/random-artwork.png`}
              alt={`${poster ? poster.username : "Unknown user"} - ${artwork?.title || "Artwork"}`}
              className="card-pic"
              onClick={handleImageClick}
            />

            <p className="description">
              {artwork?.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br /><br />
                </span>
              ))}
            </p>

            <div className="card-footer">
              <div className="comment-icon">
                <img
                  onClick={() => setShowComments(!showComments)}
                  src="/img/icons/pokecrafter-message1.svg"
                  alt="comment"
                />
                <span>{artwork.comments.length}</span>
              </div>

              <LikeButton
                artwork={artwork}
                likersCount={likersCount}
                setLikersCount={setLikersCount}
              />

              <img
                src="./img/icons/pokecrafter-share.svg"
                alt="share"
                className="share-icon"
                onClick={handleShareClick}
              />
            </div>
            {showComments && <CardComments artwork={artwork} />}
          </div>

          {isImageFullScreen && (
            <div className="fullscreen-modal" onClick={handleCloseFullScreen}>
              <img
                src={artwork?.picture
                  ? artwork.picture
                  : `${process.env.PUBLIC_URL}/img/uploads/profil/random-artwork.png`}
                alt="Fullscreen artwork"
                className="fullscreen-image"
              />
            </div>
          )}
        </>
      )}

      <div id="custom-toast" className="toast">
        URL copied to clipboard
      </div>
    </li>
  );
};

export default Card;
