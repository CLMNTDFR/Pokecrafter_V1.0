import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getArtworks } from "../../actions/artwork.actions"; // Assure-toi que getArtworks est bien importé
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from "./EditDeleteComment"; // Composant pour gérer l'édition et la suppression des commentaires

const CardComments = ({ artwork }) => {
  const [text, setText] = useState(""); // État pour le texte du nouveau commentaire
  const usersData = useSelector((state) => state.usersReducer); // Tous les utilisateurs
  const userData = useSelector((state) => state.userReducer); // Données de l'utilisateur connecté
  const dispatch = useDispatch();

  // Fonction pour gérer l'ajout d'un commentaire
  const handleComment = (e) => {
    e.preventDefault();

    if (text) {
      dispatch(
        addComment(artwork._id, userData._id, text, userData.pseudo) // Ajout du commentaire avec les infos requises
      )
        .then(() => dispatch(getArtworks())) // Mise à jour des artworks après ajout
        .then(() => setText("")); // Réinitialise le champ de texte après envoi
    }
  };

  return (
    <div className="comments-container">
      {/* Affichage des commentaires existants */}
      {artwork.comments && artwork.comments.length > 0 ? (
        artwork.comments.map((comment) => {
          // Trouver l'utilisateur qui a posté le commentaire
          const commenter =
            !isEmpty(usersData) &&
            usersData.find((user) => user._id === comment.commenterId);

          return (
            <div className="comment-container">
              <div className="left-part">
                <img
                  src={
                    commenter && commenter.picture
                      ? commenter.picture
                      : process.env.PUBLIC_URL +
                        "/img/uploads/profil/random-user.png" // Avatar par défaut
                  }
                  alt={
                    commenter
                      ? `Profile picture of ${commenter.username}`
                      : "Default user picture"
                  }
                />
              </div>
              <div className="right-part">
                <div className="comment-header">
                  <div className="pseudo">
                    <h3>{comment.commenterPseudo}</h3>
                  </div>
                  <span>{timestampParser(comment.timestamp)}</span>
                </div>
                <p>{comment.text}</p>
                {/* Ajout du composant pour éditer ou supprimer le commentaire */}
                <EditDeleteComment comment={comment} postId={artwork._id} />
              </div>
            </div>
          );
        })
      ) : (
        <p>No comments yet</p> // Message si aucun commentaire n'est présent
      )}

      {/* Formulaire pour ajouter un nouveau commentaire */}
      {userData._id && (
        <form action="" onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            name="text"
            id="text"
            placeholder="Leave a comment..."
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <br />
          <input type="submit" value="Send" />
        </form>
      )}
    </div>
  );
};

export default CardComments;