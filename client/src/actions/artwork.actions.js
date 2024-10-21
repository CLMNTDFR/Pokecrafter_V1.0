import axios from "axios";

export const GET_ARTWORKS = "GET_ARTWORKS";
export const GET_ALL_ARTWORKS = "GET_ALL_ARTWORKS";
export const ADD_ARTWORK = "ADD_ARTWORK";
export const LIKE_ARTWORK = "LIKE_ARTWORK";
export const UNLIKE_ARTWORK = "UNLIKE_ARTWORK";
export const UPDATE_ARTWORK = "UPDATE_ARTWORK";
export const DELETE_ARTWORK = "DELETE_ARTWORK";

export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

export const GET_ARTWORK_ERRORS = "GET_ARTWORK_ERRORS";

export const GET_TRENDS = "GET_TRENDS";

// Fetch limited number of artworks
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

// Fetch all artworks
export const getAllArtworks = () => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/artwork/`)
      .then((res) => {
        dispatch({ type: GET_ALL_ARTWORKS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

// Add a new artwork
export const addArtwork = (data) => {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/artwork/`, data)
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: "GET_ARTWORK_ERRORS", payload: res.data.errors });
        } else {
          dispatch({ type: "GET_ARTWORK_ERRORS", payload: res.data });
        }
      });
  };
};

// Like an artwork
export const likeArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url:
        `${process.env.REACT_APP_API_URL}api/artwork/like-artwork/` + artworkId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: LIKE_ARTWORK, payload: { artworkId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

// Unlike an artwork
export const unlikeArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url:
        `${process.env.REACT_APP_API_URL}api/artwork/unlike-artwork/` +
        artworkId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: UNLIKE_ARTWORK, payload: { artworkId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

// Update an artwork description
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

// Delete an artwork
export const deleteArtwork = (artworkId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/artwork/` + artworkId,
    })
      .then((res) => {
        dispatch({ type: DELETE_ARTWORK, payload: { artworkId } });
      })
      .catch((err) => {
        console.error("Error deleting artwork:", err);
      });
  };
};

// Add a comment to an artwork
export const addComment = (artworkId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url:
        `${process.env.REACT_APP_API_URL}api/artwork/comment-artwork/` +
        artworkId,
      data: { commenterId, text, commenterPseudo },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENT, payload: { artworkId } });
      })
      .catch((err) => console.log(err));
  };
};

// Edit a comment on an artwork
export const editComment = (artworkId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url:
        `${process.env.REACT_APP_API_URL}api/artwork/edit-comment-artwork/` +
        artworkId,
      data: { commentId, text },
    })
      .then((res) => {
        dispatch({
          type: EDIT_COMMENT,
          payload: { artworkId, commentId, text },
        });
      })
      .catch((err) => console.log(err));
  };
};

// Delete a comment from an artwork
export const deleteComment = (artworkId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url:
        `${process.env.REACT_APP_API_URL}api/artwork/delete-comment-artwork/` +
        artworkId,
      data: { commentId },
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { artworkId, commentId } });
      })
      .catch((err) => console.log(err));
  };
};

// Get trending artworks
export const getTrends = (sortedArray) => {
  return (dispatch) => {
    dispatch({ type: GET_TRENDS, payload: sortedArray });
  };
};
