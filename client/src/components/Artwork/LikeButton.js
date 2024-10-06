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

  const like = () => {
    setLiked(true);
    setLikersCount(likersCount + 1);
    dispatch(likeArtwork(artwork._id, uid));
  };

  const unlike = () => {
    setLiked(false);
    setLikersCount(likersCount - 1);
    dispatch(unlikeArtwork(artwork._id, uid));
  };

  useEffect(() => {
    if (artwork.likers.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, artwork.likers]);

  return (
    <div className="like-container">
      {uid === null && (
        <Popup
          trigger={<img src="./img/icons/heart.svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick
        >
          <div>Connectez-vous pour aimer un artwork !</div>
        </Popup>
      )}
      {uid && !liked && (
        <img src="./img/icons/heart.svg" onClick={like} alt="like" />
      )}
      {uid && liked && (
        <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
      <span>{likersCount}</span>
    </div>
  );
};

export default LikeButton;
