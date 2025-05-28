// src/routes/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/HomePage";
import CharactersList from "../pages/CharactersList";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";

function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "characters", element: <CharactersList /> },
      // …any other public pages that need Nav/Footer
    ],
  },

  // standalone auth pages (no RootLayout)
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <Register /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
