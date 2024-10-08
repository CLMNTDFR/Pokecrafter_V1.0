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
                    <NavLink to="/">
                        <div className="logo">
                            <img src="./img/icon.svg" alt="icon" />
                        </div>
                    </NavLink>
                </div>
                <ul>
                    {uid ? (
                        <>
                            <li className="welcome">
                                <NavLink to="/profil">
                                    <h5>{userData.username}</h5>
                                </NavLink>
                            </li>
                            <Logout />
                        </>
                    ) : (
                        <li className="login-icon">
                            <NavLink to="/profil">
                                <img src="./img/icons/login2.svg" alt="login" />
                            </NavLink>
                        </li>
                    )}
                    <li className="search-icon">
                        <NavLink to="/artist">
                            <img src="./img/icons/search2.svg" alt="search" />
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
