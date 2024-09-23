import axios from "axios";

// Artworks
export const GET_ARTWORKS = "GET_ARTWORKS";

export const getArtworks = () => {
    return (dispatch) => {
        return axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/artwork/`,
            data: {}
        })
        .then((res) => {
            dispatch({ type: GET_ARTWORKS, payload: res.data });
        })
        .catch((err) => console.log(err));
    };
};
