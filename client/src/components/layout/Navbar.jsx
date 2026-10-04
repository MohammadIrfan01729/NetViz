import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";


function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  const handleLogout =
    () => {
      setMenuOpen(false);

      logout();

      navigate("/", {
        replace: true,
      });
    };


  const initials =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  return (
    <header className="navbar">

      <div className="brand">
        <img
          src="/assets/netviz-banner.png"
          alt="NetViz"
          className="navbar-brand-image"
        />
      </div>


      <div className="navbar-title">
        Interactive Network Routing &amp;
        Packet Flow Simulator
      </div>


      <div className="navbar-actions">

        <div className="profile-menu">

          <button
            type="button"
            className="profile-menu-button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            aria-label="Open profile menu"
          >

            <span className="profile-menu-avatar">
              {initials}
            </span>

            <span className="profile-menu-name">
              {user?.name ||
                "User"}
            </span>

            <span className="profile-menu-arrow">
              ▾
            </span>

          </button>


          {menuOpen && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-user">

                <strong>
                  {user?.name}
                </strong>

                <span>
                  {user?.email}
                </span>

              </div>


              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);

                  navigate(
                    "/profile"
                  );
                }}
              >
                Profile
              </button>


              <button
                type="button"
                className="profile-logout"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}


export default Navbar;