import React, { useState } from "react";
import LeftNav from "../components/LeftNav";
import ContestDisplay from "../components/Contest/ContestDisplay";
import FilterContest from "../components/FilterContest";
import { useContext } from "react";
import { UidContext } from "../components/AppContext";
import { Link } from "react-router-dom";

const Contest = () => {
  const uid = useContext(UidContext);
  const [selectedContestType, setSelectedContestType] = useState("Current Contests");

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
          <ContestDisplay selectedContestType={selectedContestType} />
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
