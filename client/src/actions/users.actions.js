import axios from "axios";

// Action Types
export const GET_USERS = "GET_USERS";

// Fetch all users
export const getUsers = () => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/user`)
      .then((res) => {
        // Dispatch the action with the fetched user data
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch((err) => console.error("Error fetching users:", err)); // Log errors to the console
  };
};
