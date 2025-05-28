// src/pages/CharactersList.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch, FiPlus, FiX, FiEdit, FiTrash } from "react-icons/fi";
import { BiWorld } from "react-icons/bi";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CharactersList() {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    image: "",
    gender: "male",
    world: "",
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showMine, setShowMine] = useState(false);
  const formRef = useRef(null);

  const API_URL = "https://68370703664e72d28e432cf6.mockapi.io/Characters";

  // auth info
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        // newest first
        setCharacters(res.data.slice().reverse());
      })
      .catch(() => toast.error("Failed to load characters"))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setNewCharacter({ name: "", image: "", gender: "male", world: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const handlePlusClick = () => {
    if (showForm) {
      setShowForm(false);
      return;
    }
    if (!isAuth) {
      toast.error("Please log in to add characters");
      return;
    }
    resetForm();
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleSubmit = () => {
    if (!isAuth) {
      toast.error("You must be logged in");
      return;
    }
    const { name, image, gender, world } = newCharacter;
    if (!name.trim()) return toast.error("Name is required");
    if (!image.trim()) return toast.error("Image URL is required");
    try {
      new URL(image);
    } catch {
      return toast.error("Invalid image URL");
    }
    if (!world.trim()) return toast.error("World is required");

    const payload = { name, image, gender, world, owner: userEmail };

    if (isEditing) {
      const orig = characters.find((c) => c.id === editId);
      if (!orig || orig.owner !== userEmail) {
        return toast.error("You can only edit your own characters");
      }
      axios
        .put(`${API_URL}/${editId}`, payload)
        .then((res) => {
          setCharacters((chars) =>
            chars.map((c) => (c.id === editId ? res.data : c))
          );
          toast.success("Character updated");
          resetForm();
          setShowForm(false);
        })
        .catch(() => toast.error("Failed to update character"));
    } else {
      axios
        .post(API_URL, payload)
        .then((res) => {
          setCharacters((chars) => [res.data, ...chars]); // prepend
          toast.success("Character added");
          resetForm();
          setShowForm(false);
        })
        .catch(() => toast.error("Failed to add character"));
    }
  };

  const handleEdit = (char) => {
    if (!isAuth || char.owner !== userEmail) {
      toast.error("You can only edit your own characters");
      return;
    }
    setNewCharacter({
      name: char.name,
      image: char.image,
      gender: char.gender,
      world: char.world || "",
    });
    setIsEditing(true);
    setEditId(char.id);
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleDelete = (char) => {
    if (!isAuth || char.owner !== userEmail) {
      toast.error("You can only delete your own characters");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${char.name}"?`)) {
      return;
    }
    axios
      .delete(`${API_URL}/${char.id}`)
      .then(() => {
        setCharacters((chars) => chars.filter((c) => c.id !== char.id));
        toast.info("Character deleted");
      })
      .catch(() => toast.error("Failed to delete character"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  let filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (showMine) {
    filtered = filtered.filter((c) => c.owner === userEmail);
  }

  return (
    <div className="relative min-h-screen bg-gray-100 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Character Gallery
          </h1>
          <p className="mt-2 text-gray-600">
            {isAuth ? `Logged in as ${userEmail}` : "Please log in"}
          </p>
        </header>

        {/* Search & Add Toggle */}
        <div className="relative w-full max-w-md mx-auto mb-6">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search characters..."
            className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {showForm ? (
            <FiX
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-600 cursor-pointer"
              size={24}
              onClick={handlePlusClick}
            />
          ) : (
            <FiPlus
              className={`absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600 ${
                !isAuth ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              size={24}
              onClick={handlePlusClick}
            />
          )}
        </div>

        {/* Ownership Filter */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowMine((v) => !v)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {showMine ? "Show All" : "Show Mine"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div
            ref={formRef}
            className="mb-16 bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isEditing ? "Edit Character" : "Add New Character"}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newCharacter.name}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newCharacter.image}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, image: e.target.value })
                }
              />
              <select
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newCharacter.gender}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, gender: e.target.value })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="text"
                placeholder="World"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newCharacter.world}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, world: e.target.value })
                }
              />
              <button
                onClick={handleSubmit}
                className="mt-4 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                {isEditing ? "Save Changes" : "Add Character"}
              </button>
            </div>
          </div>
        )}

        {/* Character Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((char) => (
              <div
                key={char.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {char.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    char.gender === "male"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-pink-100 text-pink-600"
                  }`}
                >
                  {char.gender}
                </span>
                {char.world && (
                  <p className="text-neutral-600 text-sm mt-2 flex justify-center items-center gap-1">
                    <BiWorld />
                    {char.world}
                  </p>
                )}
                {isAuth && char.owner === userEmail && (
                  <div className="flex space-x-3 mt-4">
                    <FiEdit
                      className="cursor-pointer text-gray-600 hover:text-indigo-600"
                      onClick={() => handleEdit(char)}
                    />
                    <FiTrash
                      className="cursor-pointer text-gray-600 hover:text-red-600"
                      onClick={() => handleDelete(char)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500 text-lg mt-6">
            Oops! No characters found.
          </p>
        )}
      </div>
    </div>
  );
}
