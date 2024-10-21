import React from "react";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../actions/user.actions";
import { useNavigate } from "react-router-dom";

const DeleteAccountButton = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Displays a confirmation window and then redirects to the homepage
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      dispatch(deleteUser(userId)).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <div className="delete-account-container">
      <button onClick={handleDelete} className="delete-account-btn">
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccountButton;
