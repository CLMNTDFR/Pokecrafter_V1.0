import React from "react";
import LeftNav from "../components/LeftNav";
import ContestDisplay from "../components/Contest/ContestDisplay";
import { useContext } from "react";
import { UidContext } from "../components/AppContext";
import { Link } from "react-router-dom";

const Contest = () => {
  const uid = useContext(UidContext);

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3>Contests</h3>
          <br />
          <br />
        </div>
        <hr />
        {uid ? (
          <ContestDisplay />
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
