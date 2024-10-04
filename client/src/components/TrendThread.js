import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArtworks } from '../actions/artwork.actions';
import Card from './Artwork/Card';
import { isEmpty } from './Utils';

const TrendThread = () => {
  const [loadArtwork, setLoadArtwork] = useState(true);
  const [count, setCount] = useState(100); // Nombre initial d'artworks à charger
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
      setCount((prevCount) => prevCount + 30); // Charger 30 artworks supplémentaires à chaque scroll
    }

    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  }, [loadArtwork, count, dispatch]);

  // Tri des artworks par nombre de likes (du plus au moins liké)
  const sortedArtworks = artworks.slice().sort((a, b) => b.likers.length - a.likers.length);

  return (
    <div className="thread-container">
      <ul>
        {!isEmpty(sortedArtworks) &&
          sortedArtworks.map((artwork) => (
            <Card artwork={artwork} key={artwork._id} />
          ))}
      </ul>
    </div>
  );
};

export default TrendThread;
