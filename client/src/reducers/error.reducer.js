const initialState = {artworkError: []};

export default function errorReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_ARTWORK_ERRORS':
            return {
                artworkError: action.payload,
                userError: []
            };
        case 'GET_USER_ERRORS':
            return {
                userError: action.payload,
                artworkError: []
            };
        default:
            return state;
    }
}