import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LeftNav from "../components/LeftNav";
import TrendThread from "../components/TrendThread";
import { getArtworks } from "../actions/artwork.actions";

const Trending = () => {
  const dispatch = useDispatch();
  const artworks = useSelector((state) => state.artworkReducer);
  const [sortedArtworks, setSortedArtworks] = useState([]);

  // Fetch artworks if none exist
  useEffect(() => {
    if (artworks.length === 0) {
      dispatch(getArtworks());
    }
  }, [dispatch, artworks]);

  // Sort artworks by number of likers
  useEffect(() => {
    if (artworks.length > 0) {
      const sorted = [...artworks].sort((a, b) => b.likers.length - a.likers.length);
      setSortedArtworks(sorted);
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
