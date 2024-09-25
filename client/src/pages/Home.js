import React, { useState } from "react";
import LeftNav from "../components/LeftNav";
import Thread from "../components/Thread";
import FilterButtons from "../components/FilterButtons"; // Les boutons pour filtrer par catégories

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        {/* Conteneur pour le header */}
        <div className="header-container">
          <h3>{selectedCategory}</h3>
          <FilterButtons setSelectedCategory={setSelectedCategory} />
        </div>
        <hr />
        {/* La mosaïque sera gérée par le Thread */}
        <Thread selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default Home;
