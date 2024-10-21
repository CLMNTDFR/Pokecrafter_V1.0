import {
  UNFOLLOW_USER,
  FOLLOW_USER,
  GET_USER,
  UPDATE_BIO,
  UPLOAD_PICTURE,
  DELETE_USER,
} from "../actions/user.actions";

const initialState = {};

// Reducer for user actions
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case UPLOAD_PICTURE:
      return {
        ...state,
        picture: action.payload,
      };
    case UPDATE_BIO:
      return {
        ...state,
        bio: action.payload,
      };
    case FOLLOW_USER:
      return {
        ...state,
        following: [action.payload.idToFollow, ...state.following],
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        following: state.following.filter(
          (id) => id !== action.payload.idToUnfollow
        ),
      };
    case DELETE_USER:
      return initialState;
    default:
      return state;
  }
}
