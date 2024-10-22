import axios from "axios";

export const GET_CONTESTS = "GET_CONTESTS";
export const GET_ALL_CONTESTS = "GET_ALL_CONTESTS";
export const ADD_CONTEST = "ADD_CONTEST";
export const UPDATE_CONTEST = "UPDATE_CONTEST";
export const DELETE_CONTEST = "DELETE_CONTEST";
export const GET_CONTEST_ERRORS = "GET_CONTEST_ERRORS";
export const SET_SELECTED_CONTEST_ID = "SET_SELECTED_CONTEST_ID";

// Action to get a specific contest by ID
export const getContest = (contestId) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/contests/${contestId}`)
      .then((res) => {
        dispatch({ type: GET_CONTESTS, payload: res.data });
      });
  };
};

// Action to get all contests
export const getAllContests = () => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/contests/`)
      .then((res) => {
        dispatch({ type: GET_ALL_CONTESTS, payload: res.data });
      });
  };
};

// Action to add a new contest
export const addContest = (data) => {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/contests/create`, data, {
        withCredentials: true, // Ensure cookies are sent
      })
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_CONTEST_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_CONTEST_ERRORS, payload: "" });
        }
      });
  };
};

// Action to update an existing contest
export const updateContest = (contestId, data) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/contests/` + contestId,
      data,
    }).then((res) => {
      dispatch({ type: UPDATE_CONTEST, payload: { data, contestId } });
    });
  };
};

// Action to delete a contest
export const deleteContest = (contestId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/contests/` + contestId,
    }).then((res) => {
      dispatch({ type: DELETE_CONTEST, payload: { contestId } });
    });
  };
};

// New action to set the selected contest ID
export const setSelectedContestId = (contestId) => ({
  type: SET_SELECTED_CONTEST_ID,
  payload: contestId,
});
