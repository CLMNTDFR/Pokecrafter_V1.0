import {
  GET_CONTESTS,
  GET_ALL_CONTESTS,
  ADD_CONTEST,
  UPDATE_CONTEST,
  DELETE_CONTEST,
} from "../actions/contest.actions";

const initialState = [];

export default function contestReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTESTS:
      return action.payload;

    case GET_ALL_CONTESTS:
      return action.payload;

    case ADD_CONTEST:
      return [...state, action.payload];

    case UPDATE_CONTEST:
      return state.map((contest) =>
        contest._id === action.payload.contestId
          ? { ...contest, ...action.payload.data }
          : contest
      );

    case DELETE_CONTEST:
      return state.filter(
        (contest) => contest._id !== action.payload.contestId
      );

    default:
      return state;
  }
}
