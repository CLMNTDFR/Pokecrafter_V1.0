import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";

const MessageButton = () => {
  const uid = useContext(UidContext); // Contexte utilisateur (connecté ou non)

  // Si l'utilisateur est connecté, on affiche le bouton. Sinon, on retourne null (rien).
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

