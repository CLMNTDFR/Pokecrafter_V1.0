import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContests } from "../../actions/contest.actions";
import { getArtworksContest } from "../../actions/artwork.contest.actions";
import { isEmpty } from "../Utils"; // Fonction isEmpty

const ContestDisplay = ({ selectedContestType }) => {
  const dispatch = useDispatch();
  const contests = useSelector((state) => state.contestReducer);
  const artworksContest = useSelector((state) => state.artworkContestReducer); // Récupération des artworks associés aux contests

  const [loadedContests, setLoadedContests] = useState([]);

  useEffect(() => {
    // Charger tous les contests
    dispatch(getAllContests());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(contests)) {
      // Charger les artworks associés à chaque contest
      contests.forEach(contest => {
        dispatch(getArtworksContest(contest._id));
      });
    }
  }, [contests, dispatch]);

  // Filtrer les contests en fonction du type sélectionné
  const filteredContests = contests.filter(contest => {
    if (selectedContestType === "Current Contests") {
      return !contest.isCompleted; // Concours en cours
    } else if (selectedContestType === "Past Contests") {
      return contest.isCompleted; // Concours passés
    }
    return true;
  });

  return (
    <div className="contest-display">
      {!isEmpty(filteredContests) ? (
        filteredContests.map((contest) => (
          <div key={contest._id} className="contest-card">
            <h2>{contest.name}</h2>
            <p>{contest.description}</p>
            <p>
              Start Date: {new Date(contest.startDate).toLocaleDateString()} - End Date:{" "}
              {new Date(contest.endDate).toLocaleDateString()}
            </p>

            {/* Affichage des artworks associés au contest */}
            <div className="artwork-grid">
              {!isEmpty(artworksContest[contest._id]) &&
                artworksContest[contest._id].map((artwork) => (
                  <div key={artwork._id} className="artwork-thumbnail">
                    <p>{artwork.posterPseudo}</p> {/* Affichage du nom de l'utilisateur */}
                    <img src={artwork.picture} alt={artwork.title} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                    <p>{artwork.likers.length} Likes</p> {/* Affichage du nombre de likes */}
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <p>No contests available.</p>
      )}
    </div>
  );
};

export default ContestDisplay;
