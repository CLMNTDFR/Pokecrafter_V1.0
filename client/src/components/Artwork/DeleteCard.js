import React from "react";
import { useDispatch } from "react-redux";
import { deleteArtwork } from "../../actions/artwork.actions";

const DeleteCard = (props) => {
  const dispatch = useDispatch();

  // Dispatch delete action for artwork
  const deleteQuote = () => {
    dispatch(deleteArtwork(props.id));
  };

  return (
    <div
      className="delete-button"
      onClick={() => {
        if (window.confirm("Do you really want to delete this artwork?")) {
          deleteQuote();
        }
      }}
    >
      <img src="./img/icons/pokecrafter-trash.svg" alt="delete" className="delete-icon" />
    </div>
  );
};

export default DeleteCard;
