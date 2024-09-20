import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../Utils';
import { followUser, unfollowUser } from '../../actions/user.actions';

const FollowHandler = ({ idToFollow }) => {
    const userData = useSelector((state) => state.userReducer);
    const [isFollowed, setIsFollowed] = useState(false);
    const dispatch = useDispatch();

    const handleFollow = () => {
        dispatch (followUser(userData._id, idToFollow));
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
                    <button className="unfollow-btn">
                        <img
                            src="/img/icons/followed.svg"
                            alt="Followed icon"
                            className="icon"
                        />
                        Followed
                    </button>
                </span>
            )}
            {isFollowed === false && !isEmpty(userData) && (
                <span onClick={handleFollow}>
                    <button className="follow-btn">
                        <img
                            src="/img/icons/followback.svg"
                            alt="Follow back icon"
                            className="icon"
                        />
                        Follow back
                    </button>
                </span>
            )}
        </>
    );
};

export default FollowHandler;
