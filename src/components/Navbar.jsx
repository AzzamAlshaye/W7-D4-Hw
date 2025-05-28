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
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUserName(storedUser.fullName || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setAuth(false);
    navigate("/login");
  };

  const linkClass = (path) => `block px-6 py-3 font-medium rounded-md transition
     ${
       pathname === path
         ? "bg-black text-white"
         : "text-black hover:bg-neutral-900 hover:text-white"
     }`;

  return (
    <nav className="bg-neutral-200 shadow-md">
      <div className="container-xl mx-auto flex items-center justify-between lg:justify-start gap-4 lg:gap-10 p-4">
        {/* Branding */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="logo.svg" alt="Logo" className="h-10" />
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
                className="block px-6 py-3 font-medium rounded-md transition bg-black text-white "
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block px-6 py-3 font-medium rounded-md transition bg-neutral-500 text-white "
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="block px-6 py-3 font-medium text-black">
                {userName}
              </span>
              <button
                onClick={handleLogout}
                className="block px-6 py-3 font-medium rounded-md text-black hover:bg-neutral-900 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden focus:outline-none text-black"
        >
          {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden bg-neutral-200 overflow-hidden transition-[max-height] duration-300 ${
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
                className="block px-6 py-3 font-medium rounded-md transition bg-black text-white "
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 font-medium rounded-md transition bg-neutral-700 text-white "
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="px-6 py-3 font-medium text-black">
                {userName}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-6 py-3 font-medium rounded-md text-black hover:bg-neutral-900 hover:text-white"
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
