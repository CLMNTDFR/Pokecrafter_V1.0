import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import { followUser, unfollowUser } from "../../actions/user.actions";

const FollowHandler = ({ idToFollow, type }) => {
  const userData = useSelector((state) => state.userReducer);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

  // Handle follow action
  const handleFollow = () => {
    dispatch(followUser(userData._id, idToFollow));
    setIsFollowed(true);
  };

  // Handle unfollow action
  const handleUnfollow = () => {
    dispatch(unfollowUser(userData._id, idToFollow));
    setIsFollowed(false);
  };

  useEffect(() => {
    // Check if the user is already followed
    if (!isEmpty(userData.following)) {
      setIsFollowed(userData.following.includes(idToFollow));
    }
  }, [userData, idToFollow]);

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && (
            <button className="unfollow-btn">
              <img
                src="/img/icons/pokecrafter-followed.svg"
                alt="Followed icon"
                className="icon"
              />
              Followed
            </button>
          )}
          {type === "card" && (
            <>
              <img src="/img/icons/pokecrafter-checked.svg" alt="Checked" />
              <div className="follow-text">Unfollow</div>
            </>
          )}
        </span>
      )}
      {!isFollowed && !isEmpty(userData) && (
        <span onClick={handleFollow}>
          {type === "suggestion" && (
            <button className="follow-btn">
              <img
                src="/img/icons/pokecrafter-followback.svg"
                alt="Follow back icon"
                className="icon"
              />
              Follow
            </button>
          )}
          {type === "card" && (
            <>
              <img src="/img/icons/pokecrafter-check.svg" alt="Check" />
              <div className="follow-text">Follow</div>
            </>
          )}
        </span>
      )}
    </>
  );
};

export default FollowHandler;
