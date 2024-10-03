import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../../actions/artwork.actions"; // Import des actions spécifiques aux artworks
import { UidContext } from "../AppContext"; // Contexte pour l'UID de l'utilisateur

const EditDeleteComment = ({ comment, artworkId }) => {
  const [isAuthor, setIsAuthor] = useState(false); // Pour vérifier si l'utilisateur est l'auteur du commentaire
  const [edit, setEdit] = useState(false); // Mode édition
  const [text, setText] = useState(""); // Stockage du texte du commentaire
  const uid = useContext(UidContext); // Utilisation du contexte UID
  const dispatch = useDispatch();

  // Fonction pour gérer la modification d'un commentaire
  const handleEdit = (e) => {
    e.preventDefault();

    if (text) {
      dispatch(editComment(artworkId, comment._id, text)); // Dispatch l'action pour modifier le commentaire
      setText("");
      setEdit(false); // Désactive le mode édition après modification
    }
  };

  // Fonction pour gérer la suppression d'un commentaire
  const handleDelete = () => {
    if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
      dispatch(deleteComment(artworkId, comment._id)); // Dispatch l'action pour supprimer le commentaire
    }
  };

  // Vérification si l'utilisateur est l'auteur du commentaire
  useEffect(() => {
    const checkAuthor = () => {
      if (uid === comment.commenterId) {
        setIsAuthor(true); // L'utilisateur est l'auteur du commentaire
      }
    };
    checkAuthor();
  }, [uid, comment.commenterId]);

  return (
    <div className="edit-comment">
      {/* Affichage de l'icône d'édition si l'utilisateur est l'auteur */}
      {isAuthor && edit === false && (
        <span onClick={() => setEdit(!edit)}>
          <img src="./img/icons/edit.svg" alt="edit-comment" />
        </span>
      )}
      
      {/* Mode édition du commentaire */}
      {isAuthor && edit && (
        <form action="" onSubmit={handleEdit} className="edit-comment-form">
          <label htmlFor="text" onClick={() => setEdit(!edit)}>
            Editer
          </label>
          <br />
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            defaultValue={comment.text} // Valeur par défaut du champ texte
          />
          <br />
          <div className="btn">
            {/* Bouton pour supprimer le commentaire */}
            <span onClick={handleDelete}>
              <img src="./img/icons/trash.svg" alt="delete" />
            </span>
            <input type="submit" value="Valider modification" />
          </div>
        </form>
      )}
    </div>
  );
};

export default EditDeleteComment;
