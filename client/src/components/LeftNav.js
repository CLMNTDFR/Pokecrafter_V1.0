import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LeftNav = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    const links = [
        { to: '/', imgSrc: './img/icons/house2.svg', alt: 'home', description: 'Home' },
        { to: '/contest', imgSrc: './img/icons/trophy2.svg', alt: 'contest', description: 'Contest' },
        { to: '/add', imgSrc: './img/icons/add3.svg', alt: 'add', description: 'Add' },
        { to: '/trending', imgSrc: './img/icons/fire2.svg', alt: 'trending', description: 'Trending' },
        { to: '/profil', imgSrc: './img/icons/user3.svg', alt: 'user', description: 'Profile' },
    ];

    const handleMouseEnter = (index) => {
        const icon = document.getElementById(`nav-icon-${index}`);
        const rect = icon.getBoundingClientRect();
        setPopupPosition({
            top: rect.top + window.scrollY + rect.height / 2,
            left: rect.right + 10,
        });
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <div className="left-nav-container">
            <div className="icons">
                <div className="icons-bis">
                    {links.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            className={({ isActive }) => (isActive ? "active-left-nav" : "")}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img id={`nav-icon-${index}`} src={link.imgSrc} alt={link.alt} />
                        </NavLink>
                    ))}
                </div>

                {hoveredIndex !== null && (
                    <div
                        className="nav-popup-container"
                        style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
                    >
                        {links[hoveredIndex].description}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftNav;
