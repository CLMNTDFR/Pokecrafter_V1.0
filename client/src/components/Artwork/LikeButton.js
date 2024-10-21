import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likeArtwork, unlikeArtwork } from "../../actions/artwork.actions";

const LikeButton = ({ artwork, likersCount, setLikersCount }) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  // Like the artwork
  const like = () => {
    setLiked(true);
    setLikersCount(likersCount + 1);
    dispatch(likeArtwork(artwork._id, uid));
  };

  // Unlike the artwork
  const unlike = () => {
    setLiked(false);
    setLikersCount(likersCount - 1);
    dispatch(unlikeArtwork(artwork._id, uid));
  };

  useEffect(() => {
    // Check if the user already liked the artwork
    if (artwork.likers.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, artwork.likers]);

  return (
    <div className="like-container">
      <div className="heart-margin-top">
        {uid === null && (
          <Popup
            trigger={
              <img
                src="./img/icons/pokecrafter-heart.svg"
                alt="like"
                className="heart-icon"
              />
            }
            position={["bottom center", "bottom right", "bottom left"]}
            closeOnDocumentClick
          >
            <div>Log in to like an artwork!</div>
          </Popup>
        )}
        {uid && !liked && (
          <img
            src="./img/icons/pokecrafter-heart.svg"
            onClick={like}
            alt="like"
            className="heart-icon"
          />
        )}
        {uid && liked && (
          <img
            src="./img/icons/pokecrafter-heart-filled.svg"
            onClick={unlike}
            alt="unlike"
            className="heart-icon"
          />
        )}
      </div>
      <span className="like-card-counter">{likersCount}</span>
    </div>
  );
};

export default LikeButton;
