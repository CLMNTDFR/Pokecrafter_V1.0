import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LeftNav from "../components/LeftNav";
import TrendThread from "../components/TrendThread"; // Import du nouveau composant TrendThread
import { getArtworks } from "../actions/artwork.actions";

const Trending = () => {
  const dispatch = useDispatch();
  const artworks = useSelector((state) => state.artworkReducer); // Récupère les artworks depuis Redux
  const [sortedArtworks, setSortedArtworks] = useState([]);

  // Récupère les artworks à la montée du composant
  useEffect(() => {
    if (artworks.length === 0) {
      dispatch(getArtworks()); // Appel API pour obtenir les artworks si nécessaire
    }
  }, [dispatch, artworks]);

  // Trie des artworks en fonction du nombre de likers
  useEffect(() => {
    if (artworks.length > 0) {
      const sorted = [...artworks].sort((a, b) => b.likers.length - a.likers.length); // Tri par nombre de likers
      setSortedArtworks(sorted); // Mise à jour de l'état local
    }
  }, [artworks]);

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3>Trending</h3>
          <br /><br />
        </div>
        <hr />
        <TrendThread artworks={sortedArtworks} />
      </div>
    </div>
  );
};

export default Trending;
