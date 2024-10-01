import { GET_ARTWORKS, LIKE_ARTWORK, UNLIKE_ARTWORK } from "../actions/artwork.actions";

const initialState = {};

export default function artworkReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ARTWORKS:
      return action.payload;

    case LIKE_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? { ...artwork, likers: [...artwork.likers, action.payload.userId] }
          : artwork
      );

    case UNLIKE_ARTWORK:
      return state.map((artwork) =>
        artwork._id === action.payload.artworkId
          ? {
              ...artwork,
              likers: artwork.likers.filter((id) => id !== action.payload.userId),
            }
          : artwork
      );

    default:
      return state;
  }
}
