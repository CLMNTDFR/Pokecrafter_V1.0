import React from 'react';
import { NavLink } from 'react-router-dom';

const LeftNav = () => {
    return (
        <div className="left-nav-container">
            <div className="icons">
                <div className="icons-bis">
                    <NavLink to='/' className={({ isActive }) => isActive ? "active-left-nav" : ""}>
                        <img src="./img/icons/house2.svg" alt="home" />
                    </NavLink>
                    <br />
                    <NavLink to='/contest' className={({ isActive }) => isActive ? "active-left-nav" : ""}>
                        <img src="./img/icons/trophy2.svg" alt="contest" />
                    </NavLink>
                    <br />
                    <NavLink to='/add' className={({ isActive }) => isActive ? "active-left-nav" : ""}>
                        <img src="./img/icons/add3.svg" alt="add" />
                    </NavLink>
                    <br />
                    <NavLink to='/trending' className={({ isActive }) => isActive ? "active-left-nav" : ""}>
                        <img src="./img/icons/fire2.svg" alt="trending" />
                    </NavLink>
                    <br />
                    <NavLink to='/profil' className={({ isActive }) => isActive ? "active-left-nav" : ""}>
                        <img src="./img/icons/user3.svg" alt="user" />
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;
