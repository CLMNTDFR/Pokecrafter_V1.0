import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dateParser } from "../Utils";
import LikeButton from "./LikeButton";
import CardComments from "./CardComments";
import { updateArtwork, deleteArtwork } from "../../actions/artwork.actions";

const CardUser = ({ artwork }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [likersCount, setLikersCount] = useState(artwork.likers.length);
  const [showComments, setShowComments] = useState(false);
  const usersData = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();

  // Update artwork description
  const updateItem = async () => {
    if (textUpdate) {
      dispatch(updateArtwork(artwork._id, textUpdate));
    }
    setIsUpdated(false);
  };

  // Delete artwork handler with confirmation
  const deleteArtworkHandler = () => {
    if (window.confirm("Do you really want to delete this artwork?")) {
      dispatch(deleteArtwork(artwork._id));
    }
  };

  // Handle image click to open in fullscreen
  const handleImageClick = () => {
    setIsImageFullScreen(true);
  };

  // Handle closing the fullscreen image view
  const handleCloseFullScreen = () => {
    setIsImageFullScreen(false);
  };

  // Copy artwork URL to clipboard
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

  // Set loading state to false once usersData is available
  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setIsLoading(false);
    }
  }, [usersData]);

  // Find the user who posted the artwork
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
                    src="./img/icons/pokecrafter-edit.svg"
                    alt="edit"
                    className="edit-icon"
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "5px",
                    }}
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
                    src="./img/icons/pokecrafter-trash.svg"
                    alt="delete"
                    className="delete-icon"
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "5px",
                    }}
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
                <br />
              </div>
            )}

            <div className="card-footer">
              <div className="comment-icon">
                <img
                  onClick={() => setShowComments(!showComments)}
                  src="/img/icons/pokecrafter-message1.svg"
                  alt="comment"
                  style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            </div>

            {showComments && <CardComments artwork={artwork} />}
          </div>

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

      <div id="custom-toast" className="toast">
        URL copied to clipboard
      </div>
    </li>
  );
};

export default CardUser;
