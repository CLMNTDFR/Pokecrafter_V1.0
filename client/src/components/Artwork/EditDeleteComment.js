import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../../actions/artwork.actions";
import { UidContext } from "../AppContext";

const EditDeleteComment = ({ comment, artworkId }) => {
  const [isAuthor, setIsAuthor] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(comment.text);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  // Handle comment editing
  const handleEdit = (e) => {
    e.preventDefault();
    if (text) {
      dispatch(editComment(artworkId, comment._id, text));
      setEdit(false);
    }
  };

  // Handle comment deletion
  const handleDelete = () => {
    if (window.confirm("Do you want to delete this comment?")) {
      dispatch(deleteComment(artworkId, comment._id));
    }
  };

  // Check if the current user is the author of the comment
  useEffect(() => {
    const checkAuthor = () => {
      if (uid === comment.commenterId) {
        setIsAuthor(true);
      }
    };
    checkAuthor();
  }, [uid, comment.commenterId]);

  return (
    <div className="edit-comment">
      {isAuthor && (
        <span onClick={() => setEdit((prev) => !prev)}>
          <img src="./img/icons/pokecrafter-edit.svg" alt="edit-comment" />
        </span>
      )}

      {isAuthor && edit && (
        <form action="" onSubmit={handleEdit} className="edit-comment-form">
          <br />
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <br />
          <div className="button-container">
            <input type="submit" value="Change" />
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditDeleteComment;
