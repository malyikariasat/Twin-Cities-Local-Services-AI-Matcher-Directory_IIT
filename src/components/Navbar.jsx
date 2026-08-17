import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <header className="navbar">

      <div className="logo">
        <Link to="/">
          Twin Cities <span>AI</span>
        </Link>
      </div>

      <nav>

        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/providers">
          Providers
        </NavLink>

        {!token ? (
          <>
            <NavLink to="/login">
              Sign In
            </NavLink>

            <NavLink to="/register">
              Create Account
            </NavLink>
          </>
        ) : (
          <>
            <span className="welcome-user">
              👤 {user?.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </nav>

    </header>
  );
}

export default Navbar;