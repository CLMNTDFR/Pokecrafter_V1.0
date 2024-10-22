import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContests, deleteContest } from "../../actions/contest.actions";
import {
  getArtworksContest,
  addArtworkContest,
  deleteContestArtwork,
} from "../../actions/artwork.contest.actions";
import { isEmpty } from "../Utils";
import LikeArtworkContestButton from "./LikeArtworkContestButton";

const ContestDisplay = ({ selectedContestType }) => {
  const dispatch = useDispatch();
  const contests = useSelector((state) => state.contestReducer.contests);
  const artworksContest = useSelector((state) => state.artworkContestReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);

  const [visibleContests, setVisibleContests] = useState(1);
  const [loadContests, setLoadContests] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [likersCountByArtwork, setLikersCountByArtwork] = useState({});
  const [showFullDescription, setShowFullDescription] = useState({});
  const [hoveredContest, setHoveredContest] = useState(null);
  const [hoveredArtworkUser, setHoveredArtworkUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [visibleArtworks, setVisibleArtworks] = useState({});
  const [fileName, setFileName] = useState("");
  const [refreshArtworks, setRefreshArtworks] = useState(false); // Pour forcer la mise à jour des artworks

  // Fetch contests when the component mounts
  useEffect(() => {
    dispatch(getAllContests());
  }, [dispatch]);

  // Fetch artworks for each contest
  useEffect(() => {
    if (!isEmpty(contests)) {
      contests.forEach((contest) => {
        dispatch(getArtworksContest(contest._id));
      });
    }
  }, [contests, refreshArtworks, dispatch]); // Dépend de refreshArtworks pour recharger les artworks

  // Load more contests on scroll
  const loadMoreContests = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.documentElement.offsetHeight
    ) {
      setLoadContests(true);
    }
  };

  useEffect(() => {
    if (loadContests) {
      setVisibleContests((prev) => prev + 10);
      setLoadContests(false);
    }

    window.addEventListener("scroll", loadMoreContests);
    return () => window.removeEventListener("scroll", loadMoreContests);
  }, [loadContests]);

  // Handle image click to open in fullscreen
  const handleImageClick = (imageSrc) => {
    setFullscreenImage(imageSrc);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  // Fonction de soumission d'un fichier et ajout d'un artwork à un concours
  const handleFileSubmit = (contestId) => {
    if (!selectedFile) {
      setUploadError("Please select a file before submitting.");
      return;
    }

    // Check file size (500KB max)
    if (selectedFile.size > 500 * 1024) {
      setUploadError("File size must be less than 500KB.");
      return;
    }

    // Check file type (jpg/jpeg only)
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "jpg" && fileExtension !== "jpeg") {
      setUploadError("Only JPG and JPEG files are allowed.");
      return;
    }

    if (!userData || !userData._id) {
      setUploadError("You must be logged in to submit an artwork.");
      return;
    }

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("contestId", contestId);
    formData.append("posterId", userData._id);

    // Call the addArtworkContest action with the data
    dispatch(addArtworkContest(formData))
      .then(() => {
        // Reset the selected file and file name after a successful upload
        setSelectedFile(null);
        setFileName("");
        setUploadError(null);
        setRefreshArtworks((prev) => !prev);
      })
      .catch((err) => {
        setUploadError("File upload failed. Please try again.");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
    setUploadError(null);
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const displayFileName =
    fileName.length > 10 ? `${fileName.substring(0, 10)}...` : fileName;

  const getUserProfilePicture = (userId) => {
    const user = usersData.find((user) => String(user._id) === String(userId));
    return user ? user.picture : "/img/default-profile.png";
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const getRemainingDaysClass = (days) => {
    if (days > 10) return "contest-days-green";
    if (days <= 10 && days >= 3) return "contest-days-orange";
    return "contest-days-red";
  };

  const toggleDescription = (contestId) => {
    setShowFullDescription((prevState) => ({
      ...prevState,
      [contestId]: !prevState[contestId],
    }));
  };

  const handleLikersCountChange = (artworkId, newCount) => {
    setLikersCountByArtwork((prev) => ({
      ...prev,
      [artworkId]: newCount,
    }));
  };

  const handleShowMoreArtworks = (contestId) => {
    const totalArtworks = artworksContest[contestId]?.length || 0;
    setVisibleArtworks((prevState) => ({
      ...prevState,
      [contestId]: totalArtworks,
    }));
  };

  const handleShowLessArtworks = (contestId) => {
    setVisibleArtworks((prevState) => ({
      ...prevState,
      [contestId]: 3,
    }));
  };

  const handleRemoveArtwork = (artworkId, contestId) => {
    dispatch(deleteContestArtwork(artworkId, contestId))
      .then(() => {
        setRefreshArtworks((prev) => !prev);
      })
      .catch(() => {
      });
  };

  const hasUserSubmittedArtwork = (contestId) => {
    const userArtwork = artworksContest[contestId]?.find(
      (artwork) => artwork.posterId === userData._id
    );
    return userArtwork;
  };

  const getUserPseudo = (posterId) => {
    const poster = usersData.find(
      (user) => String(user._id) === String(posterId)
    );
    return poster ? poster.username : "Unknown user";
  };

  const handleDeleteContest = (contestId) => {
    dispatch(deleteContest(contestId));
  };
  

  // Filter contests based on the selected type
  const filteredContests = contests
    .filter((contest) => {
      if (selectedContestType === "Current Contests")
        return !contest.isCompleted;
      if (selectedContestType === "Past Contests") return contest.isCompleted;
      return true;
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

    return (
      <div className="contest-display">
        {!isEmpty(filteredContests) ? (
          filteredContests.slice(0, visibleContests).map((contest) => {
            const sortedArtworks = (artworksContest[contest._id] || [])
              .slice()
              .sort((a, b) => b.likers.length - a.likers.length);
            const visibleCount = visibleArtworks[contest._id] || 3;
            const daysRemaining = getDaysRemaining(contest.endDate);
            const descriptionToShow =
              showFullDescription[contest._id] ||
              contest.description.length <= 200
                ? contest.description
                : `${contest.description.slice(0, 170)}...`;
    
            return (
              <div key={contest._id} className="contest-card">
                <div className="contest-header">
                  <img
                    src={getUserProfilePicture(contest.createdBy)}
                    alt="Creator"
                    className="contest-creator-picture"
                  />
                  <h3>
                    {contest.name}
                    {contest.creatorRole === "super-admin" && (
                      <div
                        className="official-contest-icon-container"
                        onMouseEnter={() => setHoveredContest(contest._id)}
                        onMouseLeave={() => setHoveredContest(null)}
                      >
                        <img
                          src="/img/icons/pokecrafter-official-contest.svg"
                          alt="Official Contest"
                          className="official-contest-icon"
                        />
                        {hoveredContest === contest._id && (
                          <div className="popup-description-official">
                            Official contest! Participate to win a black trophy.
                          </div>
                        )}
                      </div>
                    )}
                    <br />
                    <div style={{ fontSize: "0.6em" }}>
                      by {getUserPseudo(contest.createdBy)}
                      {userData._id === contest.createdBy && (
                        <button
                        className="delete-contest-button"
                        onClick={() => {
                          const confirmation = window.confirm(
                            "Are you sure you want to delete this contest? This action cannot be undone."
                          );
                          if (confirmation) {
                            handleDeleteContest(contest._id);
                          }
                        }}
                      >
                        <img
                          src="/img/icons/pokecrafter-trash.svg"
                          alt="Delete Icon"
                          className="delete-contest-icon"
                        />
                        Delete contest
                      </button>
                      
                      )}
                    </div>
                  </h3>
                </div>
    
                <p
                  className={`contest-dates ${getRemainingDaysClass(
                    daysRemaining
                  )}`}
                >
                  {daysRemaining > 0 ? (
                    <>
                      <img
                        src="/img/icons/pokecrafter-trophy2.svg"
                        alt="trophy icon"
                        className="trophy-icon-remaining"
                      />
                      {`${daysRemaining} days remaining`}
                    </>
                  ) : (
                    <strong className="winner-display">
                      Winner: {getUserPseudo(sortedArtworks[0]?.posterId)}
                    </strong>
                  )}
                </p>
    
                <hr />
                <div className="description-contest">
                  <p>{descriptionToShow}</p>
                  {contest.description.length > 200 && (
                    <button
                      className="viewfulldescription-btn"
                      onClick={() => toggleDescription(contest._id)}
                    >
                      {showFullDescription[contest._id] ? "See Less" : "See More"}
                    </button>
                  )}
                  <br />
                </div>
    
                <div className="artwork-container">
                  {isEmpty(sortedArtworks) || sortedArtworks.length === 0 ? (
                    <p className="no-artworks-message">
                      Be the first to submit an artwork for the contest{" "}
                      <strong>{contest.name}</strong>!
                    </p>
                  ) : null}
    
                  <div className="artwork-grid">
                    {sortedArtworks.slice(0, visibleCount).map((artwork) => (
                      <div key={artwork._id} className="artwork-thumbnail">
                        <div className="artwork-image-container">
                          <img
                            src={artwork.picture}
                            alt={artwork.title}
                            onClick={() => handleImageClick(artwork.picture)}
                            className="artwork-image"
                          />
                          <img
                            src={getUserProfilePicture(artwork.posterId)}
                            alt="Artwork Author"
                            className="artwork-user-picture-overlay"
                            onMouseEnter={() =>
                              setHoveredArtworkUser(artwork.posterId)
                            }
                            onMouseLeave={() => setHoveredArtworkUser(null)}
                          />
                          {hoveredArtworkUser === artwork.posterId && (
                            <div className="artwork-author-popup">
                              {getUserPseudo(artwork.posterId)}
                            </div>
                          )}
                        </div>
                        <LikeArtworkContestButton
                          artwork={artwork}
                          likersCount={
                            likersCountByArtwork[artwork._id] ||
                            artwork.likers.length
                          }
                          setLikersCount={(newCount) =>
                            handleLikersCountChange(artwork._id, newCount)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
    
                <div className="artwork-buttons">
                  {visibleCount < sortedArtworks.length && (
                    <button
                      className="see-more-btn"
                      onClick={() => handleShowMoreArtworks(contest._id)}
                    >
                      Load more artworks
                    </button>
                  )}
                  {visibleCount > 5 && (
                    <button
                      className="see-less-btn"
                      onClick={() => handleShowLessArtworks(contest._id)}
                    >
                      Hide
                    </button>
                  )}
                </div>
                <br />
                <br />
                <div className="submit-artwork-section">
                  <input
                    id="fileInput"
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {hasUserSubmittedArtwork(contest._id) ? (
                    <>
                      <button
                        className="custom-upload-button icon-button"
                        onClick={() => {
                          const confirmation = window.confirm(
                            "Are you sure you want to remove your artwork from this contest? This action cannot be undone."
                          );
                          if (confirmation) {
                            handleRemoveArtwork(
                              hasUserSubmittedArtwork(contest._id)._id,
                              contest._id
                            );
                          }
                        }}
                      >
                        <img
                          src="/img/icons/pokecrafter-trash.svg"
                          alt="Remove Icon"
                        />{" "}
                        Remove Artwork
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="custom-upload-button icon-button"
                        onClick={handleClick}
                      >
                        <img
                          src="/img/icons/pokecrafter-add3.svg"
                          alt="Add Icon"
                        />{" "}
                        {displayFileName || "Participate"}{" "}
                      </button>
                      {selectedFile && (
                        <button
                          className="submit-artwork-button"
                          onClick={() =>
                            handleFileSubmit(contest._id, userData._id)
                          }
                        >
                          Submit Your Artwork
                        </button>
                      )}
                    </>
                  )}
                  {uploadError && <p className="upload-error">{uploadError}</p>}
                </div>
    
                <br />
              </div>
            );
          })
        ) : (
          <p>Loading contests...</p>
        )}
    
        {fullscreenImage && (
          <div className="fullscreen-modal" onClick={handleCloseFullscreen}>
            <img
              src={fullscreenImage}
              alt="Fullscreen artwork"
              className="fullscreen-image"
            />
          </div>
        )}
      </div>
    );
  };  
  
  export default ContestDisplay;