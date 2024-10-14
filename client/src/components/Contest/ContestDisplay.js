import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContests } from "../../actions/contest.actions";
import { getArtworksContest } from "../../actions/artwork.contest.actions";
import { isEmpty } from "../Utils";
import LikeArtworkContestButton from "./LikeArtworkContestButton";

const ContestDisplay = ({ selectedContestType }) => {
  const dispatch = useDispatch();
  const contests = useSelector((state) => state.contestReducer);
  const artworksContest = useSelector((state) => state.artworkContestReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const [visibleContests, setVisibleContests] = useState(1);
  const [loadContests, setLoadContests] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [likersCountByArtwork, setLikersCountByArtwork] = useState({});
  const [showFullDescription, setShowFullDescription] = useState({});
  const [hoveredContest, setHoveredContest] = useState(null);
  const [hoveredArtworkUser, setHoveredArtworkUser] = useState(null);

  useEffect(() => {
    dispatch(getAllContests());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(contests)) {
      contests.forEach((contest) => {
        dispatch(getArtworksContest(contest._id));
      });
    }
  }, [contests, dispatch]);

  const filteredContests = contests
    .filter((contest) => {
      if (selectedContestType === "Current Contests") {
        return !contest.isCompleted;
      } else if (selectedContestType === "Past Contests") {
        return contest.isCompleted;
      }
      return true;
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const getUserPseudo = (posterId) => {
    const poster = usersData.find(
      (user) => String(user._id) === String(posterId)
    );
    return poster ? poster.username : "Unknown user";
  };

  const getUserProfilePicture = (userId) => {
    const user = usersData.find((user) => String(user._id) === String(userId));
    return user ? user.picture : "/img/default-profile.png";
  };

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

  const [visibleArtworks, setVisibleArtworks] = useState({});

  const handleShowMoreArtworks = (contestId) => {
    setVisibleArtworks((prevState) => ({
      ...prevState,
      [contestId]: (prevState[contestId] || 5) + 10,
    }));
  };

  const handleShowLessArtworks = (contestId) => {
    setVisibleArtworks((prevState) => ({
      ...prevState,
      [contestId]: 3,
    }));
  };

  const handleImageClick = (imageSrc) => {
    setFullscreenImage(imageSrc);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  const handleLikersCountChange = (artworkId, newCount) => {
    setLikersCountByArtwork((prev) => ({
      ...prev,
      [artworkId]: newCount,
    }));
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const getRemainingDaysClass = (days) => {
    if (days > 10) {
      return "contest-days-green";
    } else if (days <= 10 && days >= 3) {
      return "contest-days-orange";
    } else if (days < 3) {
      return "contest-days-red";
    }
  };

  const toggleDescription = (contestId) => {
    setShowFullDescription((prevState) => ({
      ...prevState,
      [contestId]: !prevState[contestId],
    }));
  };

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
            contest.description.length <= 100
              ? contest.description
              : `${contest.description.slice(0, 100)}...`;

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
                    by {getUserPseudo(contest.createdBy)}{" "}
                  </div>
                </h3>
              </div>
              <p
                className={`contest-dates ${getRemainingDaysClass(
                  daysRemaining
                )}`}
              >
                {daysRemaining > 0 ? (
                  `${daysRemaining} days remaining`
                ) : (
                  <strong className="winner-display">
                    Winner: {getUserPseudo(sortedArtworks[0]?.posterId)}
                  </strong>
                )}
              </p>
              <hr />
              <div className="description-contest">
                <p>{descriptionToShow}</p>
                {contest.description.length > 100 && (
                  <button
                    className="viewfulldescription-btn"
                    onClick={() => toggleDescription(contest._id)}
                  >
                    {showFullDescription[contest._id] ? "See Less" : "See More"}
                  </button>
                )}
                <br />
              </div>

              <div className="artwork-grid">
                {!isEmpty(sortedArtworks) &&
                  sortedArtworks.slice(0, visibleCount).map((artwork) => (
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
            </div>
          );
        })
      ) : (
        <p>No contests available.</p>
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
