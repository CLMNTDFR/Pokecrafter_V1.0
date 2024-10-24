import axios from "axios";

export const GET_CONTEST_ARTWORKS = "GET_CONTEST_ARTWORKS";
export const ADD_CONTEST_ARTWORK = "ADD_CONTEST_ARTWORK";
export const LIKE_CONTEST_ARTWORK = "LIKE_CONTEST_ARTWORK";
export const UNLIKE_CONTEST_ARTWORK = "UNLIKE_CONTEST_ARTWORK";
export const UPDATE_CONTEST_ARTWORK = "UPDATE_CONTEST_ARTWORK";
export const DELETE_CONTEST_ARTWORK = "DELETE_CONTEST_ARTWORK";
export const GET_ARTWORKS_CONTEST = "GET_ARTWORKS_CONTEST";
export const ADD_COMMENT_CONTEST_ARTWORK = "ADD_COMMENT_CONTEST_ARTWORK";
export const EDIT_COMMENT_CONTEST_ARTWORK = "EDIT_COMMENT_CONTEST_ARTWORK";
export const DELETE_COMMENT_CONTEST_ARTWORK = "DELETE_COMMENT_CONTEST_ARTWORK";

// Fetch artworks for a specific contest
export const getArtworksContest = (contestId) => {
  return (dispatch) => {
    return axios
      .get(
        `${process.env.REACT_APP_API_URL}api/artwork-contest/contest/${contestId}`
      )
      .then((res) => {
        dispatch({
          type: GET_ARTWORKS_CONTEST,
          payload: { contestId, artworks: res.data },
        });
      })
      .catch((err) => console.log(err));
  };
};

// Utility function to generate title and description for artwork
const generateTitleAndDescription = (posterId, contestId) => {
  const dateNow = Date.now();
  const prefix = "Pokecrafter_contest_";
  const uniqueString = `${posterId}_${contestId}_${dateNow}`;

  const title = `${prefix}${uniqueString}`;
  const description = `${prefix}${uniqueString}`;

  return { title, description };
};

// Action to add artwork to a contest
export const addArtworkContest = (data) => {
  return (dispatch) => {
    // Check for posterId and contestId presence
    const posterId = data.get("posterId");
    const contestId = data.get("contestId");
    if (!posterId || !contestId) {
      console.error("posterId or contestId is missing.");
      return;
    }

    // Generate title and description automatically
    const { title, description } = generateTitleAndDescription(posterId, contestId);

    // Append generated fields to FormData
    data.append("title", title);
    data.append("description", description);

    // Send POST request to API
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/artwork-contest/`, data)
      .then((res) => {
        const { contestId, ...artworkData } = res.data;

        dispatch({
          type: ADD_CONTEST_ARTWORK,
          payload: {
            contestId: data.get("contestId") || contestId,
            artwork: artworkData,
          },
        });
      })
      .catch((err) => {
        console.error("Error posting artwork contest:", err);
      });
  };
};

// Like a contest artwork
export const likeContestArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/like-artwork-contest/${artworkId}`,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({
          type: LIKE_CONTEST_ARTWORK,
          payload: { artworkId, userId },
        });
      })
      .catch((err) => console.log("Error liking artwork:", err));
  };
};

// Unlike a contest artwork
export const unlikeContestArtwork = (artworkId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/unlike-artwork-contest/${artworkId}`,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({
          type: UNLIKE_CONTEST_ARTWORK,
          payload: { artworkId, userId },
        });
      })
      .catch((err) => console.log(err));
  };
};

// Update a contest artwork description
export const updateContestArtwork = (artworkId, description) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/${artworkId}`,
      data: { description },
    })
      .then((res) => {
        dispatch({
          type: UPDATE_CONTEST_ARTWORK,
          payload: { description, artworkId },
        });
      })
      .catch((err) => console.log(err));
  };
};

// Delete a contest artwork
export const deleteContestArtwork = (artworkId, contestId) => {
  return (dispatch) => {
    return axios
      .delete(`${process.env.REACT_APP_API_URL}api/artwork-contest/${artworkId}`)
      .then((res) => {
        dispatch({
          type: DELETE_CONTEST_ARTWORK,
          payload: { artworkId, contestId }, // Add contestId to payload
        });
      })
      .catch((err) => {
        console.log("Error deleting artwork:", err);
      });
  };
};

// Add a comment to a contest artwork
export const addCommentContestArtwork = (
  artworkId,
  commenterId,
  text,
  commenterPseudo
) => {
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

// Edit a comment on a contest artwork
export const editCommentContestArtwork = (artworkId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/edit-comment-artwork-contest/${artworkId}`,
      data: { commentId, text },
    })
      .then((res) => {
        dispatch({
          type: EDIT_COMMENT_CONTEST_ARTWORK,
          payload: { artworkId, commentId, text },
        });
      })
      .catch((err) => console.log(err));
  };
};

// Delete a comment from a contest artwork
export const deleteCommentContestArtwork = (artworkId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/artwork-contest/delete-comment-artwork-contest/${artworkId}`,
      data: { commentId },
    })
      .then((res) => {
        dispatch({
          type: DELETE_COMMENT_CONTEST_ARTWORK,
          payload: { artworkId, commentId },
        });
      })
      .catch((err) => console.log(err));
  };
};
