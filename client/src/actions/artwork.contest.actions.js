import axios from "axios";

// Actions pour les œuvres de concours
export const GET_CONTEST_ARTWORKS = "GET_CONTEST_ARTWORKS";
export const LIKE_CONTEST_ARTWORK = "LIKE_CONTEST_ARTWORK";
export const UNLIKE_CONTEST_ARTWORK = "UNLIKE_CONTEST_ARTWORK";
export const UPDATE_CONTEST_ARTWORK = "UPDATE_CONTEST_ARTWORK";
export const DELETE_CONTEST_ARTWORK = "DELETE_CONTEST_ARTWORK";
export const GET_ARTWORKS_CONTEST = "GET_ARTWORKS_CONTEST";
export const ADD_COMMENT_CONTEST_ARTWORK = "ADD_COMMENT_CONTEST_ARTWORK";
export const EDIT_COMMENT_CONTEST_ARTWORK = "EDIT_COMMENT_CONTEST_ARTWORK";
export const DELETE_COMMENT_CONTEST_ARTWORK = "DELETE_COMMENT_CONTEST_ARTWORK";

// Obtenir les œuvres d'art pour un concours
export const getArtworksContest = (contestId) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/artwork-contest/contest/${contestId}`)
      .then((res) => {
        dispatch({ type: GET_ARTWORKS_CONTEST, payload: { contestId, artworks: res.data } });
      })
      .catch((err) => console.log(err));
  };
};

// Liker une œuvre d'art d'un concours
export const likeContestArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/like-artwork-contest/${artworkId}`,
      data: { id: userId },
    })
      .then((res) => {
        console.log("Like response:", res.data); // Ajout d'un log pour la réponse
        dispatch({ type: LIKE_CONTEST_ARTWORK, payload: { artworkId, userId } });
      })
      .catch((err) => console.log("Error liking artwork:", err));
  };
};


// Unliker une œuvre d'art d'un concours
export const unlikeContestArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/unlike-artwork-contest/${artworkId}`,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: UNLIKE_CONTEST_ARTWORK, payload: { artworkId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

// Mettre à jour une œuvre d'art de concours
export const updateContestArtwork = (artworkId, description) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/${artworkId}`,
      data: { description },
    })
      .then((res) => {
        dispatch({ type: UPDATE_CONTEST_ARTWORK, payload: { description, artworkId } });
      })
      .catch((err) => console.log(err));
  };
};

// Supprimer une œuvre d'art de concours
export const deleteContestArtwork = (artworkId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/${artworkId}`,
    })
      .then((res) => {
        dispatch({ type: DELETE_CONTEST_ARTWORK, payload: { artworkId } });
      })
      .catch((err) => console.log(err));
  };
};

// Ajouter un commentaire sur une œuvre d'art de concours
export const addCommentContestArtwork = (artworkId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/comment-artwork-contest/${artworkId}`,
      data: { commenterId, text, commenterPseudo },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENT_CONTEST_ARTWORK, payload: { artworkId } });
      })
      .catch((err) => console.log(err));
  };
};

// Modifier un commentaire sur une œuvre d'art de concours
export const editCommentContestArtwork = (artworkId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/edit-comment-artwork-contest/${artworkId}`,
      data: { commentId, text },
    })
      .then((res) => {
        dispatch({ type: EDIT_COMMENT_CONTEST_ARTWORK, payload: { artworkId, commentId, text } });
      })
      .catch((err) => console.log(err));
  };
};

// Supprimer un commentaire sur une œuvre d'art de concours
export const deleteCommentContestArtwork = (artworkId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/delete-comment-artwork-contest/${artworkId}`,
      data: { commentId },
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT_CONTEST_ARTWORK, payload: { artworkId, commentId } });
      })
      .catch((err) => console.log(err));
  };
};