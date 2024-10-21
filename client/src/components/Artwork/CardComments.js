import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getArtworks } from "../../actions/artwork.actions";
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from "./EditDeleteComment";

const CardComments = ({ artwork }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  // Handle the submission of a new comment
  const handleComment = (e) => {
    e.preventDefault();

    if (text && userData?._id) {
      dispatch(addComment(artwork._id, userData._id, text, userData.username))
        .then(() => dispatch(getArtworks()))
        .then(() => setText(""));
    }
  };

  return (
    <div className="comments-container">
      {artwork.comments && artwork.comments.length > 0 ? (
        artwork.comments.map((comment) => {
          const commenter =
            !isEmpty(usersData) &&
            usersData.find((user) => user._id === comment.commenterId);

          return (
            <div className="comment-container" key={comment._id}>
              <div className="left-part">
                <img
                  src={
                    commenter && commenter.picture
                      ? commenter.picture
                      : `${process.env.PUBLIC_URL}/img/uploads/profil/random-user.png`
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
                <EditDeleteComment comment={comment} artworkId={artwork._id} />
              </div>
            </div>
          );
        })
      ) : (
        <p>No comments yet</p>
      )}

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
