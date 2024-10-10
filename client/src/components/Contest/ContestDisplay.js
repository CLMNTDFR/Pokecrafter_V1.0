import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContests } from "../../actions/contest.actions";
import { getArtworksContest } from "../../actions/artwork.contest.actions";
import { isEmpty } from "../Utils";
import LikeArtworkContestButton from "./LikeArtworkContestButton"; // Importation du bouton de like

const ContestDisplay = ({ selectedContestType }) => {
  const dispatch = useDispatch();
  const contests = useSelector((state) => state.contestReducer);
  const artworksContest = useSelector((state) => state.artworkContestReducer);
  const usersData = useSelector((state) => state.usersReducer); // Utilisateurs
  const [visibleContests, setVisibleContests] = useState(1);
  const [loadContests, setLoadContests] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);

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
    const poster = usersData.find((user) => String(user._id) === String(posterId));
    return poster ? poster.username : "Unknown user";
  };

  const getUserProfilePicture = (userId) => {
    const user = usersData.find((user) => String(user._id) === String(userId));
    return user ? user.picture : "/img/default-profile.png"; // Par défaut si l'utilisateur n'est pas trouvé
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
      setVisibleContests((prev) => prev + 1);
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
      [contestId]: 5,
    }));
  };

  const handleImageClick = (imageSrc) => {
    setFullscreenImage(imageSrc);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div className="contest-display">
      {!isEmpty(filteredContests) ? (
        filteredContests.slice(0, visibleContests).map((contest) => {
          const sortedArtworks = (artworksContest[contest._id] || []).sort(
            (a, b) => b.likers.length - a.likers.length
          );
          const visibleCount = visibleArtworks[contest._id] || 5;

          return (
            <div key={contest._id} className="contest-card">
              {/* Contest creator's profile picture */}
              <div className="contest-header">
                <img
                  src={getUserProfilePicture(contest.creatorId)} // Utilisation de la fonction correcte
                  alt="Creator"
                  className="contest-creator-picture"
                />
                <h3>{contest.name}</h3>
              </div>
              <p className="contest-dates">
                {new Date(contest.startDate).toLocaleDateString()} -{" "}
                {new Date(contest.endDate).toLocaleDateString()}
              </p>
              <p className="contest-description">{contest.description}</p>

              <div className="artwork-grid">
                {!isEmpty(sortedArtworks) &&
                  sortedArtworks.slice(0, visibleCount).map((artwork) => (
                    <div key={artwork._id} className="artwork-thumbnail">
                      <div className="artwork-user-info">

                        <p>{getUserPseudo(artwork.posterId)}</p>
                      </div>
                      <img
                        src={artwork.picture}
                        alt={artwork.title}
                        onClick={() => handleImageClick(artwork.picture)} // Click pour afficher en plein écran
                      />
                      <br /><br />
                      <LikeArtworkContestButton
                        artwork={artwork}
                        likersCount={artwork.likers.length} // Passer le nombre de likes pour chaque artwork
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
                    ⏷
                  </button>
                )}
                {visibleCount > 5 && (
                  <button
                    className="see-less-btn"
                    onClick={() => handleShowLessArtworks(contest._id)}
                  >
                    ⏶
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
          <img src={fullscreenImage} alt="Fullscreen artwork" className="fullscreen-image" />
        </div>
      )}
    </div>
  );
};

export default ContestDisplay;
