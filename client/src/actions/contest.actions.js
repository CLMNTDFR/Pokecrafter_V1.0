import axios from "axios";

export const GET_CONTESTS = "GET_CONTESTS";
export const GET_ALL_CONTESTS = "GET_ALL_CONTESTS";
export const ADD_CONTEST = "ADD_CONTEST";
export const UPDATE_CONTEST = "UPDATE_CONTEST";
export const DELETE_CONTEST = "DELETE_CONTEST";
export const GET_CONTEST_ERRORS = "GET_CONTEST_ERRORS";
export const SET_SELECTED_CONTEST_ID = "SET_SELECTED_CONTEST_ID";

// Action pour obtenir un contest spécifique par ID
export const getContest = (contestId) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/contests/${contestId}`)
      .then((res) => {
        dispatch({ type: GET_CONTESTS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

// Action pour obtenir tous les contests
export const getAllContests = () => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/contests/`)
      .then((res) => {
        console.log("API response:", res.data);
        dispatch({ type: GET_ALL_CONTESTS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

// Action pour ajouter un nouveau contest
export const addContest = (data) => {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/contests/create`, data, {
        withCredentials: true, // Assurez-vous que les cookies sont envoyés
      })
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_CONTEST_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_CONTEST_ERRORS, payload: "" });
        }
      })
      .catch((err) => console.log(err));
  };
};



// Action pour mettre à jour un contest existant
export const updateContest = (contestId, data) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/contests/` + contestId,
      data,
    })
      .then((res) => {
        dispatch({ type: UPDATE_CONTEST, payload: { data, contestId } });
      })
      .catch((err) => console.log(err));
  };
};

// Action pour supprimer un contest
export const deleteContest = (contestId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/contests/` + contestId,
    })
      .then((res) => {
        dispatch({ type: DELETE_CONTEST, payload: { contestId } });
      })
      .catch((err) => console.log(err));
  };
};

// Nouvelle action pour définir l'ID du contest sélectionné
export const setSelectedContestId = (contestId) => ({
  type: SET_SELECTED_CONTEST_ID,
  payload: contestId,
});
