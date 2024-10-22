import React from "react";
import axios from "axios";
import cookie from "js-cookie";

const Logout = () => {
  // Remove cookie from the browser
  const removeCookie = (key) => {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  };

  // Handle user logout
  const logout = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/user/logout`,
      withCredentials: true,
    })
      .then(() => removeCookie("jwt"))
      .catch(() => {});
    
    window.location = "/";
  };

  return (
    <li onClick={logout}>
      <img src="./img/icons/pokecrafter-logout2.svg" alt="logout" />
    </li>
  );
};

export default Logout;
