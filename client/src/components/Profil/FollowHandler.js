import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import { followUser, unfollowUser } from "../../actions/user.actions";

const FollowHandler = ({ idToFollow, type }) => {
  const userData = useSelector((state) => state.userReducer);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followUser(userData._id, idToFollow));
    setIsFollowed(true);
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser(userData._id, idToFollow));
    setIsFollowed(false);
  };

  useEffect(() => {
    if (!isEmpty(userData.following)) {
      if (userData.following.includes(idToFollow)) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    }
  }, [userData, idToFollow]);

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && (
            <button className="unfollow-btn">
              <img
                src="/img/icons/followed.svg"
                alt="Followed icon"
                className="icon"
              />
              Followed
            </button>
          )}
          {type === "card" && (
            <>
              <img src="/img/icons/checked.svg" alt="Checked" />
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
                src="/img/icons/followback.svg"
                alt="Follow back icon"
                className="icon"
              />
              Follow back
            </button>
          )}
          {type === "card" && (
            <>
              <img src="/img/icons/check.svg" alt="Check" />
              <div className="follow-text">Follow</div>
            </>
          )}
        </span>
      )}
    </>
  );
};

export default FollowHandler;
