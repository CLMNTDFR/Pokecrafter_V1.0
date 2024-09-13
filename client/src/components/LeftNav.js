import React from 'react';
import { NavLink } from 'react-router-dom';

const LeftNav = () => {
    return (
        <div className="left-nav-container">
            <div className="icons">
                <div className="icons-bis">
                    <NavLink to='/' exact activeClassName="active-left-nav">
                        <img src="./img/icons/house.svg" alt="home"/>
                    </NavLink>
                    <br/>
                    <NavLink to='/contest' exact activeClassName="active-left-nav">
                        <img src="./img/icons/trophy.svg" alt="contest"/>
                    </NavLink>
                    <br/>
                    <NavLink to='/add' exact activeClassName="active-left-nav">
                        <img src="./img/icons/add2.svg" alt="contest"/>
                    </NavLink>
                    <br/>
                    <NavLink to='/trending' exact activeClassName="active-left-nav">
                        <img src="./img/icons/fire.svg" alt="trending"/>
                    </NavLink>
                    <br/>
                    <NavLink to='/profil' exact activeClassName="active-left-nav">
                        <img src="./img/icons/user2.svg" alt="user"/>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;