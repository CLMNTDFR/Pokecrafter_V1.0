import { GET_ARTWORKS, LIKE_ARTWORK, UNLIKE_ARTWORK } from "../actions/artwork.actions";

const initialState = {};

export default function artworkReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ARTWORKS:
            return action.payload;
        case LIKE_ARTWORK:
            return state.map((artwork) => {
                if (artwork._id === action.payload.artworkId) {
                    return {
                        ...artwork,
                        likers: [action.payload.userId, ...artwork.likers],
                    };
                }
                return artwork;
            });
        case UNLIKE_ARTWORK:
            return state.map((artwork) => {
                if (artwork._id === action.payload.artworkId) {
                    return {
                        ...artwork,
                        likers: artwork.likers.filter((id) => id !== action.payload.userId),
                    };
                }
                return artwork;
            });
        default:
            return state;
        }
    }