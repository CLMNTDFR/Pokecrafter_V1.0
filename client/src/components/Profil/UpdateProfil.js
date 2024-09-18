import React from 'react';
import { useSelector } from 'react-redux';
import UploadImg from './UploadImg';

const UpdateProfil = () => {
    const userData = useSelector((state) => state.userReducer);
    
    return (
        <div className="profil-container">
            <h1>Crafter : {userData.username}</h1>
            <br />
            <div className="update-container">
                <div className="left-part">
                    <h4>Profil picture</h4>
                    <br />
                    <img src={userData.picture} alt="user-profil-picture" />
                    <br />
                    <UploadImg />
                </div>
            </div>
        </div>
    );
};

export default UpdateProfil;