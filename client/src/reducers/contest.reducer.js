import {
  GET_CONTESTS,
  GET_ALL_CONTESTS,
  ADD_CONTEST,
  UPDATE_CONTEST,
  DELETE_CONTEST,
  SET_SELECTED_CONTEST_ID,
} from "../actions/contest.actions";

const initialState = {
  contests: [], // Assurez-vous que ceci reste un tableau
  selectedContestId: null, // Utilisé pour stocker l'ID du contest sélectionné
};

export default function contestReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONTESTS:
      return {
        ...state,
        contests: Array.isArray(action.payload) ? action.payload : [action.payload],
      };

    case GET_ALL_CONTESTS:
      return {
        ...state,
        contests: Array.isArray(action.payload) ? action.payload : state.contests,
      };

    case ADD_CONTEST:
      return {
        ...state,
        contests: [...state.contests, action.payload],
      };

    case UPDATE_CONTEST:
      return {
        ...state,
        contests: state.contests.map((contest) =>
          contest._id === action.payload.contestId
            ? { ...contest, ...action.payload.data }
            : contest
        ),
      };

    case DELETE_CONTEST:
      return {
        ...state,
        contests: state.contests.filter(
          (contest) => contest._id !== action.payload.contestId
        ),
      };

    case SET_SELECTED_CONTEST_ID:
      return {
        ...state,
        selectedContestId: action.payload,
      };

    default:
      return state;
  }
}
