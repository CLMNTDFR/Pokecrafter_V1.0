import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import { useDispatch } from "react-redux";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { likeArtwork, unlikeArtwork } from "../../actions/artwork.actions";

const LikeButton = ({ artwork }) => {
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext);
    const dispatch = useDispatch();

    const like = () => {
        dispatch(likeArtwork(artwork._id, uid));
        setLiked(true);
    }

    const unlike = () => {
        dispatch(unlikeArtwork(artwork._id, uid));
        setLiked(false);
    }

    useEffect(() => {
        if (artwork.likers.includes(localStorage.getItem("userId"))) {
            setLiked(true);
        }
    }, [uid, artwork.likers, liked]);

    return (
        <div className="like-container">
            {uid === null && (
                <Popup
                    trigger={<img src="/img/icons/heart.svg" alt="like" />}
                    position={["bottom center", "bottom right", "bottom left"]}
                    closeOnDocumentClick
                >
                    <div>Log in to like this post.</div>
                </Popup>
            )}
            {uid && liked === false && (
                <img src="/img/icons/heart.svg" onClick={like} alt="like" />
            )}
            {uid && liked === true && (
                <img src="/img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
            )}
            <span>{artwork.likers.length}</span>
        </div>
    );
};

export default LikeButton;
