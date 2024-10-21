import {
  GET_ARTWORKS,
  GET_ALL_ARTWORKS,
  LIKE_ARTWORK,
  UNLIKE_ARTWORK,
  UPDATE_ARTWORK,
  DELETE_ARTWORK,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from "../actions/artwork.actions";

const initialState = [];

// Reducer for artwork actions
export default function artworkReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ARTWORKS:
      return action.payload; // Set state to fetched artworks

    case GET_ALL_ARTWORKS:
      return action.payload; // Set state to all artworks

    case LIKE_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? { ...artwork, likers: [...artwork.likers, action.payload.userId] }
          : artwork
      ); // Add user ID to likers of the artwork

    case UNLIKE_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? {
              ...artwork,
              likers: artwork.likers.filter(
                (id) => id !== action.payload.userId
              ),
            }
          : artwork
      ); // Remove user ID from likers of the artwork

    case UPDATE_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? { ...artwork, description: action.payload.description }
          : artwork
      ); // Update artwork description

    case DELETE_ARTWORK:
      return state.filter(
        (artwork) => artwork._id !== action.payload.artworkId
      ); // Remove artwork from state

    case ADD_COMMENT:
      return state.map((artwork) => {
        if (artwork._id === action.payload.artworkId) {
          return {
            ...artwork,
            comments: [
              ...artwork.comments,
              {
                _id: action.payload.comment._id,
                commenterId: action.payload.comment.commenterId,
                commenterPseudo: action.payload.comment.commenterPseudo,
                text: action.payload.comment.text,
                timestamp: action.payload.comment.timestamp,
              },
            ],
          }; // Add comment to artwork
        }
        return artwork;
      });

    case EDIT_COMMENT:
      return state.map((artwork) => {
        if (artwork._id === action.payload.artworkId) {
          return {
            ...artwork,
            comments: artwork.comments.map((comment) => {
              if (comment._id === action.payload.commentId) {
                return { ...comment, text: action.payload.text }; // Update comment text
              }
              return comment;
            }),
          };
        }
        return artwork;
      });

    case DELETE_COMMENT:
      return state.map((artwork) => {
        if (artwork._id === action.payload.artworkId) {
          return {
            ...artwork,
            comments: artwork.comments.filter(
              (comment) => comment._id !== action.payload.commentId
            ), // Remove comment from artwork
          };
        }
        return artwork;
      });

    default:
      return state; // Return current state if action type is unrecognized
  }
}
