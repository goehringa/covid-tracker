import React from "react";
import { Link } from "react-router-dom";

const navigationLinks = [
  {
    title: "Alex Goehring",
    path: "/",
  },
];

function Navigation() {
  return (
    <nav className="navigation">
      <span className="title">COVID-19 Tracker</span>
      <div className="content-container">
        <ul>
          {navigationLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
