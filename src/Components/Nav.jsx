/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { useNavigate, NavLink } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const menuItemStyle = {
  padding: "0px 10px",
  transition: "background-color 0.3s",
  borderRadius: "10px",
};

const menuItemHoverStyle = {
  backgroundColor: "lightblue",
};

const menuItemActiveStyle = {
  backgroundColor: "lightblue",
  // fontWeight: 'bold',
  // color: 'lightblue',
};

const Sidebar = () => {
  let ID = JSON.parse(localStorage.getItem("user"));
  const [hoverIndex, setHoverIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async() => {
    await fetch(
      // "http://localhost:2000/logout",
      `${backendUrl}/logout`,
      {
        method: "POST",
        headers: {
          authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (
      location.pathname === `/operatorDashboard/${ID}` ||
      location.pathname === `/adminDashboard/${ID}`
    ) {
      setActiveIndex(1);
    }else if (location.pathname === "/addProject") {
      setActiveIndex(2);
    } else if (location.pathname === "/viewProjects") {
      setActiveIndex(3);
    }else if (location.pathname === "/donatorList") {
      setActiveIndex(4);
    }
  }, [location]);

  const getMenuItemStyle = (index) => {
    if (activeIndex === index) {
      return { ...menuItemStyle, ...menuItemActiveStyle };
    }
    if (hoverIndex === index) {
      return { ...menuItemStyle, ...menuItemHoverStyle };
    }
    return menuItemStyle;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    const content = document.querySelector(".content");
    if (content) {
      if (!isSidebarOpen) {
        content.style.marginLeft = "12vh";
        content.style.transition = "margin-left 0.3s ease";
      } else {
        content.style.marginLeft = "38vh";
        content.style.transition = "margin-left 0.3s ease";
      }
    }
  };

  return (
    <>
      <div
        classname="sidebar-container"
        style={{
          display: "flex",
          top: "0",
          position: "fixed",
          height: "100vh",
        }}
      >
        <CDBSidebar textColor="#fff" backgroundColor="#1995AD">
          <CDBSidebarHeader
            prefix={
              // <i
              //   className="fa fa-bars fa-large"
              //   style={{ border: "2px solid red" }}
              //   onClick={toggleSidebar}
              // ></i>
              <button
                style={{ paddingTop: "2px", backgroundColor: "transparent" }}
                icon="bars"
                size="lg"
                onClick={toggleSidebar}
              >
                <i className="fa fa-bars fa-lg"></i>
              </button>
            }
          >
            {ID === "1" ? (
              <h4 className="text-decoration-none" style={{ color: "inherit" }}>
                Admin Panel
              </h4>
            ) : (
              <h4 className="text-decoration-none" style={{ color: "inherit" }}>
                Nodal Officer <br/>Panel
              </h4>
            )}
          </CDBSidebarHeader>
          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              {ID === "1" ? (
                <NavLink
                  exact
                  to={`/adminDashboard/${ID}`}
                  activeClassName="activeClicked"
                  onClick={() => setActiveIndex(1)}
                >
                  <CDBSidebarMenuItem
                    icon="th-large"
                    style={getMenuItemStyle(1)}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    Dashboard
                  </CDBSidebarMenuItem>
                </NavLink>
              ) : (
                <NavLink
                  exact
                  to={`/operatorDashboard/${ID}`}
                  activeClassName="activeClicked"
                  onClick={() => setActiveIndex(1)}
                >
                  <CDBSidebarMenuItem
                    icon="th-large"
                    style={getMenuItemStyle(1)}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    Dashboard
                  </CDBSidebarMenuItem>
                </NavLink>
              )}


              <NavLink
                exact
                to="/addProject"
                activeClassName="activeClicked"
                onClick={() => setActiveIndex(2)}
              >
                <CDBSidebarMenuItem
                  icon="chart-line"
                  style={getMenuItemStyle(2)}
                  onMouseEnter={() => setHoverIndex(2)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  Create Projects
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                exact
                to="/viewProjects"
                activeClassName="activeClicked"
                onClick={() => setActiveIndex(3)}
              >
                <CDBSidebarMenuItem
                  icon="book"
                  style={getMenuItemStyle(3)}
                  onMouseEnter={() => setHoverIndex(3)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  View Projects
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                exact
                to="/donatorList"
                activeClassName="activeClicked"
                onClick={() => setActiveIndex(4)}
              >
                <CDBSidebarMenuItem
                  icon="shopping-bag"
                  style={getMenuItemStyle(4)}
                  onMouseEnter={() => setHoverIndex(4)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  DonatorList
                </CDBSidebarMenuItem>
              </NavLink>

            </CDBSidebarMenu>
          </CDBSidebarContent>

          <CDBSidebarFooter style={{ textAlign: "left" }}>
            <div
              style={{
                padding: "5px 5px",
                cursor: "pointer",
              }}
              onClick={logout}
            >
              <CDBSidebarMenuItem
                icon="user"
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  ...menuItemStyle,
                  ...(hoverIndex === 6 ? menuItemHoverStyle : {}),
                }}
                onMouseEnter={() => setHoverIndex(6)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                Logout
              </CDBSidebarMenuItem>
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>
      </div>
    </>
  );
};

export default Sidebar;
