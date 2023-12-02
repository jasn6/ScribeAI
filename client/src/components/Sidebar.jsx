import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ entries, setEntries, createFunc, deleteFunc, user }) => {
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();

  const toggleModal = () => {
    setShowLogout(!showLogout);
  };

  const handleOnClick = async (entryCode) => {
    navigate(`/main/${entryCode}`);
  };

  const handleDelete = async (entryId, e) => {
    e.stopPropagation(); // Prevent onClick event from firing when the delete button is clicked
    try {
      await fetch(`http://localhost:3001/api/entry/delete-entry/${entryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const indexToDelete = entries.findIndex((item) => item._id === entryId);

      // If the item is found (index is not -1), remove it from the list
      if (indexToDelete !== -1) {
        const updatedItems = [...entries];
        updatedItems.splice(indexToDelete, 1);
        setEntries(updatedItems);
      }
      navigate("/main");
    } catch (error) {
      // Handle error (e.g., show error message, log the error, etc.)
      console.error("Error deleting room:", error);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        //alert(data.message);
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <button className="create-button" onClick={createFunc}>
          <FaPlus /> Create
        </button>
        <div className="placeholder-div">
          <FaChevronLeft />
        </div>
      </div>
      <div className="entries">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="entry"
            onClick={() => handleOnClick(entry._id)}
          >
            <span className="entry-title">{entry.title}</span>
            <button
              className="delete-button"
              onClick={(e) => handleDelete(entry._id, e)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div
        className="user-display"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the sidebar onClick from being called
          toggleModal();
        }}
      >
        <div className="user-avatar">
          <img src="/path-to-avatar-image.jpg" alt="User Avatar" />
        </div>
        <div className="user-info">
          <h3 className="user-name">{user}</h3>
        </div>
        {showLogout && (
          <div className="logout-overlay">
            <button onClick={logoutUser}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
