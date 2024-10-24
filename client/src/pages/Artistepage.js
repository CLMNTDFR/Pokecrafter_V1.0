import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../actions/users.actions";
import { getAllArtworks } from "../actions/artwork.actions";
import { createConversation } from "../actions/conversation.actions"; 
import { isEmpty } from "../components/Utils";
import LeftNav from "../components/LeftNav";
import Trophy from "../components/Profil/Trophy";
import FollowHandler from "../components/Profil/FollowHandler";
import { UidContext } from "../components/AppContext";
import { Link, useNavigate } from "react-router-dom"; 

const ArtistePage = () => {
  const [loadUsers, setLoadUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersReducer);
  const artworks = useSelector((state) => state.artworkReducer);
  const uid = useContext(UidContext);
  const navigate = useNavigate();

  // Load users and artworks when the component mounts
  useEffect(() => {
    if (loadUsers) {
      dispatch(getUsers());
      dispatch(getAllArtworks());
      setLoadUsers(false);
    }
  }, [loadUsers, dispatch]);

  // Filter users based on search term and logged-in user
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user._id !== uid && 
          user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : [];

  // Toggle the selected user when a user is clicked
  const handleUserClick = (user) => {
    setSelectedUser((prevUser) =>
      prevUser && prevUser._id === user._id ? null : user
    );
  };

  // Retrieve the last 3 artworks for a specific user
  const getLastArtworks = (userId) => {
    return artworks
      .filter((artwork) => artwork.posterId === userId)
      .slice(0, 3);
  };

  // Handle image click to display the artwork in fullscreen mode
  const handleImageClick = (artwork) => {
    setFullScreenImage(artwork.picture);
    setIsImageFullScreen(true);
  };

  // Handle closing the fullscreen image modal
  const handleCloseFullScreen = () => {
    setIsImageFullScreen(false);
    setFullScreenImage(null);
  };

  // Create a conversation and navigate to messages
  const handleMessageClick = async (user) => {
    if (uid && user._id) {
      const conversation = await dispatch(createConversation(uid, user._id));
      if (conversation && conversation._id) {
        navigate(`/messages`);
      }
    }
  };

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3>Find a Crafter</h3>
          <br />
          <br />
        </div>
        <hr />
        {uid ? (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for a crafter"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
            </div>
            <ul>
              {!isEmpty(filteredUsers) &&
                filteredUsers.map((user) => (
                  <li key={user._id}>
                    <div className="artiste-artiste-container">
                      <div className="artiste-artiste-left">
                        <img
                          src={
                            user.picture ||
                            process.env.PUBLIC_URL +
                              "/img/uploads/profil/random-user.png"
                          }
                          alt="user-pic"
                        />
                      </div>
                      <div className="artiste-artiste-right">
                        <h3 onClick={() => handleUserClick(user)}>
                          <img
                            src="/img/icons/pokecrafter-up4.svg"
                            alt="toggle icon"
                            className={`toggle-icon ${
                              selectedUser && selectedUser._id === user._id
                                ? "hidden"
                                : "rotated"
                            }`}
                          />
                          <img
                            src="/img/icons/pokecrafter-down4.svg"
                            alt="toggle icon"
                            className={`toggle-icon ${
                              selectedUser && selectedUser._id === user._id
                                ? "rotated"
                                : "hidden"
                            }`}
                          />
                          {user.username}
                        </h3>
                      </div>
                      <div className="follow-handler-search">
                        <FollowHandler
                          idToFollow={user._id}
                          type={"suggestion"}
                        />
                      </div>
                    </div>

                    {selectedUser && selectedUser._id === user._id && (
                      <div className="artiste-user-details">
                        <div className="artiste-data-artist">
                          <p>
                            <span>
                              {user.following ? user.following.length : 0}
                            </span>{" "}
                            Subscription
                            {user.following && user.following.length > 1 && "s"}
                            <span className="bullet"> • </span>
                            <span>
                              {user.followers ? user.followers.length : 0}
                            </span>{" "}
                            Follower
                            {user.followers && user.followers.length > 1 && "s"}
                          </p>
                          <br />
                          <br />
                          <br />
                        </div>
                        <br />
                        <p>{user.bio}</p>
                        <br />

                        <div className="artiste-artworks-container">
                          {getLastArtworks(user._id).map((artwork) => (
                            <img
                              key={artwork._id}
                              src={
                                artwork?.picture
                                  ? artwork.picture
                                  : process.env.PUBLIC_URL +
                                    "/img/uploads/profil/random-artwork.png"
                              }
                              alt={`${user.username} - ${
                                artwork?.title ? artwork.title : "Artwork"
                              }`}
                              className="artiste-artwork-thumbnail"
                              onClick={() => handleImageClick(artwork)}
                            />
                          ))}
                        </div>
                        <br />
                        <Trophy userTrophies={user.trophies} />
                        <br />
                        <br />
                        <button
                          className="message-button"
                          onClick={() => handleMessageClick(user)}
                        >
                          Add to contact list
                        </button>
                        <br />
                        <br />
                      </div>
                    )}
                  </li>
                ))}
            </ul>

            {isImageFullScreen && (
              <div className="fullscreen-modal" onClick={handleCloseFullScreen}>
                <img
                  src={fullScreenImage}
                  alt="Fullscreen artwork"
                  className="fullscreen-image"
                />
              </div>
            )}
          </>
        ) : (
          <div className="centered-container">
            <Link to="/profil" className="please-login">
              Please Login to view artists
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistePage;
