import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { isEmpty, timestampParser } from "../Utils";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addArtwork, getArtworks } from "../../actions/artwork.actions";

const MAX_FILE_SIZE = 500000;

const NewArtworkForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("AI");
  const [description, setDescription] = useState("");
  const [artworkPicture, setArtworkPicture] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const generateTitle = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return `${userData.username}-${category}-${formattedDate}`;
  };

  const handlePost = async () => {
    if (category && description && artworkPicture) {
      const data = new FormData();
      data.append("posterId", userData._id);
      data.append("title", generateTitle());
      data.append("category", category);
      data.append("description", description);
      if (file) data.append("file", file);
      data.append("picture", artworkPicture);

      await dispatch(addArtwork(data));
      dispatch(getArtworks());
      window.location.href = "/";
      cancelPost();
    } else {
      alert("Please enter all fields (category, description, picture)");
    }
  };

  const handlePicture = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File size exceeds 500 KB. Please choose a smaller file.");
        setArtworkPicture("");
        setFile(null);
      } else {
        setError("");
        setArtworkPicture(URL.createObjectURL(selectedFile));
        setFile(selectedFile);
      }
    }
  };

  const cancelPost = () => {
    setCategory("AI");
    setDescription("");
    setArtworkPicture("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
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
          <NavLink to="/profil">
            <div className="user-info">
              <img src={userData.picture} alt="user-pic" />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="description"
              id="description"
              placeholder="Describe your artwork ..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
            <br />
            <br />
            <div className="label-img-select">Choose an image</div>
            <input
              type="file"
              id="file"
              name="file"
              className="file-input-custom"
              accept=".jpg, .jpeg"
              onChange={handlePicture}
              ref={fileInputRef}
            />
            {error && <div className="error-message">{error}</div>}
            <br />
            <br />
            <div className="label-img-select">
              Select a category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="AI">AI</option>
                <option value="3D">3D</option>
                <option value="DigitalArt">Digital Art</option>
                <option value="Handcraft">Handcraft</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <br />
            <br />
            <div className="btn-send">
              {(description || artworkPicture) && (
                <button className="cancel" onClick={cancelPost}>
                  Cancel
                </button>
              )}
              <button className="send" onClick={handlePost}>
                Post
              </button>
              <br />
            </div>
            {description || artworkPicture ? (
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
                  {artworkPicture && (
                    <img
                      src={artworkPicture}
                      alt="artwork-picture"
                      className="card-pic"
                    />
                  )}
                  <p className="description">{description}</p>
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
