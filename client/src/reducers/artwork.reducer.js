
const initialState = {};

export default function artworkReducer(state = initialState, action) {
    switch (action.type) {
        case "GET_ARTWORKS":
            return action.payload;
        default:
            return state;
        }
    }