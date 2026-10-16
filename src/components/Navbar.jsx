import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate('/');
  }


  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">Evntly</NavLink>
      <div className="nav-links">
        <NavLink to="/events">Events</NavLink>
        {currentUser ? (
          <>
            <NavLink to="/my-events">My Events</NavLink>
            <span>Hi, {currentUser.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}