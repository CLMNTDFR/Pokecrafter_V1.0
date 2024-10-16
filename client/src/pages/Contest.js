import React, { useState } from "react";
import LeftNav from "../components/LeftNav";
import ContestDisplay from "../components/Contest/ContestDisplay";
import FilterContest from "../components/FilterContest";
import NewContestForm from "../components/Contest/NewContestForm"; // Importer le formulaire
import { useContext } from "react";
import { UidContext } from "../components/AppContext";
import { Link } from "react-router-dom";

const Contest = () => {
  const uid = useContext(UidContext);
  const [selectedContestType, setSelectedContestType] = useState("Current Contests");
  const [showForm, setShowForm] = useState(false); // État pour afficher le formulaire
  const [formSuccess, setFormSuccess] = useState(false); // État pour gérer le succès du formulaire

  const toggleForm = () => {
    setShowForm(!showForm); // Alterner l'affichage du formulaire
  };

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3>{selectedContestType}</h3>
          <FilterContest setSelectedContestType={setSelectedContestType} />
        </div>
        <hr />
        {uid ? (
          <>
            {formSuccess && (
              <p className="contest-success-message">Contest created successfully!</p>
            )} {/* Afficher le message de succès */}
            <button onClick={toggleForm} className="propose-contest">
              {showForm ? "Hide Contest Form" : "Propose a contest"}
            </button>
            {showForm && <NewContestForm setFormSuccess={setFormSuccess} />} {/* Passer setFormSuccess au formulaire */}
            <hr />
            <ContestDisplay selectedContestType={selectedContestType} />
          </>
        ) : (
          <div className="centered-container">
            <Link to="/profil" className="please-login">
              Please log in to view current contests
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;
