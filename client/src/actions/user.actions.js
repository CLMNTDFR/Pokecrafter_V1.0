import axios from "axios";

// Action Types
export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";
export const DELETE_USER = "DELETE_USER";

// Errors
export const GET_USER_ERRORS = "GET_USER_ERRORS";

// Fetch user data by user ID
export const getUser = (uid) => {
    return (dispatch) => {
        return axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/user/${uid}`,
        })
            .then((res) => {
                dispatch({ type: GET_USER, payload: res.data });
            })
            .catch((err) => {
                // Handle error silently or use alternative error handling
            });
    };
};

// Upload user profile picture
export const uploadPicture = (data, id) => {
    return (dispatch) => {
        return axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/upload`,
            data: data,
        })
        .then((res) => {
            if (res.data.errors) {
                dispatch({ type: GET_USER_ERRORS, payload: res.data.errors });
            } else {
                dispatch({ type: GET_USER_ERRORS, payload: "" });
                return axios
                    .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
                    .then((res) => {
                        dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
                    });
            }
        })
        .catch((err) => {
            // Handle error silently or use alternative error handling
        });
    };
};

// Update user bio
export const updateBio = (userId, bio) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/user/` + userId,
            data: { bio },
        })
        .then((res) => {
            dispatch({ type: UPDATE_BIO, payload: bio });
        })
        .catch((err) => {
            // Handle error silently or use alternative error handling
        });
    };
};

// Follow a user
export const followUser = (followerId, idToFollow) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/user/follow/` + followerId,
            data: { idToFollow },
        })
        .then((res) => {
            dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
        })
        .catch((err) => {
            // Handle error silently or use alternative error handling
        });
    };
};

// Unfollow a user
export const unfollowUser = (followerId, idToUnfollow) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/user/unfollow/` + followerId,
            data: { idToUnfollow },
        })
        .then((res) => {
            dispatch({ type: UNFOLLOW_USER, payload: { idToUnfollow } });
        })
        .catch((err) => {
            // Handle error silently or use alternative error handling
        });
    };
};

// Delete a user account
export const deleteUser = (userId) => {
    return (dispatch) => {
        return axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}api/user/` + userId,
        })
        .then((res) => {
            dispatch({ type: DELETE_USER, payload: userId });
        })
        .catch((err) => {
            // Handle error silently or use alternative error handling
        });
    };
};
