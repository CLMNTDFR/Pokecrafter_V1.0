import axios from "axios";

// Actions pour les artworks
export const GET_ARTWORKS = "GET_ARTWORKS";
export const LIKE_ARTWORK = "LIKE_ARTWORK";
export const UNLIKE_ARTWORK = "UNLIKE_ARTWORK";
export const UPDATE_ARTWORK = "UPDATE_ARTWORK";
export const DELETE_ARTWORK = "DELETE_ARTWORK";

// Comments (ajoutées)
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// Trends (ajoutée)
export const GET_TRENDS = "GET_TRENDS";

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

// Mettre à jour un artwork
export const updateArtwork = (artworkId, description) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/artwork/` + artworkId,
      data: { description },
    })
      .then((res) => {
        dispatch({ type: UPDATE_ARTWORK, payload: { description, artworkId } });
      })
      .catch((err) => console.log(err));
  };
};

// Supprimer un artwork
export const deleteArtwork = (artworkId) => {
  return (dispatch) => {
    console.log(`Sending DELETE request for artwork ID: ${artworkId}`);
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/artwork/` + artworkId,
    })
      .then((res) => {
        console.log("Delete successful", res);
        dispatch({ type: DELETE_ARTWORK, payload: { artworkId } });
      })
      .catch((err) => {
        console.error("Error deleting artwork:", err);
      });
  };
};

// Ajouter un commentaire sur un artwork (ajoutée)
export const addComment = (artworkId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork/comment-artwork/` + artworkId,
      data: { commenterId, text, commenterPseudo },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENT, payload: { artworkId } });
      })
      .catch((err) => console.log(err));
  };
};

// Modifier un commentaire sur un artwork (ajoutée)
export const editComment = (artworkId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork/edit-comment-artwork/` + artworkId,
      data: { commentId, text },
    })
      .then((res) => {
        dispatch({ type: EDIT_COMMENT, payload: { artworkId, commentId, text } });
      })
      .catch((err) => console.log(err));
  };
};

// Supprimer un commentaire sur un artwork (ajoutée)
export const deleteComment = (artworkId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork/delete-comment-artwork/` + artworkId,
      data: { commentId },
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { artworkId, commentId } });
      })
      .catch((err) => console.log(err));
  };
};

// Obtenir les tendances (ajoutée)
export const getTrends = (sortedArray) => {
  return (dispatch) => {
    dispatch({ type: GET_TRENDS, payload: sortedArray });
  };
};
