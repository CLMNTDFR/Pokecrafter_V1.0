import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dateParser } from "../Utils";
import LikeButton from "./LikeButton";
import CardComments from "./CardComments"; // Import du composant CardComments
import { updateArtwork, deleteArtwork } from "../../actions/artwork.actions";

const CardUser = ({ artwork }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [likersCount, setLikersCount] = useState(artwork.likers.length);
  const [showComments, setShowComments] = useState(false); // State pour afficher/masquer les commentaires
  const usersData = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();

  // Mise à jour de l'œuvre
  const updateItem = async () => {
    if (textUpdate) {
      dispatch(updateArtwork(artwork._id, textUpdate));
    }
    setIsUpdated(false);
  };

  // Suppression de l'œuvre
  const deleteArtworkHandler = () => {
    if (window.confirm("Do you really want to delete this artwork?")) {
      console.log("Attempting to delete artwork with ID:", artwork._id);
      dispatch(deleteArtwork(artwork._id));
    }
  };

  // Gérer l'affichage plein écran de l'image
  const handleImageClick = () => {
    setIsImageFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsImageFullScreen(false);
  };

  // Gérer le partage de l'URL de l'œuvre
  const handleShareClick = async () => {
    try {
      const shareUrl = new URL(artwork.picture, window.location.origin).href;
      await navigator.clipboard.writeText(shareUrl);

      const toast = document.getElementById("custom-toast");
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Charger les données des utilisateurs
  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setIsLoading(false);
    }
  }, [usersData]);

  const poster =
    artwork && artwork.posterId
      ? usersData.find((user) => String(user._id) === String(artwork.posterId))
      : null;

  return (
    <li className="card-container" key={artwork._id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="card-left"></div>
          <div className="card-right">
            <div className="card-header"></div>

            <img
              src={
                artwork?.picture
                  ? artwork.picture
                  : process.env.PUBLIC_URL +
                    "/img/uploads/profil/random-artwork.png"
              }
              alt={`${poster ? poster.username : "Unknown user"} - ${
                artwork?.title ? artwork.title : "Artwork"
              }`}
              className="card-pic"
              onClick={handleImageClick}
            />

            <p className="description">
              <br />
            </p>

            {/* Si l'utilisateur est l'auteur de l'œuvre, afficher les boutons d'édition et de suppression */}
            {usersData && poster && poster._id === artwork.posterId && (
              <div
                className="button-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                  marginTop: "-30px",
                  marginBottom: "10px",
                }}
              >
                <div
                  onClick={() => setIsUpdated(!isUpdated)}
                  className="edit-button"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="./img/icons/edit.svg"
                    alt="edit"
                    className="edit-icon"
                    style={{ width: "25px", height: "25px", marginRight: "5px" }}
                  />
                  <span>Edit</span>
                </div>

                <div
                  onClick={deleteArtworkHandler}
                  className="delete-button"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="./img/icons/trash.svg"
                    alt="delete"
                    className="delete-icon"
                    style={{ width: "25px", height: "25px", marginRight: "5px" }}
                  />
                  <span>Delete</span>
                </div>
              </div>
            )}

            <div style={{ color: "grey", marginBottom: "0.5em" }}>
              {artwork ? dateParser(artwork.createdAt) : ""}
            </div>

            {!isUpdated && (
              <p>
                {artwork?.description}
                <br />
                <br />
              </p>
            )}

            {/* Affichage du formulaire de modification */}
            {isUpdated && (
              <div className="update-post">
                <textarea
                  className="update-textarea"
                  defaultValue={artwork?.description}
                  onChange={(e) => setTextUpdate(e.target.value)}
                  style={{
                    width: "100%",
                    fontSize: "1em",
                    margin: "10px auto",
                    display: "block",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                ></textarea>
                <br />
                <div
                  className="button-container-validate"
                  style={{ textAlign: "center" }}
                >
                  <button className="btn-validate" onClick={updateItem}>
                    OK
                  </button>
                </div>
              </div>
            )}

            <div className="card-footer">
              <div className="comment-icon">
                {/* Icône pour afficher les commentaires */}
                <img
                  onClick={() => setShowComments(!showComments)}
                  src="/img/icons/message1.svg"
                  alt="comment"
                  style={{ cursor: "pointer" }}
                />
                <span>{artwork.comments.length}</span>
              </div>

              {/* Bouton Like */}
              <LikeButton
                artwork={artwork}
                likersCount={likersCount}
                setLikersCount={setLikersCount}
              />

              {/* Bouton de partage */}
              <img
                src="./img/icons/share.svg"
                alt="share"
                className="share-icon"
                onClick={handleShareClick}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            </div>

            {/* Affichage des commentaires si showComments est true */}
            {showComments && <CardComments artwork={artwork} />}
          </div>

          {/* Fullscreen image modal */}
          {isImageFullScreen && (
            <div className="fullscreen-modal" onClick={handleCloseFullScreen}>
              <img
                src={
                  artwork?.picture
                    ? artwork.picture
                    : process.env.PUBLIC_URL +
                      "/img/uploads/profil/random-artwork.png"
                }
                alt="Fullscreen artwork"
                className="fullscreen-image"
              />
            </div>
          )}
        </>
      )}

      {/* Notification pop-up */}
      <div id="custom-toast" className="toast">
        URL copied to clipboard
      </div>
    </li>
  );
};

export default CardUser;
