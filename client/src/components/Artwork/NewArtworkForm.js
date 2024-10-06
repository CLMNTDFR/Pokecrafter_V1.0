import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { isEmpty, timestampParser } from "../Utils";
import { NavLink } from "react-router-dom";

const NewArtworkForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [artworkPicture, setArtworkPicture] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const userData = useSelector((state) => state.userReducer);

  const handlePost = () => {
    if (message || file) {
      const data = new FormData();
      data.append("posterId", userData._id);
      data.append("message", message);
      if (file) data.append("file", file);
      data.append("picture", artworkPicture);
      fetch("http://localhost:5000/api/artworks/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: data,
      })
        .then((res) => res.json())
        .then(() => {
          setMessage("");
          setArtworkPicture("");
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        })
        .catch((err) => console.error(err));
    } else {
      alert("Please enter a message and choose a picture");
    }
  };

  const handlePicture = (e) => {
    setArtworkPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const cancelPost = () => {
    setMessage("");
    setArtworkPicture("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData]);

  return (
    <div className="post-container">
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="data">
            <p>
              <span>{userData.following ? userData.following.length : 0}</span>{" "}
              Subscription
              {userData.following && userData.following.length > 1 && "s"}
            </p>
            <p>
              <span>{userData.followers ? userData.followers.length : 0}</span>{" "}
              Follower
              {userData.followers && userData.followers.length > 1 && "s"}
            </p>
          </div>
          <NavLink exact to="/profil">
            <div className="user-info">
              <img src={userData.picture} alt="user-pic" />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="message"
              id="message"
              placeholder="Describe your artwork ..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            ></textarea>
            <br />
            <label htmlFor="file">Choose an image</label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handlePicture(e)}
              ref={fileInputRef}
            />
            <br />
            <div className="btn-send">
              {(message || artworkPicture) && (
                <button className="cancel" onClick={cancelPost}>
                  Cancel
                </button>
              )}
              <button className="send" onClick={handlePost}>
                Post
              </button>
            </div>
            {message || artworkPicture ? (
              <li className="card-container">
                <div className="card-left">
                  <img src={userData.picture} alt="user-pic" />
                </div>
                <div className="card-right">
                  <div className="card-header">
                    <div className="pseudo">
                      <h4>{userData.username}</h4>
                    </div>
                    <span>{timestampParser(Date.now())}</span>
                  </div>
                  <img
                    src={artworkPicture}
                    alt="artwork-picture"
                    className="card-pic"
                  />
                  <p className="description">{message}</p>
                </div>
              </li>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default NewArtworkForm;
