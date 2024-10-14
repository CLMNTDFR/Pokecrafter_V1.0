import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import {
  likeContestArtwork,
  unlikeContestArtwork,
} from "../../actions/artwork.contest.actions";

const LikeArtworkContestButton = ({ artwork, likersCount, setLikersCount }) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const like = () => {
    setLiked(true);
    setLikersCount(likersCount + 1);
    dispatch(likeContestArtwork(artwork._id, uid));
  };

  const unlike = () => {
    setLiked(false);
    setLikersCount(likersCount - 1);
    dispatch(unlikeContestArtwork(artwork._id, uid));
  };

  useEffect(() => {
    if (artwork.likers.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, artwork.likers]);

  return (
    <div className="like-container">
      <div className="like-margin-top-contest">
        <div className="like-flex-container">
          {uid === null && (
            <Popup
              trigger={<img src="/img/icons/heart-empty.svg" alt="like" />}
              position={["bottom center", "bottom right", "bottom left"]}
              closeOnDocumentClick
            >
              <div>Connect to like</div>
            </Popup>
          )}
          {uid && !liked && (
            <img
              src="./img/icons/pokecrafter-heart.svg"
              onClick={like}
              alt="like"
              className="like-img-contest"
            />
          )}
          {uid && liked && (
            <img
              src="./img/icons/pokecrafter-heart-filled.svg"
              onClick={unlike}
              alt="unlike"
              className="like-img-contest"
            />
          )}
          <span className="like-count">{likersCount}</span>
        </div>
      </div>
    </div>
  );
};

export default LikeArtworkContestButton;
