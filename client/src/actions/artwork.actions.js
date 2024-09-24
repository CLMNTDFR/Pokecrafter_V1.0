import axios from "axios";

// Artworks
export const GET_ARTWORKS = "GET_ARTWORKS";
export const LIKE_ARTWORK = "LIKE_ARTWORK";
export const UNLIKE_ARTWORK = "UNLIKE_ARTWORK";

export const getArtworks = () => {
    return (dispatch) => {
        return axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/artwork/`,
            data: {}
        })
        .then((res) => {
            dispatch({ type: GET_ARTWORKS, payload: res.data });
        })
        .catch((err) => console.log(err));
    };
};

export const likeArtwork = (artworkId, userId) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/artwork/like-artwork/${artworkId}`,
            data: { id: userId }
        })
        .then((res) => {
            dispatch({ type: LIKE_ARTWORK, payload: { artworkId, userId } });
        })
        .catch((err) => console.log(err));
    };
}

export const unlikeArtwork = (artworkId, userId) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/artwork/unlike-artwork/${artworkId}`,
            data: { id: userId }
        })
        .then((res) => {
            dispatch({ type: UNLIKE_ARTWORK, payload: { artworkId, userId } });
        })
        .catch((err) => console.log(err));
    };
}