import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";

const Navbar = () => {
    const uid = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer);

  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink exact to="/">
            <div className="logo">
              <img src="./img/icon.svg" alt="icon" />
            </div>
          </NavLink>
        </div>
        {uid ? (
            <ul>
                <li></li>
                <li className="welcome">
                    <NavLink exact to="/profil">
                    <h5>{userData.username}</h5>
                    </NavLink>
                </li>
                <Logout />
            </ul>
        ) : (
            <ul>
                <li></li>
                <li>
                    <NavLink exact to="/profil">
                    <li className="welcome"></li>
                        <img src="./img/icons/login.svg" alt="login" />
                    </NavLink>
                </li>
            </ul>
        )}
        </div>
    </nav>
  );
};

export default Navbar;
