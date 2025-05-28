// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { IoMenu, IoClose } from "react-icons/io5";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    setAuth(isAuth);
    if (isAuth) {
      const fullName = localStorage.getItem("fullName");
      setUserName(fullName || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    setAuth(false);
    navigate("/login");
  };

  const linkClass = (path) =>
    `block px-6 py-3 font-medium rounded-md transition ${
      pathname === path
        ? "bg-white text-black"
        : "text-white hover:bg-neutral-200 hover:text-black"
    }`;

  return (
    <nav className="bg-neutral-800 text-white shadow-md">
      <div className="container-xl mx-auto flex items-center justify-between lg:justify-start gap-4 lg:gap-10 p-4">
        {/* Branding */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="logo.w.svg" alt="Logo" className="h-10  " />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex space-x-4">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/characters" className={linkClass("/characters")}>
            Characters
          </Link>
        </div>

        {/* Desktop auth links (Login/Register or User + Logout) */}
        <div className="hidden lg:flex items-center space-x-4 ml-auto">
          {!auth ? (
            <>
              <Link
                to="/register"
                className="block px-6 py-3 font-medium rounded-md transition bg-white text-black hover:bg-neutral-200 hover:text-neutral-800 hover:scale-101"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block px-6 py-3 font-medium rounded-md transition bg-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 text-white hover:scale-101"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="block px-6 py-3 font-medium text-white">
                {`Welcome, ${userName}`}
              </span>
              <button
                onClick={handleLogout}
                className="block px-6 py-3 font-medium rounded-md text-white border border-white hover:bg-white hover:text-black"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden focus:outline-none text-white"
        >
          {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden bg-neutral-900 overflow-hidden transition-[max-height] duration-300 ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col">
          <li>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={linkClass("/")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/characters"
              onClick={() => setMenuOpen(false)}
              className={linkClass("/characters")}
            >
              Characters
            </Link>
          </li>
        </ul>

        {/* Mobile auth row */}
        <div className="flex justify-center space-x-4 py-2">
          {!auth ? (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 font-medium rounded-md transition bg-white text-black"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 font-medium rounded-md transition bg-neutral-300 text-black"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="px-3 py-3 font-medium text-white">
                {`Welcome, ${userName}`}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-6 py-3 font-medium rounded-md text-white border border-white hover:bg-white hover:text-black"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
