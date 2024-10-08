import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadImg from "./UploadImg";
import { updateBio } from "../../actions/user.actions";
import { dateParser } from "../Utils";
import FollowHandler from "./FollowHandler";
import Trophy from "./Trophy";
import CardUser from "../Artwork/CardUser";
import { getArtworks } from "../../actions/artwork.actions";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const artworks = useSelector((state) => state.artworkReducer);
  const dispatch = useDispatch();
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);
  const user = useSelector((state) => state.userReducer);

  const handleUpdate = () => {
    dispatch(updateBio(userData._id, bio));
    setUpdateForm(false);
  };

  useEffect(() => {
    dispatch(getArtworks());

    if (userData.bio) {
      setBio(userData.bio);
    }
  }, [dispatch, userData.bio]);

  return (
    <div className="profil-container">
      <div className="update-container">
        <div className="left-part">
          <h3>Profile picture</h3>
          <br />
          <img src={userData.picture} alt="user-profil-picture" />
          <UploadImg />
        </div>
        <div className="right-part">
          <div className="bio-update">
            <h3>About you</h3>
            {updateForm === false && (
              <>
                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                <button onClick={() => setUpdateForm(!updateForm)}>
                  Update bio
                </button>
              </>
            )}
            {updateForm && (
              <>
                <textarea
                  type="text"
                  defaultValue={userData.bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <button onClick={handleUpdate}>Validate update</button>
              </>
            )}
          </div>
          <h4>• Crafter since {dateParser(userData.createdAt)} •</h4>
          <h5 onClick={() => setFollowingPopup(true)}>
            <img
              src="/img/icons/following.svg"
              alt="following icon"
              className="icon"
            />
            Subscription
            {userData.following && userData.following.length > 1 && "s"}:{" "}
            {userData.following ? userData.following.length : ""}
          </h5>
          <h5 onClick={() => setFollowersPopup(true)}>
            <img
              src="/img/icons/followers.svg"
              alt="followers icon"
              className="icon"
            />
            Follower{userData.followers && userData.followers.length > 1 && "s"}
            : {userData.followers ? userData.followers.length : ""}
          </h5>
        </div>
      </div>
      <br />
      <Trophy userTrophies={user.trophies} />
      <br />
      <br />
      <br />

      <div className="user-artworks">
        <br />
        <h3 style={{ textAlign: "center", marginBottom: "-80px" }}>
          Your Artworks
        </h3>

        <ul>
          {artworks &&
            artworks
              .filter((artwork) => artwork.posterId === userData._id)
              .map((artwork) => (
                <CardUser key={artwork._id} artwork={artwork} />
              ))}
        </ul>
        <br />
        <br />
        <br />
      </div>

      {followingPopup && (
        <div className="popup-profil-container">
          <div className="modal">
            <h3>
              Subscription
              {userData.following && userData.following.length > 1 && "s"}
            </h3>
            <span onClick={() => setFollowingPopup(false)} className="cross">
              ✖
            </span>
            <ul>
              {usersData
                .filter((user) => userData.following.includes(user._id))
                .map((user) => (
                  <li key={user._id}>
                    <img src={user.picture} alt="user-profil-picture" />
                    <h4>{user.username}</h4>
                    <div className="follow-handler">
                      <FollowHandler
                        idToFollow={user._id}
                        type={"suggestion"}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {followersPopup && (
        <div className="popup-profil-container">
          <div className="modal">
            <h3>Followers</h3>
            <span onClick={() => setFollowersPopup(false)} className="cross">
              ✖
            </span>
            <ul>
              {usersData
                .filter((user) => userData.followers.includes(user._id))
                .map((user) => (
                  <li key={user._id}>
                    <img src={user.picture} alt="user-profil-picture" />
                    <h4>{user.username}</h4>
                    <div className="follow-handler">
                      <FollowHandler
                        idToFollow={user._id}
                        type={"suggestion"}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfil;
