import React from 'react';
import { NavLink } from 'react-router-dom'
import './Navbar.css'
const Navbar = () => {
    return (
        <nav className="nav-bar">
            <ul>
                <li className = "header">
                    <NavLink to="/">Path Pilot</NavLink>
                </li>
                <li className = "logo">
                </li>
                <li>
                    <NavLink to="/planning">Path Planning</NavLink>
                </li>
                <li>
                    <NavLink to="/login">Login</NavLink>
                </li>
            </ul>
        </nav>
    )
};

export default Navbar;