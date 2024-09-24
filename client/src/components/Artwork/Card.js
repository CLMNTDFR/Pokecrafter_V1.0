import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dateParser } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import LikeButton from "./LikeButton";

const Card = ({ artwork }) => {
  const [isLoading, setIsLoading] = useState(true);
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setIsLoading(false);
    }
  }, [usersData]);

  const poster = artwork && artwork.posterId 
    ? usersData.find((user) => String(user._id) === String(artwork.posterId)) 
    : null;

  return (
    <li className="card-container" key={artwork?._id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="card-left">
            <img
              src={poster && poster.picture 
                ? poster.picture 
                : process.env.PUBLIC_URL + "/img/uploads/profil/random-user.png"}
              alt={poster ? `Photo de profil de ${poster.username}` : "Photo de profil par défaut"}
            />
          </div>
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h4>{poster ? poster.username : "Utilisateur inconnu"}</h4>
                {artwork && artwork.posterId !== userData._id && (
                  <FollowHandler idToFollow={artwork.posterId} type={"card"} />
                )}
              </div>
              <span>{artwork ? dateParser(artwork.createdAt) : ""}</span>
            </div>
            <p>{artwork?.description}</p>
            <img 
              src={artwork?.picture ? artwork.picture : process.env.PUBLIC_URL + "/img/uploads/profil/random-artwork.png"}
              alt={`${poster ? poster.username : "Utilisateur inconnu"} - ${artwork?.title ? artwork.title : "Artwork"}`}
              className="card-pic"
            />


            <div className="card-footer">
              <div className="comment-icon">
                <img src="/img/icons/message1.svg" alt="comment" />
                <span>{artwork.comments.length}</span>
              </div>

              <LikeButton artwork={artwork} />

              <img src="./img/icons/share.svg" alt="share" />
            </div>
          </div>
        </>
      )}
    </li>
  );
};

export default Card;
