import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArtworks } from "../actions/artwork.actions";
import Card from "./Artwork/Card";
import { isEmpty } from "./Utils";

const Thread = ({ selectedCategory }) => {
  const [loadArtwork, setLoadArtwork] = useState(true);
  const [count, setCount] = useState(100);
  const dispatch = useDispatch();
  const artworks = useSelector((state) => state.artworkReducer);

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.documentElement.offsetHeight
    ) {
      setLoadArtwork(true);
    }
  };

  useEffect(() => {
    if (loadArtwork) {
      dispatch(getArtworks(count));
      setLoadArtwork(false);
      setCount((prevCount) => prevCount + 30);
    }

    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadArtwork, count, dispatch]);

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
