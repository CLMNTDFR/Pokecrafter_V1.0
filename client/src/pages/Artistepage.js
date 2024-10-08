import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../actions/users.actions";
import { isEmpty } from "../components/Utils";
import LeftNav from "../components/LeftNav";
import FollowHandler from "../components/Profil/FollowHandler";
import { UidContext } from "../components/AppContext";
import { Link } from "react-router-dom";

const Artistepage = () => {
  const [loadUsers, setLoadUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersReducer);
  const uid = useContext(UidContext);

  useEffect(() => {
    if (loadUsers) {
      dispatch(getUsers());
      setLoadUsers(false);
    }
  }, [loadUsers, dispatch]);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : [];

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
                  <li key={user._id} className="artiste-container">
                    <div className="artiste-left">
                      <img
                        src={
                          user.picture ||
                          process.env.PUBLIC_URL +
                            "/img/uploads/profil/random-user.png"
                        }
                        alt="user-pic"
                      />
                    </div>
                    <div className="artiste-right">
                      <h3>{user.username}</h3>
                    </div>
                    <div className="follow-handler-search">
                      <FollowHandler
                        idToFollow={user._id}
                        type={"suggestion"}
                      />
                    </div>
                  </li>
                ))}
            </ul>
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

export default Artistepage;
