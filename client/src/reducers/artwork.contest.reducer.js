import {
  GET_CONTEST_ARTWORKS,
  ADD_CONTEST_ARTWORK,
  LIKE_CONTEST_ARTWORK,
  UNLIKE_CONTEST_ARTWORK,
  ADD_COMMENT_CONTEST_ARTWORK,
  EDIT_COMMENT_CONTEST_ARTWORK,
  DELETE_COMMENT_CONTEST_ARTWORK,
  UPDATE_CONTEST_ARTWORK,
  DELETE_CONTEST_ARTWORK,
  GET_ARTWORKS_CONTEST,
} from "../actions/artwork.contest.actions";

const initialState = {};

// Reducer for contest artwork actions
export default function artworkContestReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTEST_ARTWORKS:
      return {
        ...state,
        [action.payload.contestId]: action.payload.artworks || [],
      };

    case ADD_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]: [
          ...(state[action.payload.contestId] || []),
          action.payload.artwork,
        ],
      };

    case LIKE_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]:
          state[action.payload.contestId]?.map((artwork) =>
            artwork._id === action.payload.artworkId
              ? {
                  ...artwork,
                  likers: [...artwork.likers, action.payload.userId],
                }
              : artwork
          ) || [],
      };

    case UNLIKE_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]:
          state[action.payload.contestId]?.map((artwork) =>
            artwork._id === action.payload.artworkId
              ? {
                  ...artwork,
                  likers: artwork.likers.filter(
                    (id) => id !== action.payload.userId
                  ),
                }
              : artwork
          ) || [],
      };

    case UPDATE_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]:
          state[action.payload.contestId]?.map((artwork) =>
            artwork._id === action.payload.artworkId
              ? { ...artwork, description: action.payload.description }
              : artwork
          ) || [],
      };

    case DELETE_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]: state[action.payload.contestId]?.filter(
          (artwork) => artwork._id !== action.payload.artworkId
        ) || [],
      };

    case ADD_COMMENT_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]:
          state[action.payload.contestId]?.map((artwork) => {
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
          }) || [],
      };

    case EDIT_COMMENT_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]:
          state[action.payload.contestId]?.map((artwork) => {
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
          }) || [],
      };

    case DELETE_COMMENT_CONTEST_ARTWORK:
      return {
        ...state,
        [action.payload.contestId]:
          state[action.payload.contestId]?.map((artwork) => {
            if (artwork._id === action.payload.artworkId) {
              return {
                ...artwork,
                comments: artwork.comments.filter(
                  (comment) => comment._id !== action.payload.commentId
                ),
              };
            }
            return artwork;
          }) || [],
      };

    case GET_ARTWORKS_CONTEST:
      return {
        ...state,
        [action.payload.contestId]: action.payload.artworks || [],
      };

    default:
      return state;
  }
}
