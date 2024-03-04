import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js";
import "admin-lte/dist/js/adminlte.min.js";
import { useAuth } from "./AuthContext";
import $ from "jquery";
import { Link } from "react-router-dom";

const Menu = () => {
  const treeviewRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const { isLoggedIn, logout } = useAuth();
  const storedUsername = localStorage.getItem('username');

  useEffect(() => {
    $(treeviewRef.current).Treeview("init");
    $(treeviewRef.current).on("treeview:opened", (event, openedItem) => {
      if (activeItem && activeItem !== openedItem) {
        $(activeItem).Treeview("close");
      }
      setActiveItem(openedItem);
    });
    $(treeviewRef.current).on("treeview:closed", () => {
      setActiveItem(null);
    });
  }, [activeItem]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-container">
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="/" className="brand-link text-center">
        <img 
          src="../public/logoblanco.png"
          alt="AdminLTE Logo"
          className="brand-image elevation-3 float-lg-none"
          style={{ opacity: ".8" }}
        />
        <br></br>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel" style={{textAlign:"center"}}>
          <div className="info">
            <p href="#" style={{ color:"#D6B855", textAlign: "center" }}>
              <b>{isLoggedIn ? storedUsername : "Invitado"}</b>
            </p>
          </div>
        </div>
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
            className="nav nav-pills nav-sidebar flex-column flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="true"
          >
            <li className="nav-item">
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="./index.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Dashboard v1</p>
                  </a>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${
                location.pathname === "/ticket", "/" ? "menu-open" : ""
              }`}
            >
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-edit" />
                <p>
                  Formulario
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link
                    to="/ticket"
                    className={`nav-link ${
                      location.pathname === "/ticket" ? "active" : ""
                    }`}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Ticket</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/inventory"
                    className={`nav-link ${
                      location.pathname === "/inventory" ? "active" : ""
                    }`}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Inventario</p>
                  </Link>
                </li>
              </ul>
            </li>

            <Link
              onClick={() => {
                handleLogout();
                history.push("/");
              }}
              className="nav-link"
            >
              <i className="nav-icon fas fa-solid fa-right-from-bracket" />
              <p>Logout</p>
            </Link>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
    </div>
  );
};

export default Menu;
