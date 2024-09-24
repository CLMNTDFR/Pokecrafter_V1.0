import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArtworks } from '../actions/artwork.actions';
import Card from "./Artwork/Card";

const Thread = () => {
    const [loadArtwork, setLoadArtwork] = useState(true);
    const dispatch = useDispatch();
    const artworks = useSelector((state) => state.artworkReducer);

    useEffect(() => {
        if (loadArtwork) {
            dispatch(getArtworks());
            setLoadArtwork(false);
        }
    }, [loadArtwork, dispatch]);

    return (
        <div className="thread-container">
            <ul>
                {artworks && artworks.length > 0 ? (
                    artworks.map((artwork) => {
                        return <Card artwork={artwork} key={artwork._id} />;  // Changement de "post" à "artwork"
                    })
                ) : (
                    <li>No artwork available</li> // Default message if empty
                )}
            </ul>
        </div>
    );
};

export default Thread;
