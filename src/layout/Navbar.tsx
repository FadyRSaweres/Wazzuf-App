import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Menu from "../assets/icons/Menu";
export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <h2>JobsNow</h2>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Menu />
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li>
              <NavLink to="/" onClick={() => setShowNavbar(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" onClick={() => setShowNavbar(false)}>
                Search
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" onClick={() => setShowNavbar(false)}>
                History
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
