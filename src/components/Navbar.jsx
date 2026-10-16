import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
        <NavLink to = "/" className="brand">Evntly</NavLink>
        <div className = "nav-links">
            <NavLink to = "/events">Events</NavLink>
            <NavLink to = "/my-events">My Events</NavLink>
            <NavLink to = "/login">Login</NavLink>
            <NavLink to = "/register">Register</NavLink>
        </div>
    </nav>
  );
}