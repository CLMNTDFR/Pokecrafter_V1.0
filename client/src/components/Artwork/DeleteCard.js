import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteArtwork } from '../../actions/artwork.actions';

const DeleteCard = (props) => {
    const dispatch = useDispatch();

    const deleteQuote = () => {
        console.log("Attempting to delete artwork with ID:", props.id);
        dispatch(deleteArtwork(props.id));
    };

    return (
        <div className="delete-button" onClick={() => {
            if (window.confirm("Do you really want to delete this artwork?")) {
                deleteQuote();
            }
        }}>
            <img src="./img/icons/trash.svg" alt="delete" className="delete-icon" />
        </div>
    );
};

export default DeleteCard;