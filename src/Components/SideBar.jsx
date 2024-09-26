import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SidebarLayout = ({ children }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  let ID = JSON.parse(localStorage.getItem("user"));
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuItemStyle = {
    width: "150%", // Keep the width at 150%
    padding: "0.5rem", // Adjusted padding to keep uniformity
    transition: "background-color 0.3s",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#fff", // Changed text color to white
    boxSizing: "border-box", // Ensure padding is included in the width
    margin: "10px 0", // Negative horizontal margin to offset the width increase
  };
  
  const menuItemHoverStyle = {
    backgroundColor: "lightblue",
  };
  
  const menuItemActiveStyle = {
    backgroundColor: "lightblue",
  };
  
  const getMenuItemStyle = (index) => {
    const baseStyle = { ...menuItemStyle }; // Base style is same for all
    if (activeIndex === index) {
      return { ...baseStyle, ...menuItemActiveStyle };
    }
    if (hoverIndex === index) {
      return { ...baseStyle, ...menuItemHoverStyle };
    }
    return baseStyle; // Return the base style if neither active nor hovered
  };
  
  
  // Set active index based on the current path
  useEffect(() => {
    if (location.pathname === `/operatorDashboard/${ID}` || location.pathname === `/adminDashboard/${ID}`) {
      setActiveIndex(1);
    } else if (location.pathname === "/addProject") {
      setActiveIndex(2);
    } else if (location.pathname === "/viewProjects") {
      setActiveIndex(3);
    } else if (location.pathname === "/donatorList") {
      setActiveIndex(4);
    }
  }, [location, ID]);

  const logout = async () => {
    await fetch(
      `${backendUrl}/logout`,
      {
        method: "POST",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{ backgroundColor: "#1995AD" }}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              {ID === "1" ? (
                <h4 className="text-decoration-none" style={{ color: "inherit", padding: "20px", marginBottom: "40px" }}>
                  <span className="fs-5 d-none d-sm-inline">Admin Panel</span>
                  <hr></hr>
                </h4>
              ) : (
                <h4 className="text-decoration-none" style={{ color: "inherit" }}>
                  <span className="fs-5 d-none d-sm-inline">Nodal Officer <br />Panel</span>
                </h4>
              )}
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <NavLink
                  exact
                  to={ID === "1" ? `/adminDashboard/${ID}` : `/operatorDashboard/${ID}`}
                  className="nav-link align-middle px-0"
                  onClick={() => setActiveIndex(1)}
                  style={getMenuItemStyle(1)}
                  onMouseEnter={() => setHoverIndex(1)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <i className="fs-4 bi-house"></i>
                  <span className="ms-3 d-none d-sm-inline">Dashboard</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  exact
                  to="/addProject"
                  className="nav-link align-middle px-0"
                  onClick={() => setActiveIndex(2)}
                  style={getMenuItemStyle(2)}
                  onMouseEnter={() => setHoverIndex(2)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <i className="fs-4 bi-bar-chart"></i>
                  <span className="ms-3 d-none d-sm-inline">Create Projects</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  exact
                  to="/viewProjects"
                  className="nav-link align-middle px-0"
                  onClick={() => setActiveIndex(3)}
                  style={getMenuItemStyle(3)}
                  onMouseEnter={() => setHoverIndex(3)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <i className="fs-4 bi-table"></i>
                  <span className="ms-3 d-none d-sm-inline">View Projects</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  exact
                  to="/donatorList"
                  className="nav-link align-middle px-0"
                  onClick={() => setActiveIndex(4)}
                  style={getMenuItemStyle(4)}
                  onMouseEnter={() => setHoverIndex(4)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-3 d-none d-sm-inline">Donator List</span>
                </NavLink>
              </li>
            </ul>
            <hr />
            <div className="dropdown pb-4">
              <a
                href="#"
                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="user"
                  width="30"
                  height="30"
                  className="rounded-circle"
                />
                <span className="d-none d-sm-inline mx-1">User</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={logout}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col py-3">
          {/* Render Children Components */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
