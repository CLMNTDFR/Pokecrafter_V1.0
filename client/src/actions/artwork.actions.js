import axios from "axios";

// Actions pour les artworks
export const GET_ARTWORKS = "GET_ARTWORKS";
export const LIKE_ARTWORK = "LIKE_ARTWORK";
export const UNLIKE_ARTWORK = "UNLIKE_ARTWORK";

// Obtenir les artworks (limités à un nombre spécifique si besoin)
export const getArtworks = (num) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/artwork/`)
      .then((res) => {
        const array = res.data.slice(0, num);
        dispatch({ type: GET_ARTWORKS, payload: array });
      })
      .catch((err) => console.log(err));
  };
};

// Liker un artwork
export const likeArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork/like-artwork/` + artworkId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: LIKE_ARTWORK, payload: { artworkId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

// Unliker un artwork
export const unlikeArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork/unlike-artwork/` + artworkId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: UNLIKE_ARTWORK, payload: { artworkId, userId } });
      })
      .catch((err) => console.log(err));
  };
};
