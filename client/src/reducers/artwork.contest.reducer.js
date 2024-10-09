import {
  GET_CONTEST_ARTWORKS,
  LIKE_CONTEST_ARTWORK,
  UNLIKE_CONTEST_ARTWORK,
  ADD_COMMENT_CONTEST_ARTWORK,
  EDIT_COMMENT_CONTEST_ARTWORK,
  DELETE_COMMENT_CONTEST_ARTWORK,
  UPDATE_CONTEST_ARTWORK,
  DELETE_CONTEST_ARTWORK,
  GET_ARTWORKS_CONTEST,
} from "../actions/artwork.contest.actions";

const initialState = [];

export default function artworkContestReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTEST_ARTWORKS:
      return action.payload;

    case LIKE_CONTEST_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? { ...artwork, likers: [...artwork.likers, action.payload.userId] }
          : artwork
      );

    case UNLIKE_CONTEST_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? {
              ...artwork,
              likers: artwork.likers.filter(
                (id) => id !== action.payload.userId
              ),
            }
          : artwork
      );

    case UPDATE_CONTEST_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? { ...artwork, description: action.payload.description }
          : artwork
      );

    case DELETE_CONTEST_ARTWORK:
      return state.filter(
        (artwork) => artwork._id !== action.payload.artworkId
      );

    case ADD_COMMENT_CONTEST_ARTWORK:
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
          };
        }
        return artwork;
      });

    case EDIT_COMMENT_CONTEST_ARTWORK:
      return state.map((artwork) => {
        if (artwork._id === action.payload.artworkId) {
          return {
            ...artwork,
            comments: artwork.comments.map((comment) => {
              if (comment._id === action.payload.commentId) {
                return { ...comment, text: action.payload.text };
              }
              return comment;
            }),
          };
        }
        return artwork;
      });

    case DELETE_COMMENT_CONTEST_ARTWORK:
      return state.map((artwork) => {
        if (artwork._id === action.payload.artworkId) {
          return {
            ...artwork,
            comments: artwork.comments.filter(
              (comment) => comment._id !== action.payload.commentId
            ),
          };
        }
        return artwork;
      });

    case GET_ARTWORKS_CONTEST:
      return {
        ...state,
        [action.payload.contestId]: action.payload.artworks, // Stocker les artworks par contestId
      };

    default:
      return state;
  }
}
