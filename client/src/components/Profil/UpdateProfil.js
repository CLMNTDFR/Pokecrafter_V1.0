import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadImg from "./UploadImg";
import { updateBio } from "../../actions/user.actions";
import { dateParser } from "../Utils";
import FollowHandler from "./FollowHandler";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);

  const handleUpdate = () => {
    dispatch(updateBio(userData._id, bio));
    setUpdateForm(false);
  };

  return (
    <div className="profil-container">
      <div className="update-container">
        <div className="left-part">
          <h3>Profile picture</h3>
          <br />
          <img src={userData.picture} alt="user-profil-picture" />
          <br />
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
            Following: {userData.following ? userData.following.length : ""}
          </h5>
          <h5 onClick={() => setFollowersPopup(true)}>
            <img
              src="/img/icons/followers.svg"
              alt="followers icon"
              className="icon"
            />
            Followers: {userData.followers ? userData.followers.length : ""}
          </h5>
        </div>
      </div>
      {followingPopup && (
        <div className="popup-profil-container">
          <div className="modal">
            <h3>Following</h3>
            <span onClick={() => setFollowingPopup(false)} className="cross">
              ✖
            </span>
            <ul>
              {usersData
                .filter((user) => userData.following.includes(user._id)) // Filtre les utilisateurs suivis
                .map(
                  (
                    user // Map uniquement sur les utilisateurs filtrés
                  ) => (
                    <li key={user._id}>
                      <img src={user.picture} alt="user-profil-picture" />
                      <h4>{user.username}</h4>
                      <div className="follow-handler">
                        <FollowHandler idToFollow={user._id} />
                      </div>
                    </li>
                  )
                )}
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
                .filter((user) => userData.followers.includes(user._id)) // Filtre les utilisateurs suivis
                .map(
                  (
                    user // Map uniquement sur les utilisateurs filtrés
                  ) => (
                    <li key={user._id}>
                      <img src={user.picture} alt="user-profil-picture" />
                      <h4>{user.username}</h4>
                      <div className="follow-handler">
                        <FollowHandler idToFollow={user._id} />
                      </div>
                    </li>
                  )
                )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfil;
