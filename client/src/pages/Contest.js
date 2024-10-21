import React, { useState, useContext } from "react";
import LeftNav from "../components/LeftNav";
import ContestDisplay from "../components/Contest/ContestDisplay";
import FilterContest from "../components/FilterContest";
import NewContestForm from "../components/Contest/NewContestForm"; 
import { UidContext } from "../components/AppContext";
import { Link } from "react-router-dom";

const Contest = () => {
  const uid = useContext(UidContext);
  const [selectedContestType, setSelectedContestType] = useState("Current Contests");
  const [showForm, setShowForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  // Early return for users not logged in
  if (!uid) {
    return (
      <div className="centered-container">
        <Link to="/profil" className="please-login">
          Please log in to view current contests
        </Link>
      </div>
    );
  }

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3>{selectedContestType}</h3>
          <FilterContest setSelectedContestType={setSelectedContestType} />
        </div>
        <hr />
        
        {/* Display success message if contest is created successfully */}
        {formSuccess && (
          <p className="contest-success-message">Contest created successfully!</p>
        )}
        
        {/* Button to toggle the contest form */}
        <button onClick={toggleForm} className="propose-contest">
          {showForm ? "Hide Contest Form" : "Propose a Contest"}
        </button>

        {/* Conditionally render the contest form */}
        {showForm && <NewContestForm setFormSuccess={setFormSuccess} />}
        
        <hr />
        {/* Display contests based on selected type */}
        <ContestDisplay selectedContestType={selectedContestType} />
      </div>
    </div>
  );
};

export default Contest;
