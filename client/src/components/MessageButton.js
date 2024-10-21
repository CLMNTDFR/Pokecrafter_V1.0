import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";

const MessageButton = () => {
  const uid = useContext(UidContext);

  // If the user is logged in, display the button. Otherwise, return null (nothing).
  if (!uid) return null;

  return (
    <NavLink to="/messages">
      <div className="message-box-nav-logo">
        <img src="./img/icons/pokecrafter-messenger.svg" alt="message-box-icon" />
      </div>
    </NavLink>
  );
};

export default MessageButton;

