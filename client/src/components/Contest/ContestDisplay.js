import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContests } from "../../actions/contest.actions";
import { isEmpty } from "../Utils"; // Importez votre fonction isEmpty si vous l'utilisez

const ContestDisplay = () => {
  const dispatch = useDispatch();
  const contests = useSelector((state) => state.contestReducer);

  useEffect(() => {
    dispatch(getAllContests());
  }, [dispatch]);

  // Ajout d'un log pour vérifier le contenu de contests
  console.log("Contests:", contests);

  return (
    <div className="contest-display">
      {!isEmpty(contests) ? (
        contests.map((contest) => (
          <div key={contest._id} className="contest-card">
            <h2>{contest.name}</h2>
            <p>{contest.description}</p>
            <p>
              Start Date: {new Date(contest.startDate).toLocaleDateString()} - End Date:{" "}
              {new Date(contest.endDate).toLocaleDateString()}
            </p>
            {/* Ajoutez d'autres détails comme les artworks associés */}
          </div>
        ))
      ) : (
        <p>No contests available.</p>
      )}
    </div>
  );
};

export default ContestDisplay;
