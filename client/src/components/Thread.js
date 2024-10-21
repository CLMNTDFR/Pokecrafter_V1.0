import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArtworks } from "../actions/artwork.actions";
import Card from "./Artwork/Card";
import { isEmpty } from "./Utils";

const Thread = ({ selectedCategory }) => {
  const [loadArtwork, setLoadArtwork] = useState(true); // State to control loading more artworks
  const [count, setCount] = useState(100); // Number of artworks to load initially
  const dispatch = useDispatch();
  const artworks = useSelector((state) => state.artworkReducer);

  // Function to check if more artworks should be loaded when scrolling
  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.documentElement.offsetHeight
    ) {
      setLoadArtwork(true);
    }
  };

  useEffect(() => {
    // Load artworks when loadArtwork is true
    if (loadArtwork) {
      dispatch(getArtworks(count));
      setLoadArtwork(false);
      setCount((prevCount) => prevCount + 30);
    }

    // Add scroll event listener
    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadArtwork, count, dispatch]);

  // Filter artworks based on selected category
  const filteredArtworks =
    selectedCategory === "All"
      ? artworks
      : artworks.filter((artwork) => artwork.category === selectedCategory);

  return (
    <div className="thread-container">
      <ul>
        {!isEmpty(filteredArtworks) &&
          filteredArtworks.map((artwork) => (
            <Card artwork={artwork} key={artwork._id} />
          ))}
      </ul>
    </div>
  );
};

export default Thread;
