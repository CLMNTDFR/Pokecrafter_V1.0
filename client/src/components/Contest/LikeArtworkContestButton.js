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

  // Check if the user has liked the artwork
  useEffect(() => {
    setLiked(artwork.likers.includes(uid));
  }, [uid, artwork.likers]);

  // Handle liking the artwork
  const handleLike = () => {
    setLiked(true);
    setLikersCount(likersCount + 1);
    dispatch(likeContestArtwork(artwork._id, uid));
  };

  // Handle unliking the artwork
  const handleUnlike = () => {
    setLiked(false);
    setLikersCount(likersCount - 1);
    dispatch(unlikeContestArtwork(artwork._id, uid));
  };

  return (
    <div className="like-container">
      <div className="like-margin-top-contest">
        <div className="like-flex-container">
          {uid === null ? (
            <Popup
              trigger={<img src="/img/icons/heart-empty.svg" alt="like" />}
              position={["bottom center", "bottom right", "bottom left"]}
              closeOnDocumentClick
            >
              <div>Connect to like</div>
            </Popup>
          ) : liked ? (
            <img
              src="./img/icons/pokecrafter-heart-filled.svg"
              onClick={handleUnlike}
              alt="unlike"
              className="like-img-contest"
            />
          ) : (
            <img
              src="./img/icons/pokecrafter-heart.svg"
              onClick={handleLike}
              alt="like"
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
