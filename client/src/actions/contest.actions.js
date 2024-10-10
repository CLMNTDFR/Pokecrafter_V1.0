import axios from "axios";

// Actions pour les contests
export const GET_CONTESTS = "GET_CONTESTS";
export const GET_ALL_CONTESTS = "GET_ALL_CONTESTS";
export const ADD_CONTEST = "ADD_CONTEST";
export const UPDATE_CONTEST = "UPDATE_CONTEST";
export const DELETE_CONTEST = "DELETE_CONTEST";
export const GET_CONTEST_ERRORS = "GET_CONTEST_ERRORS";

// Obtenir un concours spécifique par son ID
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

  export const getAllContests = () => {
    return (dispatch) => {
      return axios
        .get(`${process.env.REACT_APP_API_URL}api/contests/`)
        .then((res) => {
          console.log("API response:", res.data); // Ajoutez ce log pour vérifier
          dispatch({ type: GET_ALL_CONTESTS, payload: res.data });
        })
        .catch((err) => console.log(err));
    };
  };
  

// Ajouter un nouveau concours
export const addContest = (data) => {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/contests/`, data)
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_CONTEST_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_CONTEST_ERRORS, payload: "" });
        }
      });
  };
};

// Mettre à jour un concours
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

// Supprimer un concours
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