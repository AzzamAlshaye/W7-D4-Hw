import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch, FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CharactersList() {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    image: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);

  const API_URL = "https://68370703664e72d28e432cf6.mockapi.io/Characters";

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => setCharacters(res.data))
      .catch((err) => toast.error("Failed to load characters"))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setNewCharacter({ name: "", image: "", gender: "male" });
    setIsEditing(false);
    setEditId(null);
  };

  const handlePlusClick = () => {
    resetForm();
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleSubmit = () => {
    const { name, image, gender } = newCharacter;
    if (!name.trim()) return toast.error("Name is required");
    if (!image.trim()) return toast.error("Image URL is required");

    if (isEditing) {
      axios
        .put(`${API_URL}/${editId}`, { name, image, gender })
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
        .post(API_URL, { name, image, gender })
        .then((res) => {
          setCharacters((chars) => [...chars, res.data]);
          toast.success("Character added");
          resetForm();
          setShowForm(false);
        })
        .catch(() => toast.error("Failed to add character"));
    }
  };

  const handleEdit = (char) => {
    setNewCharacter({
      name: char.name,
      image: char.image,
      gender: char.gender,
    });
    setIsEditing(true);
    setEditId(char.id);
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this character?")) return;
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setCharacters((chars) => chars.filter((c) => c.id !== id));
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

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-100 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Character Gallery
          </h1>
          <p className="mt-2 text-gray-600">
            Browse and manage your characters.
          </p>
        </header>

        <div className="relative w-full max-w-md mx-auto mb-10">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search characters..."
            className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiPlus
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600 cursor-pointer"
            size={24}
            onClick={handlePlusClick}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((char) => (
              <div
                key={char.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center relative"
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
                <div className="flex space-x-3 mt-4">
                  <FiEdit
                    className="cursor-pointer text-gray-600 hover:text-indigo-600"
                    onClick={() => handleEdit(char)}
                  />
                  <FiTrash
                    className="cursor-pointer text-gray-600 hover:text-red-600"
                    onClick={() => handleDelete(char.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500 text-lg mt-6">
            Oops! No characters found.
          </p>
        )}

        {showForm && (
          <div
            ref={formRef}
            className="mt-16 bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto"
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
              <button
                onClick={handleSubmit}
                className="mt-4 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                {isEditing ? "Save Changes" : "Add Character"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
